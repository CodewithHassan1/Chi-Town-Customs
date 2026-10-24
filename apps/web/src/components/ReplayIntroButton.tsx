"use client";

import { Play } from "lucide-react";

export default function ReplayIntroButton() {
  const handleReplay = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("replay-cinematic-intro"));
    }
  };

  return (
    <button
      type="button"
      onClick={handleReplay}
      className="inline-flex items-center gap-1.5 bg-[#111317]/80 hover:bg-[#D71920]/20 border border-[#292D34] hover:border-[#D71920] px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-gray-300 hover:text-white transition-all shadow-md active:scale-95 group backdrop-blur-md"
      title="Experience Cinematic Intro Film"
      aria-label="Replay Cinematic Intro Film"
    >
      <Play className="w-2.5 h-2.5 text-[#D71920] fill-[#D71920] group-hover:scale-110 transition-transform" />
      <span>Play Intro Film</span>
    </button>
  );
}
