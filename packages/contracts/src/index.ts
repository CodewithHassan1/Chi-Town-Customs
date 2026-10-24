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
