import { NextResponse } from "next/server";
import db from "@/lib/db";
import { InquirySubmissionSchema } from "@chi-town/contracts";
import { requireAdminSession } from "@/lib/auth";
import { dispatchQuoteNotification } from "@/lib/email-service";

/**
 * GET /api/inquiries
 * Protected: Administrator & Staff Inquiry/Quote query.
 */
export async function GET(request: Request) {
  try {
    await requireAdminSession(request);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const q = searchParams.get("q");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (type && type !== "ALL") {
      where.inquiryType = type;
    }
    if (q) {
      where.OR = [
        { customerName: { contains: q } },
        { customerEmail: { contains: q } },
        { customerPhone: { contains: q } },
        { vehicleYearMakeModel: { contains: q } },
        { requestedService: { contains: q } },
        { message: { contains: q } },
      ];
    }

    const inquiries = await db.inquiry.findMany({
      where,
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
    });

    return NextResponse.json({ success: true, inquiries });
  } catch (error: any) {
    const isAuthError =
      error.message?.includes("UNAUTHORIZED") || error.message?.includes("FORBIDDEN");
    return NextResponse.json(
      { error: error.message || "Failed to fetch inquiries" },
      { status: isAuthError ? 401 : 500 }
    );
  }
}

/**
 * POST /api/inquiries
 * Public: Customer Quote / Appointment / Financing lead submission.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parseResult = InquirySubmissionSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const {
      inquiryType,
      customerName,
      customerEmail,
      customerPhone,
      vehicleYearMakeModel,
      requestedService,
      message,
      preferredDate,
    } = parseResult.data;

    const inquiry = await db.inquiry.create({
      data: {
        inquiryType,
        customerName,
        customerEmail,
        customerPhone,
        vehicleYearMakeModel: vehicleYearMakeModel || null,
        requestedService: requestedService || null,
        message,
        preferredDate: preferredDate || null,
        status: "NEW",
      },
    });

    await db.auditLog.create({
      data: {
        action: "INQUIRY_RECEIVED",
        entity: "Inquiry",
        entityId: inquiry.id,
        metadataJson: JSON.stringify({
          inquiryType,
          customerName,
          customerEmail,
          requestedService,
        }),
      },
    });

    // Automatically trigger initial confirmation email to customer
    try {
      await dispatchQuoteNotification({
        inquiryId: inquiry.id,
        fromStatus: "SUBMISSION",
        toStatus: "NEW",
        customerEmail: inquiry.customerEmail,
        customerName: inquiry.customerName,
        requestedService: inquiry.requestedService,
        vehicle: inquiry.vehicleYearMakeModel,
        preferredDate: inquiry.preferredDate,
      });
    } catch (emailErr) {
      console.warn("Initial confirmation email dispatch error (non-fatal):", emailErr);
    }

    return NextResponse.json({
      success: true,
      inquiryId: inquiry.id,
      status: inquiry.status,
    });
  } catch (error: any) {
    console.error("❌ Inquiry API Error:", error);
    return NextResponse.json(
      { error: "Failed to persist inquiry", details: error.message },
      { status: 500 }
    );
  }
}
