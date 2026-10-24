import Link from "next/link";
import db from "@/lib/db";
import { MessageSquare, Phone, Mail, Clock, CheckCircle2, Wrench, Calendar } from "lucide-react";

export const revalidate = 0;

export default async function AdminInquiriesPage() {
  const inquiries = await db.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { assignedStaff: true },
  });

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#22262E] pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D71920]">
            Chicago Shop Inquiries &bull; Customer Messages
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            QUOTES &bull; APPOINTMENTS &bull; INQUIRIES
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Review incoming quote requests, crack welding/powder coating estimates, and general questions.
          </p>
        </div>

        <div className="text-xs text-gray-400 font-mono">
          Total Inquiries: <strong className="text-white">{inquiries.length}</strong>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-[#111317] border border-[#22262E] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08090B] text-gray-400 uppercase font-mono border-b border-[#22262E]">
              <tr>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Vehicle &bull; Service</th>
                <th className="py-3 px-4">Message / Request</th>
                <th className="py-3 px-4">Preferred Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F232B] text-gray-300">
              {inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-[#16191F] transition-colors">
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded font-mono ${
                        inq.inquiryType === "SERVICE_QUOTE"
                          ? "bg-blue-950/60 text-blue-400 border border-blue-800"
                          : inq.inquiryType === "APPOINTMENT_REQUEST"
                          ? "bg-amber-950/60 text-amber-400 border border-amber-800"
                          : inq.inquiryType === "FINANCING_LEAD"
                          ? "bg-purple-950/60 text-purple-400 border border-purple-800"
                          : "bg-gray-800 text-gray-300"
                      }`}
                    >
                      {inq.inquiryType.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{inq.customerName}</div>
                    <div className="text-[11px] text-gray-400 font-mono">{inq.customerPhone}</div>
                    <div className="text-[10px] text-gray-500">{inq.customerEmail}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{inq.vehicleYearMakeModel || "N/A"}</div>
                    <div className="text-[11px] text-[#D71920]">{inq.requestedService}</div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-300 max-w-sm truncate" title={inq.message}>
                    {inq.message}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-400">
                    {inq.preferredDate ? (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {inq.preferredDate}
                      </span>
                    ) : (
                      "Flexible"
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950/40 text-blue-400 border border-blue-800/40">
                      {inq.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-[11px] text-gray-500">
                    {new Date(inq.createdAt).toLocaleDateString()}
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
