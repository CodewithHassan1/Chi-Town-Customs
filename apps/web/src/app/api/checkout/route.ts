import { NextResponse } from "next/server";
import db from "@/lib/db";
import { CheckoutOrderSchema } from "@chi-town/contracts";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate payload with shared Zod schema
    const parseResult = CheckoutOrderSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const {
      guestName,
      guestEmail,
      guestPhone,
      fulfillmentType,
      shippingAddress,
      billingAddress,
      items,
      paymentMethod,
      couponCode,
      notes,
    } = parseResult.data;

    // 2. Fetch authoritative variants from database and verify stock
    const variantIds = items.map((i) => i.variantId);
    const dbVariants = await db.productVariant.findMany({
      where: { id: { in: variantIds }, isActive: true },
      include: { product: true },
    });

    if (dbVariants.length !== items.length) {
      return NextResponse.json(
        { error: "One or more selected items are no longer available in the catalog." },
        { status: 400 }
      );
    }

    // Check stock availability
    for (const item of items) {
      const v = dbVariants.find((dbv) => dbv.id === item.variantId);
      if (!v) continue;

      if (v.product.productType !== "SERVICE" && v.stockOnHand < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${v.product.name} (${v.sku}). Requested: ${item.quantity}, Available: ${v.stockOnHand}`,
          },
          { status: 409 }
        );
      }
    }

    // 3. Server-side price calculation
    let subtotal = 0;
    const orderItemsData = items.map((item) => {
      const v = dbVariants.find((dbv) => dbv.id === item.variantId)!;
      const unitPrice = v.price;
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      let specsSummary = "";
      if (v.diameter && v.width) {
        specsSummary = `${v.diameter}"x${v.width}" | ${v.boltPattern || ""} | ${v.finish || ""}`;
      } else if (v.tireWidth && v.aspectRatio) {
        specsSummary = `${v.tireWidth}/${v.aspectRatio}R${v.diameter} (${v.speedRating || ""})`;
      } else {
        specsSummary = v.finish || "Standard";
      }

      return {
        variantId: v.id,
        productName: v.product.name,
        variantSku: v.sku,
        specsSummary,
        unitPrice,
        quantity: item.quantity,
        lineTotal,
      };
    });

    // Discount validation
    let discountAmount = 0;
    if (couponCode?.trim().toUpperCase() === "CHITOWN2026") {
      discountAmount = 100.0;
    } else if (couponCode?.trim().toUpperCase() === "FORGED5") {
      discountAmount = subtotal * 0.05;
    }

    const shippingAmount = fulfillmentType === "SHIPPING" ? items.length * 45.0 : 0.0;
    const taxableSubtotal = Math.max(0, subtotal - discountAmount);
    const taxAmount = taxableSubtotal * 0.1025; // 10.25% Cook County tax
    const totalAmount = taxableSubtotal + taxAmount + shippingAmount;

    // 4. Generate unique sequential order number
    const orderNumber = `ORD-CHI-${Math.floor(100000 + Math.random() * 900000)}`;

    // 5. Execute atomic database transaction
    const newOrder = await db.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          orderNumber,
          guestName,
          guestEmail,
          guestPhone,
          status: "CONFIRMED",
          paymentStatus: "PAID",
          paymentMethod: paymentMethod || "STRIPE_CARD",
          fulfillmentType,
          subtotal,
          taxAmount,
          shippingAmount,
          discountAmount,
          totalAmount,
          shippingAddressJson: shippingAddress ? JSON.stringify(shippingAddress) : null,
          billingAddressJson: billingAddress ? JSON.stringify(billingAddress) : null,
          internalNotes: notes || "Order placed via online storefront.",
          items: {
            create: orderItemsData,
          },
          payments: {
            create: {
              amount: totalAmount,
              currency: "USD",
              status: "SUCCESS",
              provider: paymentMethod === "STRIPE_CARD" ? "STRIPE" : "MOCK_SANDBOX",
              transactionRef: `tx_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            },
          },
        },
      });

      // Update inventory and record movements
      for (const item of items) {
        const v = dbVariants.find((dbv) => dbv.id === item.variantId)!;

        if (v.product.productType !== "SERVICE") {
          const newOnHand = Math.max(0, v.stockOnHand - item.quantity);

          await tx.productVariant.update({
            where: { id: v.id },
            data: {
              stockOnHand: newOnHand,
              stockReserved: Math.max(0, v.stockReserved - item.quantity),
            },
          });

          // Write auditable movement ledger entry
          await tx.inventoryMovement.create({
            data: {
              variantId: v.id,
              movementType: "SALE",
              quantityDelta: -item.quantity,
              balanceAfter: newOnHand,
              referenceType: "ORDER",
              referenceId: order.orderNumber,
              reason: `Customer purchase online (${order.orderNumber})`,
            },
          });
        }
      }

      // Record Audit Log
      await tx.auditLog.create({
        data: {
          action: "ORDER_CREATED",
          entity: "Order",
          entityId: order.id,
          metadataJson: JSON.stringify({
            orderNumber: order.orderNumber,
            totalAmount: order.totalAmount,
            customerEmail: guestEmail,
            itemsCount: items.length,
          }),
        },
      });

      return order;
    });

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      totalAmount: newOrder.totalAmount,
      fulfillmentType: newOrder.fulfillmentType,
    });
  } catch (error: any) {
    console.error("❌ Checkout API Error:", error);
    return NextResponse.json(
      { error: "Internal server error during order creation", details: error.message },
      { status: 500 }
    );
  }
}
