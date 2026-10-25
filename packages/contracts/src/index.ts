import { z } from "zod";

// --- Inventory Adjustment Schema ---
export const InventoryAdjustmentSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  movementType: z.enum([
    "RECEIPT",
    "ADJUSTMENT",
    "SALE",
    "RESERVATION",
    "RELEASE",
    "RETURN",
    "DAMAGE",
  ]),
  quantityDelta: z.number().int("Quantity delta must be an integer"),
  reason: z.string().min(3, "Reason must be provided for audit tracking"),
  referenceType: z.string().optional(),
  referenceId: z.string().optional(),
});
export type InventoryAdjustmentInput = z.infer<typeof InventoryAdjustmentSchema>;

// --- Checkout / Order Creation Schema ---
export const CheckoutOrderSchema = z.object({
  guestName: z.string().min(2, "Name is required"),
  guestEmail: z.string().email("Valid email is required"),
  guestPhone: z.string().min(7, "Valid phone number is required"),
  fulfillmentType: z.enum(["SHIPPING", "LOCAL_PICKUP"]),
  shippingAddress: z
    .object({
      street: z.string().min(1, "Street is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(2, "State is required"),
      zipCode: z.string().min(5, "Zip code is required"),
      country: z.string().default("US"),
    })
    .optional(),
  billingAddress: z
    .object({
      street: z.string().min(1, "Street is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(2, "State is required"),
      zipCode: z.string().min(5, "Zip code is required"),
      country: z.string().default("US"),
    })
    .optional(),
  items: z
    .array(
      z.object({
        variantId: z.string().min(1),
        quantity: z.number().int().positive("Quantity must be at least 1"),
      })
    )
    .min(1, "Cart cannot be empty"),
  paymentMethod: z.enum(["STRIPE_CARD", "SHOP_POS", "FINANCING"]).default("STRIPE_CARD"),
  paymentToken: z.string().optional(),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});
export type CheckoutOrderInput = z.infer<typeof CheckoutOrderSchema>;

// --- Inquiry / Service Quote / Financing Schema ---
export const InquirySubmissionSchema = z.object({
  inquiryType: z.enum([
    "GENERAL_CONTACT",
    "SERVICE_QUOTE",
    "APPOINTMENT_REQUEST",
    "FINANCING_LEAD",
  ]),
  customerName: z.string().min(2, "Your full name is required"),
  customerEmail: z.string().email("A valid email address is required"),
  customerPhone: z.string().min(10, "A valid phone number is required"),
  vehicleYearMakeModel: z.string().optional(),
  requestedService: z.string().optional(),
  message: z.string().min(5, "Please provide details for your inquiry"),
  preferredDate: z.string().optional(),
});
export type InquirySubmissionInput = z.infer<typeof InquirySubmissionSchema>;

// --- Vehicle Fitment Query Schema ---
export const FitmentQuerySchema = z.object({
  year: z.coerce.number().int().min(1980).max(2027),
  make: z.string().min(1),
  model: z.string().min(1),
  trim: z.string().optional(),
});
export type FitmentQueryInput = z.infer<typeof FitmentQuerySchema>;

// --- Product Creation / Update Schema ---
export const ProductSaveSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Product name is required"),
  slug: z.string().min(3, "Slug is required"),
  brandId: z.string().nullable().optional(),
  categoryId: z.string().nullable().optional(),
  productType: z.enum(["WHEEL", "TIRE", "PACKAGE", "ACCESSORY", "SERVICE"]),
  description: z.string().min(10, "Description is required"),
  shortDescription: z.string().optional(),
  basePrice: z.number().positive("Base price must be greater than 0"),
  salePrice: z.number().positive().nullable().optional(),
  costPrice: z.number().positive().nullable().optional(),
  primaryImage: z.string().min(1, "Primary image is required"),
  galleryImages: z.array(z.string()).default([]),
  technicalSpecs: z.record(z.string()).default({}),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});
export type ProductSaveInput = z.infer<typeof ProductSaveSchema>;

// --- Quote / Inquiry Statuses & Lifecycle Transitions ---
export const VALID_INQUIRY_STATUSES = [
  "NEW",
  "UNDER_REVIEW",
  "CONTACTED",
  "IN_PROGRESS",
  "AWAITING_CUSTOMER",
  "QUOTED",
  "APPROVED",
  "SCHEDULED",
  "COMPLETED",
  "DECLINED",
  "CANCELLED",
] as const;

export type InquiryStatusType = (typeof VALID_INQUIRY_STATUSES)[number];

export const ALLOWED_STATUS_TRANSITIONS: Record<string, string[]> = {
  NEW: ["UNDER_REVIEW", "CONTACTED", "IN_PROGRESS", "CANCELLED"],
  UNDER_REVIEW: ["IN_PROGRESS", "AWAITING_CUSTOMER", "QUOTED", "CANCELLED"],
  CONTACTED: ["IN_PROGRESS", "AWAITING_CUSTOMER", "QUOTED", "CANCELLED"],
  IN_PROGRESS: ["AWAITING_CUSTOMER", "QUOTED", "APPROVED", "CANCELLED"],
  AWAITING_CUSTOMER: ["IN_PROGRESS", "QUOTED", "APPROVED", "DECLINED", "CANCELLED"],
  QUOTED: ["APPROVED", "DECLINED", "AWAITING_CUSTOMER", "CANCELLED"],
  APPROVED: ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
  SCHEDULED: ["COMPLETED", "CANCELLED", "IN_PROGRESS"],
  DECLINED: ["UNDER_REVIEW", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: ["UNDER_REVIEW"],
};

export function isValidStatusTransition(fromStatus: string, toStatus: string): boolean {
  if (fromStatus === toStatus) return true;
  const allowed = ALLOWED_STATUS_TRANSITIONS[fromStatus];
  if (!allowed) return false;
  return allowed.includes(toStatus);
}

// --- Quote Status Update Schema ---
export const QuoteStatusUpdateSchema = z.object({
  status: z.enum(VALID_INQUIRY_STATUSES),
  internalNotes: z.string().optional(),
  assignedStaffId: z.string().nullable().optional(),
});
export type QuoteStatusUpdateInput = z.infer<typeof QuoteStatusUpdateSchema>;

// --- Bulk Inquiry Action Schema ---
export const BulkInquiryActionSchema = z.object({
  ids: z.array(z.string().min(1)).min(1, "Select at least one record").max(100, "Maximum 100 items per batch"),
  action: z.enum(["DELETE", "UPDATE_STATUS"]),
  status: z.enum(VALID_INQUIRY_STATUSES).optional(),
});
export type BulkInquiryActionInput = z.infer<typeof BulkInquiryActionSchema>;

// --- Bulk Product Action Schema ---
export const BulkProductActionSchema = z.object({
  ids: z.array(z.string().min(1)).min(1, "Select at least one product").max(100, "Maximum 100 products per batch"),
  action: z.enum(["DELETE", "ACTIVATE", "DEACTIVATE"]),
});
export type BulkProductActionInput = z.infer<typeof BulkProductActionSchema>;

// --- User Update Role Schema ---
export const UserUpdateRoleSchema = z.object({
  role: z.enum([
    "SUPER_ADMIN",
    "ADMIN",
    "INVENTORY_MANAGER",
    "ORDER_MANAGER",
    "CONTENT_MANAGER",
    "FINANCE_MANAGER",
    "STAFF",
    "CUSTOMER",
  ]),
});
export type UserUpdateRoleInput = z.infer<typeof UserUpdateRoleSchema>;
