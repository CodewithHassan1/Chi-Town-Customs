import { NextResponse } from "next/server";
import db from "@/lib/db";
import { ProductSaveSchema } from "@chi-town/contracts";
import { requireAdminSession } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await requireAdminSession(request, [
      "SUPER_ADMIN",
      "ADMIN",
      "INVENTORY_MANAGER",
    ]);
    const { id } = await params;
    const body = await request.json();

    const parseResult = ProductSaveSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const {
      name,
      slug,
      brandId,
      categoryId,
      productType,
      description,
      shortDescription,
      basePrice,
      salePrice,
      costPrice,
      primaryImage,
      galleryImages,
      technicalSpecs,
      isFeatured,
      isActive,
    } = parseResult.data;

    const updated = await db.product.update({
      where: { id },
      data: {
        name,
        slug,
        brandId: brandId || null,
        categoryId: categoryId || null,
        productType,
        description,
        shortDescription: shortDescription || null,
        basePrice,
        salePrice: salePrice || null,
        costPrice: costPrice || null,
        primaryImage,
        galleryImages: JSON.stringify(galleryImages || [primaryImage]),
        technicalSpecs: JSON.stringify(technicalSpecs || {}),
        isFeatured,
        isActive,
      },
    });

    await db.auditLog.create({
      data: {
        action: "PRODUCT_UPDATED",
        entity: "Product",
        entityId: id,
        staffUserId: session.id,
        staffEmail: session.email,
        metadataJson: JSON.stringify({ name, slug, basePrice, isActive }),
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    const isAuth =
      error.message?.includes("UNAUTHORIZED") || error.message?.includes("FORBIDDEN");
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: isAuth ? 401 : 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await requireAdminSession(request, ["SUPER_ADMIN", "ADMIN"]);
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const forcePermanent = searchParams.get("permanent") === "true";

    const product = await db.product.findUnique({
      where: { id },
      include: {
        variants: {
          include: {
            orderItems: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if any variant is linked to historical customer orders
    const hasOrderHistory = product.variants.some((v) => v.orderItems.length > 0);

    if (hasOrderHistory || !forcePermanent) {
      // Soft-delete / Archive to preserve financial & audit history
      const archived = await db.product.update({
        where: { id },
        data: { isActive: false },
      });

      await db.auditLog.create({
        data: {
          action: "PRODUCT_ARCHIVED",
          entity: "Product",
          entityId: id,
          staffUserId: session.id,
          staffEmail: session.email,
          metadataJson: JSON.stringify({
            name: product.name,
            reason: hasOrderHistory
              ? "Preserving linked historical customer orders"
              : "Standard admin soft-deactivation",
          }),
        },
      });

      return NextResponse.json({
        success: true,
        mode: "ARCHIVED",
        message: hasOrderHistory
          ? `Product "${product.name}" was deactivated/archived because it is referenced in past customer orders.`
          : `Product "${product.name}" was set to draft/archived status.`,
        product: archived,
      });
    }

    // If zero order history and permanent deletion requested:
    await db.$transaction(async (tx) => {
      // Delete cart items referencing these variants
      const variantIds = product.variants.map((v) => v.id);
      await tx.cartItem.deleteMany({
        where: { variantId: { in: variantIds } },
      });

      // Delete inventory movements referencing these variants
      await tx.inventoryMovement.deleteMany({
        where: { variantId: { in: variantIds } },
      });

      // Delete product (cascades to variants)
      await tx.product.delete({
        where: { id },
      });

      await tx.auditLog.create({
        data: {
          action: "PRODUCT_PERMANENTLY_DELETED",
          entity: "Product",
          entityId: id,
          staffUserId: session.id,
          staffEmail: session.email,
          metadataJson: JSON.stringify({ name: product.name, slug: product.slug }),
        },
      });
    });

    return NextResponse.json({
      success: true,
      mode: "DELETED",
      message: `Product "${product.name}" and variants were permanently deleted.`,
      deletedId: id,
    });
  } catch (error: any) {
    const isAuth =
      error.message?.includes("UNAUTHORIZED") || error.message?.includes("FORBIDDEN");
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: isAuth ? 401 : 500 }
    );
  }
}
