import db from "@/lib/db";
import { ShieldAlert, ShieldCheck, Clock, UserCheck } from "lucide-react";

export const revalidate = 0;

export default async function AdminAuditLogsPage() {
  const logs = await db.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { staffUser: true },
  });

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#22262E] pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-rose-500">
            Immutable Compliance &bull; Audit Trail
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            SECURITY &amp; SYSTEM AUDIT LOGS
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Cryptographic and database audit record of every inventory adjustment, order transition, and product modification.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4" />
          <span>Tamper-Resistant Logging Active</span>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-[#111317] border border-[#22262E] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08090B] text-gray-400 uppercase font-mono border-b border-[#22262E]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity &bull; Reference ID</th>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Metadata Snapshot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F232B] text-gray-300">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#16191F] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-gray-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#191C21] text-rose-400 border border-[#292D34]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className="text-white font-bold">{log.entity}</span>
                    <span className="text-gray-500 block text-[10px] truncate max-w-xs">{log.entityId}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">
                      {log.staffUser?.name || "System Automated"}
                    </div>
                    <div className="text-[10px] text-gray-500">{log.staffUser?.email || "internal-service"}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-gray-400 max-w-sm truncate" title={log.metadataJson || ""}>
                    {log.metadataJson || "—"}
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
