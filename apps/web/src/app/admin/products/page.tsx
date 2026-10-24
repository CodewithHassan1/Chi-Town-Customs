import db from "@/lib/db";
import ProductCMSClient from "./ProductCMSClient";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const [products, categories, brands] = await Promise.all([
    db.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        brand: true,
        category: true,
        variants: true,
      },
    }),
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
    db.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <ProductCMSClient
      initialProducts={products as any}
      categories={categories}
      brands={brands}
    />
  );
}
