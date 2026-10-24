import { NextResponse } from "next/server";
import db from "@/lib/db";
import { ProductSaveSchema } from "@chi-town/contracts";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
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
        metadataJson: JSON.stringify({ name, slug, basePrice, isActive }),
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error("❌ Product Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Soft delete / deactivate to preserve historical orders
    const deactivated = await db.product.update({
      where: { id },
      data: { isActive: false },
    });

    await db.auditLog.create({
      data: {
        action: "PRODUCT_DEACTIVATED",
        entity: "Product",
        entityId: id,
      },
    });

    return NextResponse.json({ success: true, product: deactivated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
