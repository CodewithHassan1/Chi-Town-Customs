import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const barcode = searchParams.get("barcode");
    const sku = searchParams.get("sku");

    if (barcode || sku) {
      const variant = await db.productVariant.findFirst({
        where: {
          OR: [
            ...(barcode ? [{ barcode }] : []),
            ...(sku ? [{ sku }] : []),
          ],
        },
        include: {
          product: { include: { brand: true, category: true } },
        },
      });

      if (!variant) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, item: variant });
    }

    // Full inventory sync for desktop client
    const variants = await db.productVariant.findMany({
      where: { isActive: true },
      include: {
        product: { include: { brand: true, category: true } },
      },
      orderBy: { sku: "asc" },
    });

    const recentMovements = await db.inventoryMovement.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { variant: { include: { product: true } } },
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      shopLocation: "311 N Cicero Ave, Chicago, IL 60644",
      items: variants,
      recentMovements,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, variantId, quantityDelta, reason, staffName } = body;

    if (action === "BARCODE_ADJUST") {
      const result = await db.$transaction(async (tx) => {
        const variant = await tx.productVariant.findUnique({
          where: { id: variantId },
          include: { product: true },
        });

        if (!variant) throw new Error("Variant not found");

        const newBalance = Math.max(0, variant.stockOnHand + quantityDelta);

        const updated = await tx.productVariant.update({
          where: { id: variantId },
          data: { stockOnHand: newBalance },
        });

        const movement = await tx.inventoryMovement.create({
          data: {
            variantId,
            movementType: quantityDelta > 0 ? "RECEIPT" : "ADJUSTMENT",
            quantityDelta,
            balanceAfter: newBalance,
            referenceType: "DESKTOP_SCANNER_ACTION",
            reason: reason || `Desktop POS action by ${staffName || "Shop Floor Tech"}`,
          },
        });

        return { updated, movement };
      });

      return NextResponse.json({
        success: true,
        newBalance: result.updated.stockOnHand,
        movementId: result.movement.id,
      });
    }

    return NextResponse.json({ error: "Unknown desktop action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
