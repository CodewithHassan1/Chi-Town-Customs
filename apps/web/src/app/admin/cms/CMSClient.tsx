"use client";

import { useState } from "react";
import Image from "next/image";
import { Sliders, Sparkles, CheckCircle2, Save, ExternalLink } from "lucide-react";

interface CMSSectionRecord {
  id: string;
  sectionKey: string;
  title: string;
  subtitle?: string | null;
  contentJson: string;
  isVisible: boolean;
  sortOrder: number;
}

export default function CMSClient({ initialSections }: { initialSections: CMSSectionRecord[] }) {
  const heroSection = initialSections.find((s) => s.sectionKey === "hero");
  let heroContent = {
    headline: "BUILT TO STAND OUT.",
    subheadline:
      "Engineered with aerospace-grade forged aluminum and finished with artisanal precision. Located at 311 N Cicero Ave in Chicago, Illinois.",
    primaryCtaText: "SHOP CUSTOM WHEELS",
    primaryCtaUrl: "/shop?category=custom-wheels",
    secondaryCtaText: "EXPLORE SERVICES",
    secondaryCtaUrl: "/services",
    phoneCtaText: "+1 773-287-3000",
    heroImage: "/images/hero-car.jpg",
  };

  try {
    if (heroSection) heroContent = { ...heroContent, ...JSON.parse(heroSection.contentJson) };
  } catch {}

  const announcementSection = initialSections.find((s) => s.sectionKey === "announcement_bar");
  let announcementContent = {
    text: "CHICAGOLAND SPRING SPECIAL: Up to $200 instant savings on custom wheel & tire packages. Call +1 773-287-3000",
    linkText: "Shop Packages",
    linkUrl: "/shop",
    isEnabled: true,
  };

  try {
    if (announcementSection) announcementContent = { ...announcementContent, ...JSON.parse(announcementSection.contentJson) };
  } catch {}

  const [heroForm, setHeroForm] = useState(heroContent);
  const [announcementForm, setAnnouncementForm] = useState(announcementContent);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setToast(null);

    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionKey: "hero",
          title: heroForm.headline,
          subtitle: heroForm.subheadline,
          contentJson: heroForm,
          isVisible: true,
        }),
      });

      if (!res.ok) throw new Error("Failed to save hero section");
      setToast("Hero section updated successfully in database!");
    } catch (err: any) {
      setToast(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setToast(null);

    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionKey: "announcement_bar",
          title: "Top Announcement Bar",
          contentJson: announcementForm,
          isVisible: announcementForm.isEnabled,
        }),
      });

      if (!res.ok) throw new Error("Failed to save announcement bar");
      setToast("Announcement bar updated successfully in database!");
    } catch (err: any) {
      setToast(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#22262E] pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D71920]">
            Database-Backed Storefront Content Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            CMS SITE CUSTOMIZER
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Modify hero copy, call to actions, banners, and announcement texts without touching code.
          </p>
        </div>

        {toast && (
          <div className="p-2.5 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toast}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. Hero Section Customizer */}
        <div className="bg-[#111317] border border-[#22262E] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#22262E] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D71920]" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Hero Section Settings
              </h2>
            </div>
            <span className="text-[10px] font-mono text-gray-500 uppercase">Live Homepage Target</span>
          </div>

          <form onSubmit={handleSaveHero} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                Main Headline *
              </label>
              <input
                type="text"
                required
                value={heroForm.headline}
                onChange={(e) => setHeroForm({ ...heroForm, headline: e.target.value })}
                className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2.5 text-white font-black text-sm uppercase focus:outline-none focus:border-[#D71920]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                Supporting Subheadline *
              </label>
              <textarea
                rows={3}
                required
                value={heroForm.subheadline}
                onChange={(e) => setHeroForm({ ...heroForm, subheadline: e.target.value })}
                className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-[#D71920]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Primary CTA Label
                </label>
                <input
                  type="text"
                  value={heroForm.primaryCtaText}
                  onChange={(e) => setHeroForm({ ...heroForm, primaryCtaText: e.target.value })}
                  className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D71920]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Primary CTA Destination URL
                </label>
                <input
                  type="text"
                  value={heroForm.primaryCtaUrl}
                  onChange={(e) => setHeroForm({ ...heroForm, primaryCtaUrl: e.target.value })}
                  className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-[#D71920]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Secondary CTA Label
                </label>
                <input
                  type="text"
                  value={heroForm.secondaryCtaText}
                  onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaText: e.target.value })}
                  className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D71920]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Secondary CTA Destination URL
                </label>
                <input
                  type="text"
                  value={heroForm.secondaryCtaUrl}
                  onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaUrl: e.target.value })}
                  className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-[#D71920]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                Background Cinematic Image
              </label>
              <select
                value={heroForm.heroImage}
                onChange={(e) => setHeroForm({ ...heroForm, heroImage: e.target.value })}
                className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D71920]"
              >
                <option value="/images/hero-car.jpg">Hero Supercar Wheels in Chicago Warehouse</option>
                <option value="/images/finishes-showcase.jpg">Signature Finishes Showcase</option>
                <option value="/images/wheel-forged.jpg">Forged Monoblock Studio Shot</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-red mt-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving Changes..." : "Publish Hero Updates"}</span>
            </button>
          </form>
        </div>

        {/* 2. Top Announcement Bar Customizer */}
        <div className="bg-[#111317] border border-[#22262E] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#22262E] pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Top Announcement Bar
              </h2>
            </div>
            <span className="text-[10px] font-mono text-gray-500 uppercase">Global Header</span>
          </div>

          <form onSubmit={handleSaveAnnouncement} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                Announcement Message Text *
              </label>
              <textarea
                rows={3}
                required
                value={announcementForm.text}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, text: e.target.value })}
                className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D71920]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Action Link Text
                </label>
                <input
                  type="text"
                  value={announcementForm.linkText}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, linkText: e.target.value })}
                  className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D71920]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Action Link URL
                </label>
                <input
                  type="text"
                  value={announcementForm.linkUrl}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, linkUrl: e.target.value })}
                  className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-[#D71920]"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={announcementForm.isEnabled}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, isEnabled: e.target.checked })}
                  className="text-[#D71920] focus:ring-[#D71920] rounded"
                />
                <span className="text-gray-300 font-semibold">Enable Announcement Bar on Storefront</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-red mt-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Publish Announcement Updates"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
