import db from "@/lib/db";
import InquiriesClient from "./InquiriesClient";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const [inquiries, staffUsers] = await Promise.all([
    db.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        assignedStaff: {
          select: { id: true, name: true, email: true },
        },
        notifications: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    }),
    db.user.findMany({
      where: {
        role: { in: ["SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER", "STAFF"] },
      },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return <InquiriesClient initialInquiries={inquiries as any} staffList={staffUsers} />;
}
