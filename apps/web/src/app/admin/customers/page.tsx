import db from "@/lib/db";
import { Users, Mail, Phone, ShoppingBag, ShieldCheck } from "lucide-react";

export const revalidate = 0;

export default async function AdminCustomersPage() {
  const [users, orders] = await Promise.all([
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        orders: true,
      },
    }),
    db.order.findMany(),
  ]);

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#22262E] pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D71920]">
            Customer CRM &bull; Accounts
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            CUSTOMER DIRECTORY
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Profiles, order histories, contact information, and role assignments.
          </p>
        </div>

        <div className="text-xs text-gray-400 font-mono">
          Total Users: <strong className="text-white">{users.length}</strong>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#111317] border border-[#22262E] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08090B] text-gray-400 uppercase font-mono border-b border-[#22262E]">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-center">Orders</th>
                <th className="py-3 px-4 text-right">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F232B] text-gray-300">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#16191F] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    {u.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-400">
                    {u.email}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-400">
                    {u.phone || "—"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        u.role === "SUPER_ADMIN"
                          ? "bg-red-950/60 text-red-400 border border-red-800"
                          : u.role === "INVENTORY_MANAGER" || u.role === "STAFF"
                          ? "bg-amber-950/60 text-amber-400 border border-amber-800"
                          : "bg-[#191C21] text-gray-300 border border-[#292D34]"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                    {u.orders.length}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-gray-500 text-[11px]">
                    {new Date(u.createdAt).toLocaleDateString()}
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
