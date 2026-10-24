import { NextResponse } from "next/server";
import db from "@/lib/db";
import { ProductSaveSchema } from "@chi-town/contracts";
import { FALLBACK_PRODUCTS } from "@/lib/fallback-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const q = searchParams.get("q");

    const where: any = {};
    if (category) where.category = { slug: category };
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
      ];
    }

    const products = await db.product.findMany({
      where,
      include: {
        brand: true,
        category: true,
        variants: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.warn("api/products query error, returning fallback products:", error);
    return NextResponse.json({ success: true, products: FALLBACK_PRODUCTS });
  }
}

export async function POST(request: Request) {
  try {
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

    const newProduct = await db.product.create({
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
      include: { brand: true, category: true },
    });

    // Record audit log
    await db.auditLog.create({
      data: {
        action: "PRODUCT_CREATED",
        entity: "Product",
        entityId: newProduct.id,
        metadataJson: JSON.stringify({ name: newProduct.name, slug: newProduct.slug }),
      },
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error("❌ Product POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
