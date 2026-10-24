import { notFound } from "next/navigation";
import db from "@/lib/db";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";
import { FALLBACK_PRODUCTS } from "@/lib/fallback-data";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 0;

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await db.product.findUnique({
      where: { slug },
      include: { brand: true },
    });

    if (product) {
      return {
        title: `${product.name} | Chi-Town Customs USA`,
        description: product.shortDescription || product.description.slice(0, 160),
        openGraph: {
          title: `${product.name} | Chi-Town Customs USA`,
          description: product.shortDescription || product.description.slice(0, 160),
          images: [{ url: product.primaryImage }],
        },
      };
    }
  } catch (e) {
    console.warn("generateMetadata db error, checking fallback:", e);
  }

  const fallback = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
  if (fallback) {
    return {
      title: `${fallback.name} | Chi-Town Customs USA`,
      description: fallback.shortDescription || fallback.description.slice(0, 160),
      openGraph: {
        title: `${fallback.name} | Chi-Town Customs USA`,
        description: fallback.shortDescription || fallback.description.slice(0, 160),
        images: [{ url: fallback.primaryImage }],
      },
    };
  }

  return { title: "Custom Wheel & Tire Package | Chi-Town Customs USA" };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  let product: any = null;

  try {
    product = await db.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        category: true,
        variants: {
          where: { isActive: true },
          orderBy: { price: "asc" },
        },
      },
    });
  } catch (err) {
    console.warn("Database error querying product detail, falling back to static catalog:", err);
  }

  if (!product) {
    product = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
