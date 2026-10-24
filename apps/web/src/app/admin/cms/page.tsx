import db from "@/lib/db";
import CMSClient from "./CMSClient";

export const revalidate = 0;

export default async function AdminCMSPage() {
  const sections = await db.cMSSection.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return <CMSClient initialSections={sections as any} />;
}
