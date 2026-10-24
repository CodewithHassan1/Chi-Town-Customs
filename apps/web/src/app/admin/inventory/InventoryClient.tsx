"use client";

import { useState } from "react";
import {
  Layers,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Download,
  RotateCcw,
  Clock,
  PackagePlus,
  ShieldCheck,
} from "lucide-react";

interface VariantRecord {
  id: string;
  sku: string;
  barcode?: string | null;
  diameter?: number | null;
  width?: number | null;
  boltPattern?: string | null;
  finish?: string | null;
  tireWidth?: number | null;
  aspectRatio?: number | null;
  price: number;
  stockOnHand: number;
  stockReserved: number;
  reorderLevel: number;
  product: {
    name: string;
    productType: string;
    brand?: { name: string } | null;
  };
}

interface MovementRecord {
  id: string;
  movementType: string;
  quantityDelta: number;
  balanceAfter: number;
  reason?: string | null;
  referenceType?: string | null;
  referenceId?: string | null;
  createdAt: string | Date;
  variant: {
    sku: string;
    product: { name: string };
  };
}

interface InventoryClientProps {
  initialVariants: VariantRecord[];
  initialMovements: MovementRecord[];
}

export default function InventoryClient({
  initialVariants,
  initialMovements,
}: InventoryClientProps) {
  const [variants, setVariants] = useState<VariantRecord[]>(initialVariants);
  const [movements, setMovements] = useState<MovementRecord[]>(initialMovements);
  const [search, setSearch] = useState("");
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [activeTab, setActiveTab] = useState<"balances" | "ledger">("balances");

  // Modal State
  const [selectedVariant, setSelectedVariant] = useState<VariantRecord | null>(null);
  const [modalType, setModalType] = useState<"ADJUST" | "RECEIVE" | null>(null);
  const [deltaQty, setDeltaQty] = useState<number>(0);
  const [reason, setReason] = useState<string>("Physical Stock Audit Count");
  const [referenceId, setReferenceId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; error: boolean } | null>(null);

  // Filtered variants
  const filteredVariants = variants.filter((v) => {
    const matchesSearch =
      v.sku.toLowerCase().includes(search.toLowerCase()) ||
      v.product.name.toLowerCase().includes(search.toLowerCase()) ||
      (v.boltPattern && v.boltPattern.toLowerCase().includes(search.toLowerCase()));

    const matchesLowStock = filterLowStock ? v.stockOnHand <= v.reorderLevel : true;

    return matchesSearch && matchesLowStock;
  });

  const handleOpenAdjust = (v: VariantRecord, type: "ADJUST" | "RECEIVE") => {
    setSelectedVariant(v);
    setModalType(type);
    setDeltaQty(type === "RECEIVE" ? 4 : 0);
    setReason(
      type === "RECEIVE" ? "Shipment Arrival from Distributor" : "Physical Stock Audit Count"
    );
    setReferenceId("");
    setFeedbackMsg(null);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariant || deltaQty === 0) {
      setFeedbackMsg({ text: "Delta quantity cannot be 0.", error: true });
      return;
    }

    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch("/api/inventory/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: selectedVariant.id,
          movementType: modalType === "RECEIVE" ? "RECEIPT" : "ADJUSTMENT",
          quantityDelta: deltaQty,
          reason,
          referenceType: modalType === "RECEIVE" ? "PURCHASE_RECEIPT" : "MANUAL_ADJUSTMENT",
          referenceId: referenceId || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update stock");
      }

      // Update local state instantly
      setVariants((prev) =>
        prev.map((v) => (v.id === selectedVariant.id ? { ...v, stockOnHand: data.newBalance } : v))
      );

      // Append movement to top of ledger
      setMovements((prev) => [
        {
          id: data.movementId,
          movementType: modalType === "RECEIVE" ? "RECEIPT" : "ADJUSTMENT",
          quantityDelta: deltaQty,
          balanceAfter: data.newBalance,
          reason,
          referenceType: modalType === "RECEIVE" ? "PURCHASE_RECEIPT" : "MANUAL_ADJUSTMENT",
          referenceId,
          createdAt: new Date().toISOString(),
          variant: {
            sku: selectedVariant.sku,
            product: { name: selectedVariant.product.name },
          },
        },
        ...prev,
      ]);

      setFeedbackMsg({ text: `Successfully updated ${selectedVariant.sku} to ${data.newBalance} units!`, error: false });
      setTimeout(() => {
        setModalType(null);
        setSelectedVariant(null);
      }, 1200);
    } catch (err: any) {
      setFeedbackMsg({ text: err.message, error: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = "SKU,Product,PCD,Diameter,Finish,OnHand,Reserved,Available,ReorderPoint\n";
    const rows = variants
      .map(
        (v) =>
          `"${v.sku}","${v.product.name}","${v.boltPattern || ""}","${v.diameter || ""}","${v.finish || ""}",${v.stockOnHand},${v.stockReserved},${v.stockOnHand - v.stockReserved},${v.reorderLevel}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `chitown_inventory_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#22262E] pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D71920]">
            Authoritative Shop Stock Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            INVENTORY &bull; STOCK MOVEMENT LEDGER
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time balance tracking across wheel SKUs, tires, reservations, and immutable audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="btn-secondary px-3.5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-gray-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-4 border-b border-[#22262E] text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab("balances")}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "balances"
              ? "border-[#D71920] text-white"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4 text-[#D71920]" />
          <span>SKU Balances ({variants.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("ledger")}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "ledger"
              ? "border-[#D71920] text-white"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Movement History Ledger ({movements.length})</span>
        </button>
      </div>

      {activeTab === "balances" && (
        <div className="space-y-4">
          {/* Search & Low Stock Toggle Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111317] border border-[#22262E] p-4 rounded-xl">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by SKU, brand, or bolt pattern..."
                className="w-full bg-[#08090B] border border-[#292D34] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D71920]"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
            </div>

            <button
              onClick={() => setFilterLowStock(!filterLowStock)}
              className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                filterLowStock
                  ? "bg-amber-950/60 text-amber-400 border border-amber-800"
                  : "bg-[#191C21] text-gray-400 border border-[#292D34] hover:text-white"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Low Stock Alert Only</span>
            </button>
          </div>

          {/* SKU Balances Table */}
          <div className="bg-[#111317] border border-[#22262E] rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#08090B] text-gray-400 uppercase font-mono border-b border-[#22262E]">
                  <tr>
                    <th className="py-3 px-4">SKU / Barcode</th>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">Specs &bull; PCD &bull; Finish</th>
                    <th className="py-3 px-4 text-center">On Hand</th>
                    <th className="py-3 px-4 text-center">Reserved</th>
                    <th className="py-3 px-4 text-center">Available</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F232B] text-gray-300">
                  {filteredVariants.map((v) => {
                    const available = Math.max(0, v.stockOnHand - v.stockReserved);
                    const isLow = v.product.productType !== "SERVICE" && v.stockOnHand <= v.reorderLevel;

                    return (
                      <tr key={v.id} className="hover:bg-[#16191F] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          <div>{v.sku}</div>
                          {v.barcode && <div className="text-[10px] text-gray-500">{v.barcode}</div>}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white block">{v.product.name}</span>
                          <span className="text-[10px] text-gray-400 uppercase">{v.product.brand?.name}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-gray-300">
                          {v.diameter && v.width ? `${v.diameter}"x${v.width}" | ${v.boltPattern || ""} | ${v.finish || ""}` : v.finish || "Standard"}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-white text-sm">
                          {v.stockOnHand}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-amber-400">
                          {v.stockReserved}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-black text-emerald-400 text-sm">
                          {available}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {isLow ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
                              <AlertTriangle className="w-3 h-3" /> Reorder
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                              Optimal
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenAdjust(v, "RECEIVE")}
                              className="px-2 py-1 bg-[#191C21] hover:bg-[#20242B] border border-[#292D34] text-white rounded text-[11px] font-bold uppercase transition-colors"
                              title="Receive Inbound Stock"
                            >
                              Receive
                            </button>
                            <button
                              onClick={() => handleOpenAdjust(v, "ADJUST")}
                              className="px-2 py-1 bg-[#191C21] hover:bg-[#D71920] border border-[#292D34] hover:border-[#D71920] text-white rounded text-[11px] font-bold uppercase transition-colors"
                              title="Manual Balance Adjustment"
                            >
                              Adjust
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Movement Ledger View */}
      {activeTab === "ledger" && (
        <div className="bg-[#111317] border border-[#22262E] rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-[#22262E] flex justify-between items-center">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Immutable Historical Inventory Movements (Audit Logged)
            </h3>
            <span className="text-xs text-gray-400 font-mono">Total Movements: {movements.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#08090B] text-gray-400 uppercase font-mono border-b border-[#22262E]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">SKU / Product</th>
                  <th className="py-3 px-4 text-center">Delta</th>
                  <th className="py-3 px-4 text-center">Balance After</th>
                  <th className="py-3 px-4">Reason &bull; Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F232B] text-gray-300">
                {movements.map((m) => (
                  <tr key={m.id} className="hover:bg-[#16191F] transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-400">
                      {new Date(m.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded font-mono ${
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
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-white">{m.variant?.sku}</span>
                      <span className="text-[10px] text-gray-400 block truncate max-w-xs">
                        {m.variant?.product?.name}
                      </span>
                    </td>
                    <td
                      className={`py-3 px-4 text-center font-mono font-black ${
                        m.quantityDelta > 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {m.quantityDelta > 0 ? `+${m.quantityDelta}` : m.quantityDelta}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-white">
                      {m.balanceAfter}
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      <div>{m.reason || "Manual audit entry"}</div>
                      {m.referenceId && (
                        <div className="text-[10px] font-mono text-gray-500">Ref: {m.referenceId}</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjust / Receive Stock Modal */}
      {modalType && selectedVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111317] border border-[#292D34] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="border-b border-[#22262E] pb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D71920]">
                {modalType === "RECEIVE" ? "Receive Distributor Stock" : "Adjust Authoritative Balance"}
              </span>
              <h3 className="text-lg font-black text-white uppercase">{selectedVariant.product.name}</h3>
              <p className="text-xs font-mono text-gray-400 mt-0.5">
                SKU: {selectedVariant.sku} &bull; Current On-Hand: <strong>{selectedVariant.stockOnHand}</strong>
              </p>
            </div>

            {feedbackMsg && (
              <div
                className={`p-3 rounded-lg text-xs font-semibold ${
                  feedbackMsg.error
                    ? "bg-red-950/40 text-red-300 border border-red-800"
                    : "bg-emerald-950/40 text-emerald-300 border border-emerald-800"
                }`}
              >
                {feedbackMsg.text}
              </div>
            )}

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Quantity Delta (Add or Deduct)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    required
                    value={deltaQty}
                    onChange={(e) => setDeltaQty(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-[#D71920]"
                  />
                  <div className="text-xs font-mono text-gray-400 shrink-0">
                    New Balance:{" "}
                    <strong className="text-white">
                      {Math.max(0, selectedVariant.stockOnHand + deltaQty)}
                    </strong>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Mandatory Audit Reason *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D71920]"
                >
                  <option value="Physical Stock Audit Count">Physical Stock Audit Count</option>
                  <option value="Damaged During Shop Handling">Damaged During Shop Handling</option>
                  <option value="Shipment Arrival from Distributor">Shipment Arrival from Distributor</option>
                  <option value="Customer Return Restocked">Customer Return Restocked</option>
                  <option value="Showroom Display Allocation">Showroom Display Allocation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Reference ID (PO Number, RMA, or Job #)
                </label>
                <input
                  type="text"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  placeholder="e.g. PO-2026-004 or JOB-882"
                  className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D71920]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#22262E]">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="btn-secondary px-4 py-2 rounded text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary px-5 py-2 rounded text-xs font-bold uppercase tracking-wider"
                >
                  {isSubmitting ? "Writing to Ledger..." : "Commit Stock Change"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
