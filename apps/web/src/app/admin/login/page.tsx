"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles, Key } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setPreset = (presetEmail: string, presetPass: string) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#08090B] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D71920]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block relative w-48 h-12 mx-auto">
            <Image src="/images/logo.svg" alt="Chi-Town Customs USA" fill className="object-contain" priority />
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16191F] border border-[#22262E] text-[11px] font-mono text-gray-300">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D71920]" />
            <span>Authorized Staff &amp; Operations Portal</span>
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            SIGN IN TO <span className="text-gradient-red">SHOP CMS</span>
          </h1>
          <p className="text-xs text-gray-400">
            Secure access for inventory control, order fulfillment, and shop operations.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-[#111317] border border-[#22262E] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#D71920] shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@chitowncustoms.com"
                  className="w-full bg-[#08090B] border border-[#292D34] rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#08090B] border border-[#292D34] rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-red mt-2"
            >
              {loading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Sign In To Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Staff Presets */}
          <div className="pt-4 border-t border-[#22262E] space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Quick Role Presets</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-left">
              <button
                type="button"
                onClick={() => setPreset("admin@chitowncustoms.com", "ChiTownAdmin2026!")}
                className="p-2.5 rounded-lg bg-[#08090B] border border-[#22262E] hover:border-gray-500 transition-colors text-left"
              >
                <p className="text-[11px] font-bold text-white">Super Admin</p>
                <p className="text-[10px] text-gray-400 font-mono">admin@chitowncustoms.com</p>
              </button>
              <button
                type="button"
                onClick={() => setPreset("shop@chitowncustoms.com", "ChiTownStaff2026!")}
                className="p-2.5 rounded-lg bg-[#08090B] border border-[#22262E] hover:border-gray-500 transition-colors text-left"
              >
                <p className="text-[11px] font-bold text-white">Inventory Tech</p>
                <p className="text-[10px] text-gray-400 font-mono">shop@chitowncustoms.com</p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-gray-500">
          <p>Chi-Town Customs USA &bull; 311 N Cicero Ave, Chicago, IL 60644</p>
          <p className="mt-1">
            Need public storefront?{" "}
            <Link href="/" className="text-[#D71920] hover:underline font-bold">
              Return Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
