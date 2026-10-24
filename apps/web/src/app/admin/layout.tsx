import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  CreditCard,
  MessageSquare,
  Sliders,
  ShieldAlert,
  Settings,
  ExternalLink,
  Laptop,
  LogOut,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#08090B] text-gray-200 flex flex-col md:flex-row font-sans">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#0d0f13] border-r border-[#22262E] flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-5 border-b border-[#22262E] flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="relative w-36 h-9">
              <Image src="/images/logo.svg" alt="Chi-Town Customs Admin" fill className="object-contain" priority />
            </div>
          </Link>
          <span className="text-[10px] font-mono bg-[#D71920]/20 text-[#F1262D] border border-[#D71920]/40 px-2 py-0.5 rounded font-bold">
            HUB
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 text-xs">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-[#16191F] font-semibold transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-[#D71920]" />
            <span>Operations Dashboard</span>
          </Link>

          <Link
            href="/admin/inventory"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-[#16191F] font-semibold transition-colors"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Inventory Ledger</span>
          </Link>

          <Link
            href="/admin/products"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-[#16191F] font-semibold transition-colors"
          >
            <Package className="w-4 h-4 text-blue-400" />
            <span>Product Catalog CMS</span>
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-[#16191F] font-semibold transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>Orders &amp; Fulfillment</span>
          </Link>

          <Link
            href="/admin/financing"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-[#16191F] font-semibold transition-colors"
          >
            <CreditCard className="w-4 h-4 text-purple-400" />
            <span>Financing Leads</span>
          </Link>

          <Link
            href="/admin/inquiries"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-[#16191F] font-semibold transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>Quotes &amp; Inquiries</span>
          </Link>

          <Link
            href="/admin/customers"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-[#16191F] font-semibold transition-colors"
          >
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Customer Directory</span>
          </Link>

          <Link
            href="/admin/cms"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-[#16191F] font-semibold transition-colors"
          >
            <Sliders className="w-4 h-4 text-[#D71920]" />
            <span>CMS Site Customizer</span>
          </Link>

          <Link
            href="/admin/audit-logs"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-[#16191F] font-semibold transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Security Audit Trail</span>
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-[#16191F] font-semibold transition-colors"
          >
            <Settings className="w-4 h-4 text-gray-400" />
            <span>System Settings</span>
          </Link>
        </nav>

        {/* User Session & Public Link */}
        <div className="p-4 border-t border-[#22262E] space-y-3 bg-[#0a0c0f]">
          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-white">Marcus Vance</p>
              <p className="text-[10px] text-[#D71920] font-mono font-semibold">SUPER_ADMIN</p>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="Database Connected" />
          </div>

          <div className="pt-1 flex flex-col gap-1.5 text-xs">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between text-gray-400 hover:text-white px-2.5 py-1.5 rounded hover:bg-[#16191F] transition-colors"
            >
              <span>View Live Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Admin Workspace Area */}
      <main className="flex-1 overflow-y-auto min-h-screen bg-[#08090B]">
        {children}
      </main>
    </div>
  );
}
