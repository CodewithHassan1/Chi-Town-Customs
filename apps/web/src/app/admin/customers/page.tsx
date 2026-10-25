import db from "@/lib/db";
import CustomersClient from "./CustomersClient";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      orders: {
        select: {
          id: true,
          orderNumber: true,
          totalAmount: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  return <CustomersClient initialUsers={users as any} />;
}
