"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";

export default function AdminLogoutButton() {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      window.location.href = "/admin/login";
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loggingOut}
      className="flex items-center justify-between w-full text-left text-gray-400 hover:text-red-400 px-2.5 py-1.5 rounded hover:bg-[#16191F] transition-colors group cursor-pointer"
      title="Sign Out of Admin Hub"
      aria-label="Sign Out of Staff Hub"
    >
      <span className="font-semibold text-xs text-gray-300 group-hover:text-red-400">
        {loggingOut ? "Signing Out..." : "Sign Out"}
      </span>
      <LogOut className="w-3.5 h-3.5 text-gray-500 group-hover:text-red-400 transition-colors" />
    </button>
  );
}
