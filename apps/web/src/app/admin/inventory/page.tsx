import db from "@/lib/db";
import InventoryClient from "./InventoryClient";

export const revalidate = 0;

export default async function AdminInventoryPage() {
  const [variants, movements] = await Promise.all([
    db.productVariant.findMany({
      where: { isActive: true },
      include: {
        product: {
          include: { brand: true },
        },
      },
      orderBy: { sku: "asc" },
    }),
    db.inventoryMovement.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        variant: {
          include: { product: true },
        },
      },
    }),
  ]);

  return <InventoryClient initialVariants={variants as any} initialMovements={movements as any} />;
}
