import { NextResponse } from "next/server";
import db from "@/lib/db";
import { InquirySubmissionSchema } from "@chi-town/contracts";

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
