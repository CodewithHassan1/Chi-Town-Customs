import { NextResponse } from "next/server";
import db from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { status, paymentStatus, trackingNumber, carrier, internalNotes } = body;

    const updated = await db.order.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
        ...(trackingNumber !== undefined ? { trackingNumber } : {}),
        ...(carrier !== undefined ? { carrier } : {}),
        ...(internalNotes !== undefined ? { internalNotes } : {}),
      },
    });

    await db.auditLog.create({
      data: {
        action: "ORDER_STATUS_UPDATED",
        entity: "Order",
        entityId: id,
        metadataJson: JSON.stringify({ status, paymentStatus, trackingNumber }),
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    console.error("❌ Order PATCH Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
