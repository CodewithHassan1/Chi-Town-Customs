import { NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import {
  QuoteStatusUpdateSchema,
  isValidStatusTransition,
  ALLOWED_STATUS_TRANSITIONS,
} from "@chi-town/contracts";
import { dispatchQuoteNotification } from "@/lib/email-service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/inquiries/[id]
 * Protected: Retrieve a single quote/inquiry record with staff and notification history.
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    await requireAdminSession(request);
    const { id } = await params;

    const inquiry = await db.inquiry.findUnique({
      where: { id },
      include: {
        assignedStaff: {
          select: { id: true, name: true, email: true },
        },
        notifications: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, inquiry });
  } catch (error: any) {
    const isAuth = error.message?.includes("UNAUTHORIZED") || error.message?.includes("FORBIDDEN");
    return NextResponse.json(
      { error: error.message || "Failed to retrieve inquiry" },
      { status: isAuth ? 401 : 500 }
    );
  }
}

/**
 * PATCH /api/inquiries/[id]
 * Protected: Update status, internal notes, or staff assignment.
 * IMMUTABILITY: Customer-submitted content cannot be changed.
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await requireAdminSession(request);
    const { id } = await params;
    const body = await request.json();

    // 1. Enforce Quote Content Immutability
    // Reject any attempt by an administrator or crafted API payload to mutate customer-authored content
    const protectedFields = [
      "customerName",
      "customerEmail",
      "customerPhone",
      "vehicleYearMakeModel",
      "requestedService",
      "message",
      "preferredDate",
      "inquiryType",
      "createdAt",
    ];

    const attemptedTampering = protectedFields.filter((field) => field in body);
    if (attemptedTampering.length > 0) {
      return NextResponse.json(
        {
          error: "Forbidden: Customer-authored quote submissions are immutable and cannot be edited.",
          protectedFields: attemptedTampering,
        },
        { status: 403 }
      );
    }

    // 2. Fetch existing quote record
    const existing = await db.inquiry.findUnique({
      where: { id },
      include: { assignedStaff: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Inquiry record not found" }, { status: 404 });
    }

    // 3. Validate request schema
    const parseResult = QuoteStatusUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { status: newStatus, internalNotes, assignedStaffId } = parseResult.data;

    // 4. Validate State Machine Lifecycle Transition
    const isStatusChanging = newStatus && newStatus !== existing.status;
    if (isStatusChanging) {
      const isAllowed = isValidStatusTransition(existing.status, newStatus);
      if (!isAllowed) {
        const allowedTransitions = ALLOWED_STATUS_TRANSITIONS[existing.status] || [];
        return NextResponse.json(
          {
            error: `Invalid status transition from '${existing.status}' to '${newStatus}'.`,
            currentStatus: existing.status,
            requestedStatus: newStatus,
            allowedTransitions,
          },
          { status: 400 }
        );
      }
    }

    // 5. Commit update to database
    const updatedInquiry = await db.inquiry.update({
      where: { id },
      data: {
        ...(isStatusChanging ? { status: newStatus } : {}),
        ...(internalNotes !== undefined ? { internalNotes } : {}),
        ...(assignedStaffId !== undefined ? { assignedStaffId } : {}),
      },
      include: {
        assignedStaff: { select: { id: true, name: true, email: true } },
        notifications: { orderBy: { createdAt: "desc" }, take: 5 },
      },
    });

    // 6. Record Audit Log Entry
    await db.auditLog.create({
      data: {
        action: isStatusChanging ? "INQUIRY_STATUS_CHANGED" : "INQUIRY_NOTE_UPDATED",
        entity: "Inquiry",
        entityId: id,
        staffUserId: session.id,
        staffEmail: session.email,
        metadataJson: JSON.stringify({
          fromStatus: existing.status,
          toStatus: updatedInquiry.status,
          staffName: session.name,
          internalNotesUpdated: internalNotes !== undefined,
        }),
      },
    });

    // 7. Automated Email Notification
    let notificationResult: any = null;
    let emailSuccess = true;
    let emailError: string | null = null;

    if (isStatusChanging) {
      try {
        const result = await dispatchQuoteNotification({
          inquiryId: existing.id,
          fromStatus: existing.status,
          toStatus: newStatus,
          customerEmail: existing.customerEmail, // Authoritative immutable customer email
          customerName: existing.customerName,
          requestedService: existing.requestedService,
          vehicle: existing.vehicleYearMakeModel,
          adminNote: internalNotes || existing.internalNotes,
          preferredDate: existing.preferredDate,
        });

        notificationResult = result.notification;
        emailSuccess = result.sendResult.success;
        if (!result.sendResult.success) {
          emailError = result.sendResult.error || "Email provider dispatch failed";
        }
      } catch (dispatchErr: any) {
        console.error("❌ Notification dispatch exception:", dispatchErr);
        emailSuccess = false;
        emailError = dispatchErr.message || "Failed to execute notification workflow";
      }
    }

    return NextResponse.json({
      success: true,
      inquiry: updatedInquiry,
      statusUpdated: true,
      emailSent: isStatusChanging ? emailSuccess : null,
      emailError,
      notification: notificationResult,
    });
  } catch (error: any) {
    const isAuth = error.message?.includes("UNAUTHORIZED") || error.message?.includes("FORBIDDEN");
    return NextResponse.json(
      { error: error.message || "Failed to update inquiry" },
      { status: isAuth ? 401 : 500 }
    );
  }
}

/**
 * DELETE /api/inquiries/[id]
 * Protected: Individual safe deletion with audit tracking.
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await requireAdminSession(request, ["SUPER_ADMIN", "ADMIN"]);
    const { id } = await params;

    const existing = await db.inquiry.findUnique({
      where: { id },
      include: { notifications: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // Execute deletion in transaction
    await db.$transaction(async (tx) => {
      // Delete notifications first if any
      await tx.quoteNotification.deleteMany({
        where: { inquiryId: id },
      });

      // Delete the inquiry
      await tx.inquiry.delete({
        where: { id },
      });

      // Audit log the deletion
      await tx.auditLog.create({
        data: {
          action: "INQUIRY_DELETED",
          entity: "Inquiry",
          entityId: id,
          staffUserId: session.id,
          staffEmail: session.email,
          metadataJson: JSON.stringify({
            customerName: existing.customerName,
            customerEmail: existing.customerEmail,
            inquiryType: existing.inquiryType,
            status: existing.status,
            deletedBy: session.name,
          }),
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: `Quote inquiry for ${existing.customerName} safely deleted`,
      deletedId: id,
    });
  } catch (error: any) {
    const isAuth = error.message?.includes("UNAUTHORIZED") || error.message?.includes("FORBIDDEN");
    return NextResponse.json(
      { error: error.message || "Failed to delete inquiry" },
      { status: isAuth ? 401 : 500 }
    );
  }
}
