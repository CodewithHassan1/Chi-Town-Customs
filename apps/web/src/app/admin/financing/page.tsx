import Link from "next/link";
import db from "@/lib/db";
import { CreditCard, CheckCircle2, Phone, Mail, Clock, ShieldCheck, ExternalLink } from "lucide-react";

export const revalidate = 0;

export default async function AdminFinancingPage() {
  const leads = await db.inquiry.findMany({
    where: { inquiryType: "FINANCING_LEAD" },
    orderBy: { createdAt: "desc" },
    include: { assignedStaff: true },
  });

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#22262E] pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D71920]">
            Snap Finance &bull; Acima &bull; Affirm
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            FINANCING LEADS &bull; PRE-QUALIFICATION PIPELINE
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Follow up with customer pre-approval inquiries, send direct partner referral links, and track application status.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4" />
          <span>Zero Sensitive Financial Credentials Stored</span>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-[#111317] border border-[#22262E] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08090B] text-gray-400 uppercase font-mono border-b border-[#22262E]">
              <tr>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Vehicle Chassis</th>
                <th className="py-3 px-4">Requested Provider &bull; Budget</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Specialist</th>
                <th className="py-3 px-4 text-right">Date Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F232B] text-gray-300">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No active financing leads recorded yet.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#16191F] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{lead.customerName}</div>
                      <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3 text-[#D71920]" />
                        <span>{lead.customerEmail}</span>
                      </div>
                      <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5 font-mono">
                        <Phone className="w-3 h-3 text-[#D71920]" />
                        <span>{lead.customerPhone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {lead.vehicleYearMakeModel || "Not specified"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-purple-400 block">{lead.requestedService}</span>
                      {lead.internalNotes && (
                        <span className="text-[10px] text-gray-400 italic block mt-0.5">
                          Note: {lead.internalNotes}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950/40 text-purple-400 border border-purple-800/40">
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-400">
                      {lead.assignedStaff?.name || "Marcus Vance (Owner)"}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-gray-400 text-[11px]">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
