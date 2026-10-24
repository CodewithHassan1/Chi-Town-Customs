import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [sections, settings] = await Promise.all([
      db.cMSSection.findMany({ orderBy: { sortOrder: "asc" } }),
      db.siteSetting.findMany(),
    ]);

    return NextResponse.json({ success: true, sections, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sectionKey, title, subtitle, contentJson, isVisible } = body;

    const upserted = await db.cMSSection.upsert({
      where: { sectionKey },
      update: {
        title,
        subtitle: subtitle || null,
        contentJson: typeof contentJson === "string" ? contentJson : JSON.stringify(contentJson),
        isVisible: isVisible ?? true,
      },
      create: {
        sectionKey,
        title,
        subtitle: subtitle || null,
        contentJson: typeof contentJson === "string" ? contentJson : JSON.stringify(contentJson),
        isVisible: isVisible ?? true,
      },
    });

    await db.auditLog.create({
      data: {
        action: "CMS_SECTION_UPDATED",
        entity: "CMSSection",
        entityId: upserted.id,
        metadataJson: JSON.stringify({ sectionKey, title }),
      },
    });

    return NextResponse.json({ success: true, section: upserted });
  } catch (error: any) {
    console.error("❌ CMS POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
