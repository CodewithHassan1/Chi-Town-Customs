"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  AlertCircle,
  Eye,
  ExternalLink,
} from "lucide-react";

interface OrderRecord {
  id: string;
  orderNumber: string;
  guestName?: string | null;
  guestEmail?: string | null;
  guestPhone?: string | null;
  status: string;
  paymentStatus: string;
  paymentMethod?: string | null;
  fulfillmentType: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  shippingAddressJson?: string | null;
  billingAddressJson?: string | null;
  trackingNumber?: string | null;
  carrier?: string | null;
  internalNotes?: string | null;
  createdAt: string | Date;
  items: Array<{
    id: string;
    productName: string;
    variantSku: string;
    specsSummary: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }>;
}

export default function OrdersClient({ initialOrders }: { initialOrders: OrderRecord[] }) {
  const [orders, setOrders] = useState<OrderRecord[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  // Edit fields
  const [newStatus, setNewStatus] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [carrier, setCarrier] = useState<string>("UPS Freight");
  const [internalNotes, setInternalNotes] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      (ord.guestName && ord.guestName.toLowerCase().includes(search.toLowerCase())) ||
      (ord.guestEmail && ord.guestEmail.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" ? true : ord.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenDetail = (ord: OrderRecord) => {
    setSelectedOrder(ord);
    setNewStatus(ord.status);
    setTrackingNumber(ord.trackingNumber || "");
    setCarrier(ord.carrier || "UPS Freight");
    setInternalNotes(ord.internalNotes || "");
    setFeedback(null);
  };

  const handleSaveOrderUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsUpdating(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber: trackingNumber || null,
          carrier: carrier || null,
          internalNotes: internalNotes || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, ...data.order } : o))
      );
      setSelectedOrder((prev) => (prev ? { ...prev, ...data.order } : null));
      setFeedback("Order updated successfully!");
    } catch (err: any) {
      setFeedback(`Error: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#22262E] pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D71920]">
            Fulfillment &bull; Customer Shipments
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            ORDER OPERATIONS &bull; PIPELINE
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Process orders, assign tracking numbers, stage in-store pickups, and record notes.
          </p>
        </div>

        <div className="text-xs text-gray-400 font-mono">
          Total Orders: <strong className="text-white">{orders.length}</strong>
        </div>
      </div>

      {/* Filter Pipeline Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#22262E] pb-3 text-xs font-bold uppercase tracking-wider">
        {[
          "ALL",
          "CONFIRMED",
          "PROCESSING",
          "READY_FOR_PICKUP",
          "SHIPPED",
          "DELIVERED",
          "CANCELLED",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === tab
                ? "bg-[#D71920] text-white"
                : "bg-[#111317] text-gray-400 hover:text-white border border-[#22262E]"
            }`}
          >
            {tab.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order #, customer name, email..."
          className="w-full bg-[#111317] border border-[#292D34] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D71920]"
        />
        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
      </div>

      {/* Orders Table */}
      <div className="bg-[#111317] border border-[#22262E] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08090B] text-gray-400 uppercase font-mono border-b border-[#22262E]">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Fulfillment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F232B] text-gray-300">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#16191F] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">{ord.guestName}</span>
                    <span className="text-[11px] text-gray-500 block">{ord.guestEmail}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{ord.guestPhone}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#191C21] border border-[#292D34]">
                      {ord.fulfillmentType === "LOCAL_PICKUP" ? "Chicago Pickup" : "Freight Ground"}
                    </span>
                    {ord.trackingNumber && (
                      <div className="text-[10px] font-mono text-gray-500 mt-1">
                        Track: {ord.trackingNumber}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-800/40">
                      {ord.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold text-emerald-400 font-mono">
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-white text-sm">
                    ${ord.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenDetail(ord)}
                      className="btn-secondary px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Manage</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Operations Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#111317] border border-[#292D34] rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="border-b border-[#22262E] pb-4 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D71920]">
                  Order Operations &bull; {selectedOrder.orderNumber}
                </span>
                <h3 className="text-xl font-black text-white uppercase">
                  {selectedOrder.guestName} &bull; ${selectedOrder.totalAmount.toFixed(2)}
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  Placed: {new Date(selectedOrder.createdAt).toLocaleString()} &bull; Payment: {selectedOrder.paymentStatus}
                </p>
              </div>

              <Link
                href={`/order-confirmation/${selectedOrder.id}`}
                target="_blank"
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
              >
                <span>View Invoice</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {feedback && (
              <div className="p-3 bg-emerald-950/40 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-semibold">
                {feedback}
              </div>
            )}

            {/* Purchased Items List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Line Items ({selectedOrder.items.length})
              </h4>
              <div className="bg-[#08090B] border border-[#22262E] rounded-xl divide-y divide-[#1F232B] max-h-48 overflow-y-auto">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="p-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-white">{item.productName}</p>
                      <p className="text-[11px] text-gray-400">{item.specsSummary}</p>
                      <p className="text-[10px] text-gray-500 font-mono">SKU: {item.variantSku}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 block">
                        {item.quantity} &times; ${item.unitPrice.toFixed(2)}
                      </span>
                      <span className="font-bold text-white font-mono">${item.lineTotal.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleSaveOrderUpdate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Fulfillment Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-[#D71920]"
                  >
                    <option value="CONFIRMED">CONFIRMED (Stock Reserved)</option>
                    <option value="PROCESSING">PROCESSING (Shop Prep / Mount)</option>
                    <option value="READY_FOR_PICKUP">READY FOR PICKUP (At Cicero Ave)</option>
                    <option value="SHIPPED">SHIPPED (In Transit)</option>
                    <option value="DELIVERED">DELIVERED (Completed)</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Carrier
                  </label>
                  <input
                    type="text"
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    placeholder="e.g. UPS Freight or In-Shop Local"
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Tracking Number (If Shipped)
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. 1Z9999999999999999"
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Internal Staff Notes
                  </label>
                  <textarea
                    rows={2}
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Notes on customer pickup date, mounting technicians, etc."
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D71920]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#22262E]">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="btn-secondary px-4 py-2 rounded text-xs font-bold uppercase"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn-primary px-5 py-2 rounded text-xs font-bold uppercase tracking-wider shadow-glow-red"
                >
                  {isUpdating ? "Updating..." : "Save Order Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
