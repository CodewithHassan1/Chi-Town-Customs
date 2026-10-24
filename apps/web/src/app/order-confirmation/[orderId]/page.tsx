import { notFound } from "next/navigation";
import Link from "next/link";
import db from "@/lib/db";
import { CheckCircle2, MapPin, Phone, Clock, ArrowRight, Printer, ShieldCheck } from "lucide-react";

interface OrderConfirmationPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export const revalidate = 0;

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { orderId } = await params;

  let order: any = null;
  try {
    order = await db.order.findFirst({
      where: {
        OR: [{ id: orderId }, { orderNumber: orderId }],
      },
      include: {
        items: true,
        payments: true,
      },
    });
  } catch (err) {
    console.warn("Order lookup error:", err);
  }

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#08090B] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="bg-[#111317] border border-[#22262E] rounded-2xl p-8 sm:p-12 text-center space-y-4 mb-10 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Payment &amp; Inventory Confirmed
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              THANK YOU FOR YOUR ORDER!
            </h1>
            <p className="text-sm font-mono text-gray-400">
              Order Reference: <strong className="text-white">{order.orderNumber}</strong>
            </p>
          </div>

          <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
            A confirmation receipt has been generated and your inventory has been reserved. Our technicians at Chi-Town Customs USA are preparing your package.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {}}
              className="btn-secondary px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-gray-400" />
              <span>Print Invoice</span>
            </button>
            <Link
              href="/shop"
              className="btn-primary px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Order Details & Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Pickup / Shipping Notice */}
          <div className="bg-[#111317] border border-[#22262E] rounded-xl p-5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
              Fulfillment Type
            </span>
            <p className="text-sm font-bold text-white uppercase">
              {order.fulfillmentType === "LOCAL_PICKUP" ? "In-Store Pickup" : "Freight Ground Shipping"}
            </p>
            {order.fulfillmentType === "LOCAL_PICKUP" ? (
              <div className="text-xs text-gray-400 space-y-1 pt-1">
                <p className="flex items-start gap-1.5 text-gray-300">
                  <MapPin className="w-3.5 h-3.5 text-[#D71920] shrink-0 mt-0.5" />
                  <span>311 N Cicero Ave, Chicago, IL 60644</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#D71920] shrink-0" />
                  <span>+1 773-287-3000</span>
                </p>
                <p className="text-[11px] text-gray-500">Hours: Mon-Fri 8am-6pm, Sat 8am-4pm</p>
              </div>
            ) : (
              <p className="text-xs text-gray-400">
                Tracking number will be assigned upon freight pickup from our Chicago warehouse.
              </p>
            )}
          </div>

          {/* Customer Info */}
          <div className="bg-[#111317] border border-[#22262E] rounded-xl p-5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
              Customer Details
            </span>
            <p className="text-sm font-bold text-white">{order.guestName || "Valued Customer"}</p>
            <p className="text-xs text-gray-400">{order.guestEmail}</p>
            <p className="text-xs text-gray-400 font-mono">{order.guestPhone}</p>
          </div>

          {/* Payment Status */}
          <div className="bg-[#111317] border border-[#22262E] rounded-xl p-5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
              Payment Status
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-sm font-bold text-emerald-400 uppercase">{order.paymentStatus}</p>
            </div>
            <p className="text-xs text-gray-400">Provider: {order.payments[0]?.provider || "STRIPE"}</p>
            <p className="text-xs font-mono text-gray-500 truncate">
              Ref: {order.payments[0]?.transactionRef || "N/A"}
            </p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="bg-[#111317] border border-[#22262E] rounded-xl overflow-hidden shadow-xl mb-10">
          <div className="p-5 border-b border-[#22262E]">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Purchased Items &bull; Historical Snapshot
            </h3>
          </div>

          <div className="divide-y divide-[#1F232B]">
            {order.items.map((item: any) => (
              <div key={item.id} className="p-5 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">{item.productName}</h4>
                  <p className="text-xs text-gray-400">{item.specsSummary}</p>
                  <p className="text-[10px] text-gray-500 font-mono">SKU: {item.variantSku}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-gray-400 block">
                    {item.quantity} &times; ${item.unitPrice.toFixed(2)}
                  </span>
                  <span className="text-sm font-black text-white font-mono">
                    ${item.lineTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals Table */}
          <div className="p-5 bg-[#08090B] border-t border-[#22262E] space-y-2 text-xs text-gray-400 max-w-xs ml-auto">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="text-white font-semibold font-mono">${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount:</span>
                <span className="font-mono">-${order.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span className="text-white font-semibold font-mono">${order.shippingAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (Cook County):</span>
              <span className="text-white font-semibold font-mono">${order.taxAmount.toFixed(2)}</span>
            </div>
            <div className="border-t border-[#292D34] pt-2 flex justify-between text-sm">
              <span className="font-bold text-white uppercase">Total Paid:</span>
              <span className="text-base font-black text-white font-mono">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
