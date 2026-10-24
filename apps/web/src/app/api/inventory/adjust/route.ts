import { NextResponse } from "next/server";
import db from "@/lib/db";
import { InventoryAdjustmentSchema } from "@chi-town/contracts";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parseResult = InventoryAdjustmentSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { variantId, movementType, quantityDelta, reason, referenceType, referenceId } =
      parseResult.data;

    // Concurrency-safe atomic transaction
    const result = await db.$transaction(async (tx) => {
      const variant = await tx.productVariant.findUnique({
        where: { id: variantId },
        include: { product: true },
      });

      if (!variant) {
        throw new Error("Product variant not found");
      }

      const newBalance = Math.max(0, variant.stockOnHand + quantityDelta);

      // Update variant on-hand balance
      const updatedVariant = await tx.productVariant.update({
        where: { id: variantId },
        data: { stockOnHand: newBalance },
      });

      // Insert into immutable movement ledger
      const movement = await tx.inventoryMovement.create({
        data: {
          variantId,
          movementType,
          quantityDelta,
          balanceAfter: newBalance,
          referenceType: referenceType || "MANUAL_ADJUSTMENT",
          referenceId: referenceId || null,
          reason,
        },
      });

      // Record audit trail
      await tx.auditLog.create({
        data: {
          action: "INVENTORY_ADJUSTED",
          entity: "ProductVariant",
          entityId: variantId,
          metadataJson: JSON.stringify({
            sku: variant.sku,
            productName: variant.product.name,
            delta: quantityDelta,
            previousBalance: variant.stockOnHand,
            newBalance,
            reason,
          }),
        },
      });

      return { updatedVariant, movement };
    });

    return NextResponse.json({
      success: true,
      variantId,
      newBalance: result.updatedVariant.stockOnHand,
      movementId: result.movement.id,
    });
  } catch (error: any) {
    console.error("❌ Inventory Adjust Error:", error);
    return NextResponse.json(
      { error: "Failed to adjust inventory", details: error.message },
      { status: 500 }
    );
  }
}
