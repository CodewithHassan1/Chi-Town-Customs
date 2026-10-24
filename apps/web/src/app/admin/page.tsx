import Link from "next/link";
import db from "@/lib/db";
import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Layers,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  // Query authoritative database records
  const [
    orders,
    productsCount,
    variants,
    inquiries,
    movements,
  ] = await Promise.all([
    db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { items: true },
    }),
    db.product.count({ where: { isActive: true } }),
    db.productVariant.findMany({
      where: { isActive: true },
      include: { product: true },
    }),
    db.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    db.inventoryMovement.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { variant: { include: { product: true } } },
    }),
  ]);

  // Aggregated calculations
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.paymentStatus === "PAID" ? ord.totalAmount : 0), 0);
  const totalOrdersCount = orders.length;
  const aov = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const lowStockVariants = variants.filter((v) => v.product.productType !== "SERVICE" && v.stockOnHand <= v.reorderLevel);

  return (
    <div className="p-6 sm:p-10 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#22262E] pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D71920]">
            311 N Cicero Ave &bull; Real-Time Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            EXECUTIVE DASHBOARD
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time sales, live inventory levels, order pipeline, and customer leads.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/inventory"
            className="btn-secondary px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Stock Ledger</span>
          </Link>
          <Link
            href="/admin/products"
            className="btn-primary px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Manage Products</span>
          </Link>
        </div>
      </div>

      {/* 4 Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-[#111317] border border-[#22262E] rounded-2xl p-6 space-y-2 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-bold uppercase tracking-wider">Confirmed Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Authoritative Stripe/POS settlement
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-[#111317] border border-[#22262E] rounded-2xl p-6 space-y-2 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-[#191C21] text-blue-400 border border-[#292D34] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {totalOrdersCount}
          </div>
          <p className="text-[11px] text-gray-400 font-mono">
            Average Order Value: ${aov.toFixed(2)}
          </p>
        </div>

        {/* Active Catalog SKUs */}
        <div className="bg-[#111317] border border-[#22262E] rounded-2xl p-6 space-y-2 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-bold uppercase tracking-wider">Catalog SKUs</span>
            <div className="w-8 h-8 rounded-lg bg-[#191C21] text-[#D71920] border border-[#292D34] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {variants.length}
          </div>
          <p className="text-[11px] text-gray-400">
            Across {productsCount} live master products
          </p>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-[#111317] border border-[#22262E] rounded-2xl p-6 space-y-2 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-bold uppercase tracking-wider">Low Stock SKUs</span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/40 text-amber-400 border border-amber-800/40 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {lowStockVariants.length}
          </div>
          <p className="text-[11px] text-amber-400">
            {lowStockVariants.length > 0 ? "Requires purchase reorder" : "Stock optimal"}
          </p>
        </div>
      </div>

      {/* 2-Column: Recent Orders Table & Lead Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table (7 cols) */}
        <div className="lg:col-span-7 bg-[#111317] border border-[#22262E] rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#22262E] pb-3">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Recent Storefront &amp; POS Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#F1262D] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#08090B] text-gray-400 uppercase font-mono border-b border-[#22262E]">
                <tr>
                  <th className="py-3 px-3">Order</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F232B] text-gray-300">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#16191F] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      <Link href={`/admin/orders`} className="hover:text-[#D71920]">
                        {ord.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{ord.guestName || "Guest"}</div>
                      <div className="text-[10px] text-gray-500 truncate max-w-[120px]">{ord.guestEmail}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#191C21] border border-[#292D34]">
                        {ord.fulfillmentType === "LOCAL_PICKUP" ? "Pickup" : "Ship"}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950/40 text-blue-400 border border-blue-800/40">
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white">
                      ${ord.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inquiries & Financing Leads (5 cols) */}
        <div className="lg:col-span-5 bg-[#111317] border border-[#22262E] rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#22262E] pb-3">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Recent Leads &amp; Quotes
            </h2>
            <Link
              href="/admin/inquiries"
              className="text-xs font-bold text-[#F1262D] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-3 bg-[#08090B] border border-[#22262E] rounded-xl flex items-start justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        inq.inquiryType === "FINANCING_LEAD"
                          ? "bg-purple-950/60 text-purple-300 border border-purple-800/40"
                          : inq.inquiryType === "SERVICE_QUOTE"
                          ? "bg-blue-950/60 text-blue-300 border border-blue-800/40"
                          : "bg-gray-800 text-gray-300"
                      }`}
                    >
                      {inq.inquiryType.replace("_", " ")}
                    </span>
                    <span className="text-[11px] font-bold text-white truncate">{inq.customerName}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 truncate">
                    {inq.vehicleYearMakeModel ? `${inq.vehicleYearMakeModel} • ` : ""}
                    {inq.requestedService || inq.message}
                  </p>
                </div>

                <span className="text-[10px] font-mono text-gray-500 shrink-0 font-bold">
                  {inq.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Inventory Movements Audit Table */}
      <div className="bg-[#111317] border border-[#22262E] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#22262E] pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Auditable Inventory Movement History (Real-Time Ledger)
            </h2>
          </div>
          <Link
            href="/admin/inventory"
            className="text-xs font-bold text-gray-400 hover:text-white"
          >
            Open Full Ledger &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08090B] text-gray-400 uppercase font-mono border-b border-[#22262E]">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Product / SKU</th>
                <th className="py-2.5 px-3">Delta</th>
                <th className="py-2.5 px-3">Balance After</th>
                <th className="py-2.5 px-3">Reason / Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F232B] text-gray-300">
              {movements.map((m) => (
                <tr key={m.id} className="hover:bg-[#16191F]">
                  <td className="py-3 px-3 text-[11px] font-mono text-gray-400">
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${
                        m.movementType === "RECEIPT"
                          ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800"
                          : m.movementType === "SALE"
                          ? "bg-blue-950/60 text-blue-400 border border-blue-800"
                          : "bg-amber-950/60 text-amber-400 border border-amber-800"
                      }`}
                    >
                      {m.movementType}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white">{m.variant.product.name}</div>
                    <div className="text-[10px] text-gray-500 font-mono">{m.variant.sku}</div>
                  </td>
                  <td
                    className={`py-3 px-3 font-mono font-black ${
                      m.quantityDelta > 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {m.quantityDelta > 0 ? `+${m.quantityDelta}` : m.quantityDelta}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-white">
                    {m.balanceAfter}
                  </td>
                  <td className="py-3 px-3 text-xs text-gray-400 max-w-xs truncate">
                    {m.reason} {m.referenceId && `(${m.referenceId})`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
