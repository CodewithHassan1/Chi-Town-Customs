"use client";

import { useState } from "react";
import {
  Users,
  Search,
  ShieldCheck,
  ShoppingBag,
  Mail,
  Phone,
  Calendar,
  X,
  Edit2,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  createdAt: string | Date;
  orders: Array<{
    id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    createdAt: string | Date;
  }>;
}

const AVAILABLE_ROLES = [
  "CUSTOMER",
  "STAFF",
  "INVENTORY_MANAGER",
  "ORDER_MANAGER",
  "CONTENT_MANAGER",
  "FINANCE_MANAGER",
  "ADMIN",
  "SUPER_ADMIN",
];

export default function CustomersClient({ initialUsers }: { initialUsers: UserRecord[] }) {
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Selected user for profile modal
  const [activeUser, setActiveUser] = useState<UserRecord | null>(null);
  const [editRole, setEditRole] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; error: boolean } | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = roleFilter === "ALL" ? true : u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleOpenProfile = (u: UserRecord) => {
    setActiveUser(u);
    setEditRole(u.role);
    setFeedback(null);
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUser) return;

    setIsUpdating(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/users/${activeUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: editRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update role");

      setUsers((prev) =>
        prev.map((u) => (u.id === activeUser.id ? { ...u, role: editRole } : u))
      );
      setActiveUser((prev) => (prev ? { ...prev, role: editRole } : null));
      setFeedback({ text: data.message || "Role updated successfully", error: false });
    } catch (err: any) {
      setFeedback({ text: err.message, error: true });
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
            Customer CRM &bull; Accounts
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            CUSTOMER DIRECTORY &bull; ROLES
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Profiles, order histories, contact information, and administrative role assignments.
          </p>
        </div>

        <div className="text-xs text-gray-400 font-mono">
          Total Users: <strong className="text-white">{users.length}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111317] border border-[#22262E] p-4 rounded-xl">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full bg-[#08090B] border border-[#292D34] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D71920]"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
          <span className="text-gray-400">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#08090B] border border-[#292D34] text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#D71920]"
          >
            <option value="ALL">All Roles</option>
            {AVAILABLE_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
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
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F232B] text-gray-300">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#16191F] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{u.name}</td>
                  <td className="py-3.5 px-4 font-mono text-gray-400">{u.email}</td>
                  <td className="py-3.5 px-4 font-mono text-gray-400">{u.phone || "—"}</td>
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
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenProfile(u)}
                      className="px-2.5 py-1 rounded bg-[#16191F] hover:bg-[#20252E] text-gray-300 hover:text-white border border-[#292D34] text-xs font-semibold"
                    >
                      View / Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Profile & Role Modal */}
      {activeUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111317] border border-[#292D34] rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="border-b border-[#22262E] pb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D71920]">
                  User Profile &bull; Access Control
                </span>
                <h3 className="text-xl font-black text-white uppercase">{activeUser.name}</h3>
              </div>
              <button
                onClick={() => setActiveUser(null)}
                className="text-gray-500 hover:text-white p-1 rounded hover:bg-[#191C21]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                  feedback.error
                    ? "bg-red-950/40 text-red-300 border border-red-800"
                    : "bg-emerald-950/40 text-emerald-300 border border-emerald-800"
                }`}
              >
                {feedback.error ? (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                )}
                <span>{feedback.text}</span>
              </div>
            )}

            <div className="bg-[#0A0C0F] border border-[#1F232B] rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="text-white font-mono font-semibold">{activeUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone:</span>
                <span className="text-white font-mono">{activeUser.phone || "None registered"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Joined:</span>
                <span className="text-gray-400 font-mono">
                  {new Date(activeUser.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Completed Orders:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {activeUser.orders.length}
                </span>
              </div>
            </div>

            {/* Role Assignment Form */}
            <form onSubmit={handleSaveRole} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Assigned Administrative Role
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  disabled={activeUser.email === "admin@chitowncustoms.com"}
                  className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-[#D71920]"
                >
                  {AVAILABLE_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {activeUser.email === "admin@chitowncustoms.com" && (
                  <p className="text-[10px] text-amber-400 mt-1 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Primary Super Admin root account is protected and cannot be changed.</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#22262E]">
                <button
                  type="button"
                  onClick={() => setActiveUser(null)}
                  className="btn-secondary px-4 py-2 rounded text-xs font-bold uppercase"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isUpdating || activeUser.email === "admin@chitowncustoms.com"}
                  className="btn-primary px-5 py-2 rounded text-xs font-bold uppercase tracking-wider"
                >
                  {isUpdating ? "Updating Role..." : "Save Role Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
