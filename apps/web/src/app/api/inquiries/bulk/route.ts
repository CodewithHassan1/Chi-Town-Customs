import { NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import {
  BulkInquiryActionSchema,
  isValidStatusTransition,
} from "@chi-town/contracts";
import { dispatchQuoteNotification } from "@/lib/email-service";

/**
 * POST /api/inquiries/bulk
 * Protected: Bulk Operations (Safe Bulk Deletion and Bulk Status Updates).
 */
export async function POST(request: Request) {
  try {
    const session = await requireAdminSession(request, ["SUPER_ADMIN", "ADMIN"]);
    const body = await request.json();

    const parseResult = BulkInquiryActionSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { ids, action, status: newStatus } = parseResult.data;

    if (action === "DELETE") {
      // 1. Bulk Delete Action
      const count = await db.$transaction(async (tx) => {
        // Delete related notifications
        await tx.quoteNotification.deleteMany({
          where: { inquiryId: { in: ids } },
        });

        // Delete inquiries
        const deleteRes = await tx.inquiry.deleteMany({
          where: { id: { in: ids } },
        });

        // Audit Log
        await tx.auditLog.create({
          data: {
            action: "INQUIRIES_BULK_DELETED",
            entity: "Inquiry",
            entityId: `batch_${ids.length}`,
            staffUserId: session.id,
            staffEmail: session.email,
            metadataJson: JSON.stringify({
              count: deleteRes.count,
              requestedIds: ids,
              deletedBy: session.name,
            }),
          },
        });

        return deleteRes.count;
      });

      return NextResponse.json({
        success: true,
        message: `Successfully deleted ${count} inquiry record(s).`,
        count,
        deletedIds: ids,
      });
    }

    if (action === "UPDATE_STATUS") {
      if (!newStatus) {
        return NextResponse.json(
          { error: "Target status must be provided for status update action." },
          { status: 400 }
        );
      }

      // 2. Bulk Status Update with Email Notification Triggering
      const targetInquiries = await db.inquiry.findMany({
        where: { id: { in: ids } },
      });

      let updatedCount = 0;
      let skippedCount = 0;
      const results: any[] = [];

      for (const inq of targetInquiries) {
        if (inq.status === newStatus) {
          skippedCount++;
          continue;
        }

        const isAllowed = isValidStatusTransition(inq.status, newStatus);
        if (!isAllowed) {
          skippedCount++;
          results.push({
            id: inq.id,
            status: "SKIPPED",
            reason: `Invalid transition from ${inq.status} to ${newStatus}`,
          });
          continue;
        }

        // Commit status change
        const updated = await db.inquiry.update({
          where: { id: inq.id },
          data: { status: newStatus },
        });

        // Audit Log
        await db.auditLog.create({
          data: {
            action: "INQUIRY_STATUS_CHANGED",
            entity: "Inquiry",
            entityId: inq.id,
            staffUserId: session.id,
            staffEmail: session.email,
            metadataJson: JSON.stringify({
              fromStatus: inq.status,
              toStatus: newStatus,
              isBulkAction: true,
            }),
          },
        });

        // Automated notification email
        try {
          await dispatchQuoteNotification({
            inquiryId: inq.id,
            fromStatus: inq.status,
            toStatus: newStatus,
            customerEmail: inq.customerEmail,
            customerName: inq.customerName,
            requestedService: inq.requestedService,
            vehicle: inq.vehicleYearMakeModel,
            preferredDate: inq.preferredDate,
          });
        } catch (emailErr) {
          console.warn(`Email notification failed for quote ${inq.id}:`, emailErr);
        }

        updatedCount++;
        results.push({ id: inq.id, status: "UPDATED", newStatus });
      }

      return NextResponse.json({
        success: true,
        message: `Updated status for ${updatedCount} inquiries (${skippedCount} skipped).`,
        updatedCount,
        skippedCount,
        results,
      });
    }

    return NextResponse.json({ error: "Unsupported bulk action" }, { status: 400 });
  } catch (error: any) {
    const isAuth = error.message?.includes("UNAUTHORIZED") || error.message?.includes("FORBIDDEN");
    return NextResponse.json(
      { error: error.message || "Failed to execute bulk action" },
      { status: isAuth ? 401 : 500 }
    );
  }
}
