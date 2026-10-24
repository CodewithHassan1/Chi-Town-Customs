import { notFound } from "next/navigation";
import db from "@/lib/db";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 0;

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    include: { brand: true },
  });

  if (!product) {
    return { title: "Product Not Found | Chi-Town Customs USA" };
  }

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

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await db.product.findUnique({
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

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
