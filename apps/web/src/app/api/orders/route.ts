import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const status = searchParams.get("status");
    const fulfillmentType = searchParams.get("fulfillmentType");
    const search = searchParams.get("search");

    const whereClause: any = {};

    if (email) {
      whereClause.OR = [
        { guestEmail: { equals: email.trim().toLowerCase() } },
        { user: { email: { equals: email.trim().toLowerCase() } } },
      ];
    }

    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    if (fulfillmentType && fulfillmentType !== "ALL") {
      whereClause.fulfillmentType = fulfillmentType;
    }

    if (search) {
      const q = search.trim();
      whereClause.OR = [
        ...(whereClause.OR || []),
        { orderNumber: { contains: q } },
        { guestName: { contains: q } },
        { guestEmail: { contains: q } },
        { guestPhone: { contains: q } },
      ];
    }

    const orders = await db.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
        payments: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    console.error("❌ Orders GET Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch orders" }, { status: 500 });
  }
}
