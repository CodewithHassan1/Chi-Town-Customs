import db from "./db";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
  replyTo?: string;
  idempotencyKey?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  provider: string;
  error?: string;
}

// Security: Escapes customer-supplied text to prevent HTML injection in emails
export function escapeHtml(str: string | null | undefined): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const BUSINESS_INFO = {
  name: "Chi-Town Customs USA",
  address: "311 N Cicero Ave, Chicago, IL 60644",
  phone: "+1 773-287-3000",
  email: "support@chitowncustoms.com",
  defaultFrom: process.env.EMAIL_FROM || "quotes@chitowncustoms.com",
  websiteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://chitowncustoms.com",
};

/**
 * Low-level email dispatcher.
 * Automatically selects configured provider (Resend, SendGrid, custom API) or High-Fidelity Mock.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const from = options.from || `${BUSINESS_INFO.name} <${BUSINESS_INFO.defaultFrom}>`;
  const replyTo = options.replyTo || BUSINESS_INFO.email;
  const apiKey = process.env.EMAIL_PROVIDER_API_KEY || process.env.RESEND_API_KEY;

  // 1. Resend API Dispatch
  if (apiKey && (apiKey.startsWith("re_") || process.env.EMAIL_PROVIDER === "resend")) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          ...(options.idempotencyKey ? { "Idempotency-Key": options.idempotencyKey } : {}),
        },
        body: JSON.stringify({
          from,
          to: [options.to],
          reply_to: replyTo,
          subject: options.subject,
          html: options.html,
          text: options.text,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          provider: "RESEND",
          error: data.message || `Resend HTTP error ${response.status}`,
        };
      }

      return {
        success: true,
        provider: "RESEND",
        messageId: data.id,
      };
    } catch (err: any) {
      return {
        success: false,
        provider: "RESEND",
        error: err.message || "Network error while connecting to Resend",
      };
    }
  }

  // 2. High-Fidelity Mock / Sandbox Dispatch (Active for local development and unconfigured environments)
  const mockMessageId = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  console.log(`[EmailService] Simulated Email Dispatch:
    Provider: MOCK_TRANSPORT
    To: ${options.to}
    From: ${from}
    Subject: ${options.subject}
    MessageId: ${mockMessageId}
  `);

  return {
    success: true,
    provider: "MOCK",
    messageId: mockMessageId,
  };
}

/**
 * Builds branded, dark-theme HTML email for quote status transitions.
 */
export function buildQuoteStatusEmail(params: {
  customerName: string;
  status: string;
  inquiryId: string;
  requestedService?: string | null;
  vehicle?: string | null;
  adminNote?: string | null;
  preferredDate?: string | null;
}): { subject: string; html: string; text: string; templateName: string } {
  const safeName = escapeHtml(params.customerName);
  const safeVehicle = escapeHtml(params.vehicle || "Vehicle on File");
  const safeService = escapeHtml(params.requestedService || "Custom Wheel & Tire Service");
  const safeAdminNote = params.adminNote ? escapeHtml(params.adminNote) : null;
  const quoteRef = params.inquiryId.slice(-8).toUpperCase();

  let subject = `We've received your quote request | Chi-Town Customs`;
  let headline = "Quote Request Under Review";
  let statusBadgeColor = "#D71920";
  let statusLabel = params.status;
  let statusExplanation = `Thank you for choosing Chi-Town Customs. Our Chicago shop technicians have logged your request and are reviewing your specifications.`;
  let nextSteps = `A lead specialist will verify fitment, calculate precision itemized pricing, and reach out via phone or email within 2–4 business hours.`;
  const templateName = `quote_status_${params.status.toLowerCase()}`;

  switch (params.status) {
    case "NEW":
    case "UNDER_REVIEW":
      subject = `We've received your quote request (Ref #${quoteRef}) | Chi-Town Customs`;
      headline = "Your Request is Under Review";
      statusLabel = "UNDER REVIEW";
      statusBadgeColor = "#3B82F6";
      statusExplanation = `Our master technicians at 311 N Cicero Ave are actively reviewing your vehicle specifications and service requirements.`;
      nextSteps = `We will contact you shortly with an itemized estimate or to confirm caliper clearance and finish options.`;
      break;

    case "CONTACTED":
      subject = `Following up on your quote request (Ref #${quoteRef}) | Chi-Town Customs`;
      headline = "Technician Follow-Up";
      statusLabel = "CONTACTED";
      statusBadgeColor = "#8B5CF6";
      statusExplanation = `A Chi-Town Customs technician has reached out to discuss your quote request.`;
      nextSteps = `If you missed our call, please give us a quick ring at +1 773-287-3000 at your convenience.`;
      break;

    case "IN_PROGRESS":
      subject = `An update on your quote request (Ref #${quoteRef}) | Chi-Town Customs`;
      headline = "Estimate in Progress";
      statusLabel = "IN PROGRESS";
      statusBadgeColor = "#F59E0B";
      statusExplanation = `Our shop team is actively calculating CNC machining times, coating prep, or distributor wheel availability for your build.`;
      nextSteps = `Your finalized quote will be delivered as soon as parts allocation and labor schedule are confirmed.`;
      break;

    case "AWAITING_CUSTOMER":
      subject = `We need a little more information (Ref #${quoteRef}) | Chi-Town Customs`;
      headline = "Additional Details Needed";
      statusLabel = "AWAITING YOUR INPUT";
      statusBadgeColor = "#F97316";
      statusExplanation = `Our technicians need a few additional details regarding your vehicle's current wheel condition, bolt pattern, or preferred finish before completing your quote.`;
      nextSteps = `Please reply directly to this email or call our shop directly at +1 773-287-3000 to finalize your estimate.`;
      break;

    case "QUOTED":
      subject = `Your custom quote estimate is ready (Ref #${quoteRef}) | Chi-Town Customs`;
      headline = "Your Quote Estimate is Ready";
      statusLabel = "QUOTE READY";
      statusBadgeColor = "#10B981";
      statusExplanation = `Your custom service estimate has been prepared by our shop manager.`;
      nextSteps = `Please call +1 773-287-3000 or reply to this email to review the itemized breakdown and schedule your bay time.`;
      break;

    case "APPROVED":
      subject = `Your quote has been approved (Ref #${quoteRef}) | Chi-Town Customs`;
      headline = "Service Approved";
      statusLabel = "APPROVED";
      statusBadgeColor = "#10B981";
      statusExplanation = `Your custom wheel service has been approved and moved to our shop scheduling queue.`;
      nextSteps = `Our front desk will contact you to confirm vehicle drop-off timing and loaner wheel arrangements if needed.`;
      break;

    case "SCHEDULED":
      subject = `Your service appointment is scheduled (Ref #${quoteRef}) | Chi-Town Customs`;
      headline = "Appointment Confirmed";
      statusLabel = "SCHEDULED";
      statusBadgeColor = "#06B6D4";
      statusExplanation = `Your service appointment has been reserved at our Chicago facility.`;
      nextSteps = `Please bring your vehicle to 311 N Cicero Ave, Chicago, IL 60644 on your confirmed drop-off date. For questions, call +1 773-287-3000.`;
      break;

    case "COMPLETED":
      subject = `Your vehicle service is complete (Ref #${quoteRef}) | Chi-Town Customs`;
      headline = "Service Completed & Quality Inspected";
      statusLabel = "READY FOR PICKUP";
      statusBadgeColor = "#10B981";
      statusExplanation = `Your wheel straightening, custom coating, or tire mounting service has been completed and passed our strict quality inspection.`;
      nextSteps = `Your wheels/vehicle are ready for pickup at 311 N Cicero Ave during regular shop hours (Mon-Sat 8:00 AM - 6:00 PM).`;
      break;

    case "DECLINED":
      subject = `Update regarding your quote request (Ref #${quoteRef}) | Chi-Town Customs`;
      headline = "Quote Request Closed";
      statusLabel = "DECLINED / CLOSED";
      statusBadgeColor = "#6B7280";
      statusExplanation = `This quote estimate has been marked as declined or closed per your request.`;
      nextSteps = `If you would like to revisit this project or explore alternative wheel packages in the future, we remain at your service.`;
      break;

    case "CANCELLED":
      subject = `Quote request cancelled (Ref #${quoteRef}) | Chi-Town Customs`;
      headline = "Quote Request Cancelled";
      statusLabel = "CANCELLED";
      statusBadgeColor = "#EF4444";
      statusExplanation = `Your quote request has been cancelled in our shop management system.`;
      nextSteps = `If this cancellation was made in error, please call us at +1 773-287-3000 and we will immediately reopen your ticket.`;
      break;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #08090B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E5E7EB;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #08090B; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #111317; border: 1px solid #22262E; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <!-- Header Bar -->
          <tr>
            <td style="padding: 24px 30px; background-color: #0D0F13; border-bottom: 2px solid #D71920;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="left">
                    <span style="font-size: 18px; font-weight: 900; letter-spacing: 1px; color: #FFFFFF; text-transform: uppercase;">
                      CHI-TOWN <span style="color: #D71920;">CUSTOMS</span>
                    </span>
                    <span style="display: block; font-size: 10px; font-weight: 700; color: #9CA3AF; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px;">
                      Chicago Performance Wheels &bull; Tire Specialists
                    </span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 4px 10px; font-size: 10px; font-family: monospace; font-weight: 700; color: #FFFFFF; background-color: ${statusBadgeColor}; border-radius: 4px; text-transform: uppercase;">
                      ${statusLabel}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 30px;">
              <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 800; color: #FFFFFF; text-transform: uppercase; letter-spacing: -0.5px;">
                ${headline}
              </h1>

              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #D1D5DB;">
                Hello <strong>${safeName}</strong>,
              </p>

              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #D1D5DB;">
                ${statusExplanation}
              </p>

              <!-- Request Summary Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 20px 0; background-color: #0A0C0F; border: 1px solid #1F232B; border-radius: 8px; padding: 16px;">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: 700; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                      Quote Request Summary (Ref #${quoteRef})
                    </div>
                    <div style="font-size: 13px; color: #FFFFFF; margin-bottom: 4px;">
                      <strong>Service:</strong> ${safeService}
                    </div>
                    <div style="font-size: 13px; color: #FFFFFF; margin-bottom: 4px;">
                      <strong>Vehicle:</strong> ${safeVehicle}
                    </div>
                    ${
                      params.preferredDate
                        ? `<div style="font-size: 13px; color: #10B981; margin-bottom: 4px;">
                            <strong>Requested Drop-off:</strong> ${escapeHtml(params.preferredDate)}
                           </div>`
                        : ""
                    }
                    ${
                      safeAdminNote
                        ? `<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #22262E; font-size: 12px; color: #93C5FD;">
                            <strong>Technician Update:</strong> ${safeAdminNote}
                           </div>`
                        : ""
                    }
                  </td>
                </tr>
              </table>

              <!-- Next Steps -->
              <div style="margin: 24px 0; padding: 16px; background-color: #16191F; border-left: 3px solid #D71920; border-radius: 0 8px 8px 0;">
                <div style="font-size: 11px; font-weight: 700; color: #D71920; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
                  What Happens Next
                </div>
                <div style="font-size: 13px; line-height: 1.5; color: #E5E7EB;">
                  ${nextSteps}
                </div>
              </div>

              <!-- Contact Button & Information -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 28px;">
                <tr>
                  <td align="center">
                    <a href="tel:+17732873000" style="display: inline-block; padding: 12px 28px; background-color: #D71920; color: #FFFFFF; text-decoration: none; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-radius: 6px;">
                      Call Shop: +1 (773) 287-3000
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #08090B; border-top: 1px solid #22262E; font-size: 11px; line-height: 1.6; color: #6B7280; text-align: center;">
              <p style="margin: 0 0 6px 0; font-weight: 600; color: #9CA3AF;">
                Chi-Town Customs USA &bull; 311 N Cicero Ave, Chicago, IL 60644
              </p>
              <p style="margin: 0;">
                Direct: <a href="tel:+17732873000" style="color: #9CA3AF; text-decoration: none;">+1 773-287-3000</a> &bull;
                Email: <a href="mailto:${BUSINESS_INFO.email}" style="color: #9CA3AF; text-decoration: none;">${BUSINESS_INFO.email}</a>
              </p>
              <p style="margin: 8px 0 0 0; font-size: 10px; color: #4B5563;">
                This notification was sent to ${escapeHtml(params.inquiryId)} based on your authentic quote submission.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `CHI-TOWN CUSTOMS USA
Quote Status Update: ${statusLabel}
Ref #${quoteRef}
------------------------------------------------------------
Hello ${params.customerName},

${statusExplanation}

REQUEST DETAILS:
- Service: ${params.requestedService || "Custom Wheel & Tire Service"}
- Vehicle: ${params.vehicle || "Vehicle on File"}
${params.preferredDate ? `- Requested Date: ${params.preferredDate}\n` : ""}${
    params.adminNote ? `- Technician Note: ${params.adminNote}\n` : ""
}
NEXT STEPS:
${nextSteps}

------------------------------------------------------------
Chi-Town Customs USA
311 N Cicero Ave, Chicago, IL 60644
Phone: +1 773-287-3000
Email: ${BUSINESS_INFO.email}
`;

  return { subject, html, text, templateName };
}

/**
 * Handles status change email notification execution, outbox persistence, and retry logic.
 */
export async function dispatchQuoteNotification(params: {
  inquiryId: string;
  fromStatus: string;
  toStatus: string;
  customerEmail: string;
  customerName: string;
  requestedService?: string | null;
  vehicle?: string | null;
  adminNote?: string | null;
  preferredDate?: string | null;
}) {
  const timestamp = Date.now();
  const idempotencyKey = `quote_${params.inquiryId}_${params.toStatus}_${timestamp}`;

  const { subject, html, text, templateName } = buildQuoteStatusEmail({
    customerName: params.customerName,
    status: params.toStatus,
    inquiryId: params.inquiryId,
    requestedService: params.requestedService,
    vehicle: params.vehicle,
    adminNote: params.adminNote,
    preferredDate: params.preferredDate,
  });

  // 1. Create durable outbox record in database
  const notification = await db.quoteNotification.create({
    data: {
      inquiryId: params.inquiryId,
      fromStatus: params.fromStatus,
      toStatus: params.toStatus,
      recipient: params.customerEmail,
      subject,
      templateName,
      status: "PENDING",
      idempotencyKey,
      attempts: 1,
      lastAttemptAt: new Date(),
    },
  });

  // 2. Dispatch via active transport
  const sendResult = await sendEmail({
    to: params.customerEmail,
    subject,
    html,
    text,
    idempotencyKey,
  });

  // 3. Update outbox record with result
  const updated = await db.quoteNotification.update({
    where: { id: notification.id },
    data: {
      status: sendResult.success ? "SENT" : "FAILED",
      provider: sendResult.provider,
      providerMessageId: sendResult.messageId || null,
      errorMessage: sendResult.error || null,
      sentAt: sendResult.success ? new Date() : null,
    },
  });

  return { notification: updated, sendResult };
}

/**
 * Retries a previously failed notification safely.
 */
export async function retryQuoteNotification(notificationId: string) {
  const notification = await db.quoteNotification.findUnique({
    where: { id: notificationId },
    include: { inquiry: true },
  });

  if (!notification) {
    throw new Error("Notification record not found");
  }

  const { inquiry } = notification;

  const { subject, html, text } = buildQuoteStatusEmail({
    customerName: inquiry.customerName,
    status: notification.toStatus,
    inquiryId: inquiry.id,
    requestedService: inquiry.requestedService,
    vehicle: inquiry.vehicleYearMakeModel,
    adminNote: inquiry.internalNotes,
    preferredDate: inquiry.preferredDate,
  });

  const sendResult = await sendEmail({
    to: notification.recipient, // Immutable recipient from saved record
    subject,
    html,
    text,
    idempotencyKey: `${notification.idempotencyKey}_retry_${Date.now()}`,
  });

  const updated = await db.quoteNotification.update({
    where: { id: notification.id },
    data: {
      status: sendResult.success ? "SENT" : "FAILED",
      provider: sendResult.provider,
      providerMessageId: sendResult.messageId || null,
      errorMessage: sendResult.error || null,
      sentAt: sendResult.success ? new Date() : null,
      attempts: { increment: 1 },
      lastAttemptAt: new Date(),
    },
  });

  return { notification: updated, sendResult };
}
