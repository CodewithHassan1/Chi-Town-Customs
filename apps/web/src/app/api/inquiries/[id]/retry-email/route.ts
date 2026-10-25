import { NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { retryQuoteNotification } from "@/lib/email-service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/inquiries/[id]/retry-email
 * Protected: Retries the most recent failed notification for this inquiry.
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    await requireAdminSession(request);
    const { id } = await params;

    const failedNotification = await db.quoteNotification.findFirst({
      where: {
        inquiryId: id,
        status: "FAILED",
      },
      orderBy: { createdAt: "desc" },
    });

    if (!failedNotification) {
      return NextResponse.json(
        { error: "No failed notification found for this quote inquiry." },
        { status: 404 }
      );
    }

    const result = await retryQuoteNotification(failedNotification.id);

    return NextResponse.json({
      success: result.sendResult.success,
      notification: result.notification,
      provider: result.sendResult.provider,
      error: result.sendResult.error || null,
    });
  } catch (error: any) {
    const isAuth = error.message?.includes("UNAUTHORIZED") || error.message?.includes("FORBIDDEN");
    return NextResponse.json(
      { error: error.message || "Failed to retry email notification" },
      { status: isAuth ? 401 : 500 }
    );
  }
}
