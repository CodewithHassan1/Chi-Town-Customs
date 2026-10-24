import { NextResponse } from "next/server";
import db from "@/lib/db";
import { z } from "zod";

const StockReceiveSchema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string().min(1, "Variant ID is required"),
        quantity: z.number().int().positive("Quantity must be positive"),
        unitCost: z.number().positive().optional(),
      })
    )
    .min(1, "At least one item must be received"),
  purchaseOrderNumber: z.string().optional(),
  supplier: z.string().optional(),
  notes: z.string().optional(),
  staffEmail: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = StockReceiveSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { items, purchaseOrderNumber, supplier, notes, staffEmail } = parseResult.data;

    // Concurrency-safe atomic transaction for all received line items
    const results = await db.$transaction(async (tx) => {
      const processed = [];

      for (const item of items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });

        if (!variant) {
          throw new Error(`Variant not found: ${item.variantId}`);
        }

        const newBalance = variant.stockOnHand + item.quantity;

        // Update on-hand balance and optionally costPrice
        const updated = await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stockOnHand: newBalance,
            ...(item.unitCost ? { costPrice: item.unitCost } : {}),
          },
        });

        // Create immutable movement ledger receipt record
        const movement = await tx.inventoryMovement.create({
          data: {
            variantId: item.variantId,
            movementType: "RECEIPT",
            quantityDelta: item.quantity,
            balanceAfter: newBalance,
            referenceType: "PURCHASE_RECEIPT",
            referenceId: purchaseOrderNumber || `RCV-${Date.now()}`,
            reason: notes || `Stock receipt from ${supplier || "Supplier Direct Delivery"}`,
          },
        });

        // Create audit log
        await tx.auditLog.create({
          data: {
            action: "STOCK_RECEIVED",
            entity: "ProductVariant",
            entityId: item.variantId,
            staffEmail: staffEmail || "shop@chitowncustoms.com",
            metadataJson: JSON.stringify({
              sku: variant.sku,
              productName: variant.product.name,
              quantityReceived: item.quantity,
              previousBalance: variant.stockOnHand,
              newBalance,
              poNumber: purchaseOrderNumber,
              supplier,
            }),
          },
        });

        processed.push({
          variantId: item.variantId,
          sku: variant.sku,
          newBalance,
          movementId: movement.id,
        });
      }

      return processed;
    });

    return NextResponse.json({
      success: true,
      receivedCount: results.length,
      items: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Stock Receive Error:", error);
    return NextResponse.json(
      { error: "Failed to record stock receipt", details: error.message },
      { status: 500 }
    );
  }
}
