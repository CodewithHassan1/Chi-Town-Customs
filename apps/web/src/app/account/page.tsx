"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Package,
  MapPin,
  LogOut,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Mail,
  Lock,
  Phone,
  Truck,
} from "lucide-react";

interface CustomerUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AccountPage() {
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
        loadCustomerOrders(data.user.email);
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomerOrders = async (userEmail: string) => {
    try {
      setOrdersLoading(true);
      const res = await fetch(`/api/orders?email=${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to load customer orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      setCurrentUser(data.user);
      loadCustomerOrders(data.user.email);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      setCurrentUser(data.user);
      setSuccessMsg("Account created successfully!");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setCurrentUser(null);
    setOrders([]);
  };

  const setDemoCustomer = () => {
    setEmail("alex.hayes@example.com");
    setPassword("Customer123!");
    setErrorMsg(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090B] flex items-center justify-center text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#D71920] animate-ping" />
          <span className="text-xs uppercase font-bold tracking-widest">Loading Account...</span>
        </div>
      </div>
    );
  }

  // --- Authenticated Customer Portal ---
  if (currentUser) {
    return (
      <div className="min-h-screen bg-[#08090B] py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Top Profile Banner */}
          <div className="bg-[#111317] border border-[#22262E] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#191C21] border border-[#292D34] flex items-center justify-center text-[#D71920]">
                <User className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase bg-[#22262E] text-gray-300 px-2 py-0.5 rounded font-bold">
                  {currentUser.role}
                </span>
                <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                  {currentUser.name}
                </h1>
                <p className="text-xs text-gray-400">{currentUser.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {currentUser.role !== "CUSTOMER" && (
                <Link
                  href="/admin"
                  className="px-4 py-2.5 rounded-lg bg-[#D71920]/20 hover:bg-[#D71920]/30 border border-[#D71920]/50 text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-[#D71920]" />
                  <span>Admin Hub</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-lg bg-[#191C21] hover:bg-[#20242B] border border-[#292D34] text-xs font-bold text-gray-300 hover:text-white uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#111317] border border-[#22262E] rounded-xl p-5 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Orders</span>
              <p className="text-2xl font-black text-white">{orders.length}</p>
            </div>
            <div className="bg-[#111317] border border-[#22262E] rounded-xl p-5 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Saved Vehicle Fitment</span>
              <p className="text-sm font-bold text-[#D71920] pt-1">Chicago Verified Fitment</p>
            </div>
            <div className="bg-[#111317] border border-[#22262E] rounded-xl p-5 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Shop Support Hotline</span>
              <p className="text-sm font-mono font-bold text-white pt-1">+1 773-287-3000</p>
            </div>
          </div>

          {/* Orders Section */}
          <div className="bg-[#111317] border border-[#22262E] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#22262E] pb-4">
              <div className="flex items-center gap-2.5">
                <Package className="w-5 h-5 text-[#D71920]" />
                <h2 className="text-lg font-bold text-white uppercase tracking-tight">Order History</h2>
              </div>
              <Link
                href="/shop"
                className="text-xs font-bold text-[#D71920] hover:text-[#F1262D] uppercase tracking-wider flex items-center gap-1"
              >
                <span>Shop Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {ordersLoading ? (
              <p className="text-xs text-gray-400">Checking recent orders...</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto" />
                <h3 className="text-sm font-bold text-white uppercase">No orders placed yet</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Browse our custom forged wheels, performance tires, and shop services to place your first order.
                </p>
                <Link
                  href="/shop"
                  className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-glow-red mt-2"
                >
                  <span>Explore Wheels</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 rounded-xl bg-[#08090B] border border-[#22262E] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-white">{order.orderNumber}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                            order.status === "DELIVERED"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                              : order.status === "CONFIRMED"
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {order.items?.length || 0} line item(s) &bull; Fulfillment:{" "}
                        <span className="text-white font-medium">{order.fulfillmentType}</span>
                      </p>
                      {order.trackingNumber && (
                        <p className="text-xs font-mono text-cyan-400 flex items-center gap-1 pt-1">
                          <Truck className="w-3.5 h-3.5" />
                          <span>Tracking: {order.trackingNumber}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[11px] text-gray-400 block">Total</span>
                        <span className="text-base font-black text-[#D71920]">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                      </div>

                      <Link
                        href={`/order-confirmation/${order.id}`}
                        className="px-3.5 py-2 rounded-lg bg-[#191C21] hover:bg-[#20242B] border border-[#292D34] text-xs font-bold text-white uppercase tracking-wider"
                      >
                        Receipt &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- Guest / Login / Registration Screen ---
  return (
    <div className="min-h-screen bg-[#08090B] py-16 flex flex-col items-center justify-center px-4 font-sans relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D71920]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16191F] border border-[#22262E] text-[11px] font-mono text-gray-300">
            <User className="w-3.5 h-3.5 text-[#D71920]" />
            <span>Chi-Town Customs Customer Portal</span>
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">
            CUSTOMER <span className="text-gradient-red">SIGN IN</span>
          </h1>
          <p className="text-xs text-gray-400">
            Track your custom wheel orders, fitment specs, and service invoices.
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1 bg-[#111317] border border-[#22262E] rounded-xl">
          <button
            type="button"
            onClick={() => {
              setActiveTab("login");
              setErrorMsg(null);
            }}
            className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
              activeTab === "login"
                ? "bg-[#D71920] text-white shadow-glow-red"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("register");
              setErrorMsg(null);
            }}
            className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
              activeTab === "register"
                ? "bg-[#D71920] text-white shadow-glow-red"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Auth Box */}
        <div className="bg-[#111317] border border-[#22262E] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#D71920] shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.hayes@example.com"
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
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
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="btn-primary w-full py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-red mt-2"
              >
                {formLoading ? "Authenticating..." : "Sign In to Account"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Marcus Vance"
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="customer@example.com"
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 312-555-0182"
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Password (6+ chars) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="btn-primary w-full py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-red mt-2"
              >
                {formLoading ? "Creating Profile..." : "Register Customer Account"}
              </button>
            </form>
          )}

          {/* Quick Demo Customer Button */}
          {activeTab === "login" && (
            <div className="pt-4 border-t border-[#22262E]">
              <button
                type="button"
                onClick={setDemoCustomer}
                className="w-full p-2.5 rounded-lg bg-[#08090B] border border-[#292D34] hover:border-gray-500 text-left transition-colors"
              >
                <p className="text-[11px] font-bold text-white flex items-center justify-between">
                  <span>Demo Customer Autofill</span>
                  <span className="text-[#D71920] font-mono text-[10px]">Autofill &rarr;</span>
                </p>
                <p className="text-[10px] text-gray-400 font-mono">alex.hayes@example.com / Customer123!</p>
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-gray-500">
          <p>Chi-Town Customs USA &bull; 311 N Cicero Ave, Chicago, IL 60644</p>
          <p className="mt-1">
            Looking for staff login?{" "}
            <Link href="/admin/login" className="text-[#D71920] hover:underline font-bold">
              Staff Hub &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
