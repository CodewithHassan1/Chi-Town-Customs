import { NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { BulkProductActionSchema } from "@chi-town/contracts";

/**
 * POST /api/products/bulk
 * Protected: Bulk product operations (Activate, Deactivate, Safe Delete).
 */
export async function POST(request: Request) {
  try {
    const session = await requireAdminSession(request, ["SUPER_ADMIN", "ADMIN"]);
    const body = await request.json();

    const parseResult = BulkProductActionSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { ids, action } = parseResult.data;

    if (action === "ACTIVATE" || action === "DEACTIVATE") {
      const isActive = action === "ACTIVATE";
      const result = await db.product.updateMany({
        where: { id: { in: ids } },
        data: { isActive },
      });

      await db.auditLog.create({
        data: {
          action: isActive ? "PRODUCTS_BULK_ACTIVATED" : "PRODUCTS_BULK_DEACTIVATED",
          entity: "Product",
          entityId: `batch_${ids.length}`,
          staffUserId: session.id,
          staffEmail: session.email,
          metadataJson: JSON.stringify({ count: result.count, ids, isActive }),
        },
      });

      return NextResponse.json({
        success: true,
        message: `Successfully set ${result.count} products to ${isActive ? "Published" : "Draft"}.`,
        count: result.count,
        action,
      });
    }

    if (action === "DELETE") {
      // Find all target products and check for order history
      const products = await db.product.findMany({
        where: { id: { in: ids } },
        include: {
          variants: {
            include: { orderItems: true },
          },
        },
      });

      let archivedCount = 0;
      let permanentlyDeletedCount = 0;

      for (const prod of products) {
        const hasOrders = prod.variants.some((v) => v.orderItems.length > 0);

        if (hasOrders) {
          // Soft-archive to protect order history integrity
          await db.product.update({
            where: { id: prod.id },
            data: { isActive: false },
          });
          archivedCount++;
        } else {
          // Safe to permanently delete
          const variantIds = prod.variants.map((v) => v.id);
          await db.$transaction(async (tx) => {
            await tx.cartItem.deleteMany({ where: { variantId: { in: variantIds } } });
            await tx.inventoryMovement.deleteMany({ where: { variantId: { in: variantIds } } });
            await tx.product.delete({ where: { id: prod.id } });
          });
          permanentlyDeletedCount++;
        }
      }

      await db.auditLog.create({
        data: {
          action: "PRODUCTS_BULK_DELETED",
          entity: "Product",
          entityId: `batch_${ids.length}`,
          staffUserId: session.id,
          staffEmail: session.email,
          metadataJson: JSON.stringify({
            requestedCount: ids.length,
            permanentlyDeletedCount,
            archivedCount,
            deletedBy: session.name,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        message: `Processed ${products.length} products: ${permanentlyDeletedCount} permanently deleted, ${archivedCount} archived (to preserve customer order history).`,
        permanentlyDeletedCount,
        archivedCount,
      });
    }

    return NextResponse.json({ error: "Unsupported bulk action" }, { status: 400 });
  } catch (error: any) {
    const isAuth =
      error.message?.includes("UNAUTHORIZED") || error.message?.includes("FORBIDDEN");
    return NextResponse.json(
      { error: error.message || "Failed to execute product bulk action" },
      { status: isAuth ? 401 : 500 }
    );
  }
}
