import db from "@/lib/db";
import OrdersClient from "./OrdersClient";

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      payments: true,
    },
  });

  return <OrdersClient initialOrders={orders as any} />;
}
