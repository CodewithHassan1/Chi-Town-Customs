"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { FastForward, Sparkles, VolumeX, Volume2, ShieldCheck } from "lucide-react";

interface CinematicIntroOverlayProps {
  onComplete?: () => void;
  forcePlay?: boolean;
}

export default function CinematicIntroOverlay({ onComplete, forcePlay = false }: CinematicIntroOverlayProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<"video" | "impact" | "tire" | "done">("video");
  const [tireProgress, setTireProgress] = useState(0); // 0 to 1
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10.0);
  const [isMuted, setIsMuted] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const tireStartTimeRef = useRef<number | null>(null);
  const hasEndedRef = useRef(false);

  const TOTAL_VIDEO_DURATION = 10.0; // 10-second genuine AI automotive video

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const completeIntro = useCallback(() => {
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;

    // Restore body scroll
    document.body.style.overflow = "";

    setPhase("done");
    setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 400);
  }, [onComplete]);

  // Handle intro lifecycle on every page load/reload
  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion && !forcePlay) {
      completeIntro();
      return;
    }

    // Initialize intro on every page load/reload
    setIsVisible(true);
    setPhase("video");
    document.body.style.overflow = "hidden";

    // Global keyboard listener for ESC key to skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        completeIntro();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Global listener for replay trigger
    const handleReplay = () => {
      hasEndedRef.current = false;
      setIsVisible(true);
      setPhase("video");
      setTireProgress(0);
      document.body.style.overflow = "hidden";
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    };
    window.addEventListener("replay-cinematic-intro", handleReplay);

    // Maximum safety timeout (16 seconds)
    const safetyTimer = setTimeout(() => {
      completeIntro();
    }, 16000);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("replay-cinematic-intro", handleReplay);
      clearTimeout(safetyTimer);
      document.body.style.overflow = "";
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [completeIntro, forcePlay]);

  // Video time tracker to trigger Screen Impact & Tire Reveal
  const handleTimeUpdate = () => {
    if (!videoRef.current || hasEndedRef.current) return;
    const t = videoRef.current.currentTime;
    setCurrentTime(t);

    // Climax impact beat at ~9.2s (when the car and custom wheel fill the camera lens)
    if (t >= 9.2 && phase === "video") {
      setPhase("impact");
    }

    // Seamlessly transition to tire reveal at ~9.6s
    if (t >= 9.6 && phase !== "tire" && phase !== "done") {
      startTireTransition();
    }
  };

  // When video naturally ends
  const handleVideoEnded = () => {
    if (phase !== "tire" && phase !== "done") {
      startTireTransition();
    }
  };

  // Video load error fallback
  const handleVideoError = () => {
    console.warn("[CinematicIntro] Video load error, advancing to tire reveal");
    startTireTransition();
  };

  // Animate the photorealistic tire sliding upward to reveal the website
  const startTireTransition = () => {
    setPhase("tire");
    tireStartTimeRef.current = performance.now();

    const TIRE_ANIMATION_DURATION = 2200; // ms

    const step = (now: number) => {
      if (!tireStartTimeRef.current) tireStartTimeRef.current = now;
      const elapsed = now - tireStartTimeRef.current;
      const rawProgress = Math.min(elapsed / TIRE_ANIMATION_DURATION, 1.0);

      // Smooth custom easing curve (starts with physical weight, surges with momentum)
      // Ease out cubic / quint
      const eased = 1 - Math.pow(1 - rawProgress, 3.5);
      setTireProgress(eased);

      if (rawProgress < 1.0 && !hasEndedRef.current) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        completeIntro();
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  };

  if (!isVisible) {
    return null;
  }

  // Calculate dynamic curtain clip & tire transform
  // At tireProgress = 0: tire is at bottom (translateY = 100%), curtain covers 100%
  // At tireProgress = 1: tire has exited top (translateY = -120%), curtain reveals 100%
  const tireTranslateY = 105 - tireProgress * 230; // 105% -> -125%
  const tireRotation = -12 + tireProgress * 48; // -12deg -> 36deg rotational inertia
  const tireScale = 0.88 + Math.sin(tireProgress * Math.PI) * 0.28; // Subtle perspective surge
  const curtainClipPercent = Math.max(0, Math.min(100, (1 - tireProgress) * 100));

  return (
    <div
      id="cinematic-intro-overlay"
      className={`fixed inset-0 z-[99999] pointer-events-auto select-none bg-[#08090B] transition-opacity duration-500 ${
        phase === "done" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        clipPath:
          phase === "tire"
            ? `polygon(0 0, 100% 0, 100% ${curtainClipPercent}%, 0 ${curtainClipPercent}%)`
            : undefined,
      }}
    >
      {/* 1. CINEMATIC VIDEO LAYER */}
      <div
        className={`absolute inset-0 w-full h-full overflow-hidden transition-all duration-300 ${
          phase === "impact" ? "scale-[1.04] filter brightness-125 contrast-125" : "scale-100"
        } ${phase === "tire" ? "opacity-30" : "opacity-100"}`}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover object-center pointer-events-none"
          autoPlay
          muted={isMuted}
          playsInline
          preload="auto"
          poster="/video/chitown_car_intro_poster.jpg"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          onError={handleVideoError}
          onLoadedMetadata={() => {
            if (videoRef.current) {
              setDuration(videoRef.current.duration || TOTAL_VIDEO_DURATION);
            }
          }}
        >
          <source src="/video/chitown_car_intro.mp4" type="video/mp4" />
        </video>

        {/* Ambient Brand Watermark Accent */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-10 z-20 flex items-center gap-3 pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-[#D71920] animate-ping" />
          <div className="space-y-0.5">
            <span className="text-[11px] font-heading font-black tracking-widest uppercase text-white/90 drop-shadow">
              CHI-TOWN CUSTOMS USA
            </span>
            <p className="text-[9px] font-mono tracking-wider uppercase text-gray-400">
              311 N Cicero Ave &bull; Chicago, IL
            </p>
          </div>
        </div>
      </div>

      {/* 2. SCREEN IMPACT BEAT (White/Red Metallic Light Flash) */}
      <div
        className={`absolute inset-0 pointer-events-none z-30 transition-opacity duration-150 ${
          phase === "impact" ? "opacity-90" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(215,25,32,0.6) 45%, rgba(8,9,11,0.9) 100%)",
        }}
      />

      {/* 3. TIRE REVEAL SLIDER LAYER */}
      {phase === "tire" && (
        <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center overflow-hidden">
          {/* Traveling Edge Beam along the reveal horizon */}
          <div
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D71920] to-transparent shadow-[0_0_20px_#D71920]"
            style={{ top: `${curtainClipPercent}%` }}
          />

          {/* The Large Premium Performance Tire */}
          <div
            className="relative will-change-transform drop-shadow-[0_20px_60px_rgba(0,0,0,0.95)]"
            style={{
              transform: `translate3d(0, ${tireTranslateY}vh, 0) scale(${tireScale}) rotate(${tireRotation}deg)`,
              width: "min(85vw, 680px)",
              height: "min(85vw, 680px)",
            }}
          >
            {/* Ambient Ruby Rim Glow */}
            <div className="absolute inset-4 rounded-full bg-[#D71920]/20 blur-2xl -z-10" />

            <Image
              src="/images/intro/premium_tire.png"
              alt="Chi-Town Customs USA - Premium Forged Performance Wheel & Tire"
              fill
              priority
              className="object-contain"
            />

            {/* Revealing Brand Badge on the Center Cap */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[10px] sm:text-xs font-mono font-black tracking-widest text-[#D71920] uppercase bg-black/70 px-2 py-0.5 rounded border border-[#D71920]/40 shadow-glow-red opacity-0 transition-opacity duration-300">
                CHICAGO BUILT
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. ACCESSIBLE CONTROLS: AUDIO TOGGLE, TIMELINE, AND SKIP INTRO */}
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-50 flex items-center gap-3">
        {/* Subtle Progress Bar */}
        <div className="hidden sm:flex flex-col items-end text-[10px] font-mono text-gray-400 space-y-1">
          <span className="text-[9px] uppercase tracking-wider text-gray-400">
            {phase === "tire" ? "Revealing Storefront..." : "Cinematic Experience"}
          </span>
          <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D71920] transition-all duration-100"
              style={{
                width: `${Math.min(
                  100,
                  phase === "tire"
                    ? 80 + tireProgress * 20
                    : (currentTime / TOTAL_VIDEO_DURATION) * 80
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Audio Mute/Unmute Toggle Button */}
        <button
          type="button"
          onClick={toggleMute}
          className="flex items-center gap-1.5 bg-[#111317]/90 hover:bg-[#1a1d24] text-white border border-[#292D34] hover:border-gray-500 px-3.5 py-2.5 rounded-full text-xs font-heading uppercase tracking-wider transition-all duration-200 shadow-2xl backdrop-blur-md active:scale-95"
          aria-label={isMuted ? "Unmute Engine Sound" : "Mute Sound"}
          title={isMuted ? "Unmute Audio" : "Mute Audio"}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-gray-400" />
              <span className="hidden sm:inline text-[10px] text-gray-300">Sound Muted</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#D71920] animate-pulse" />
              <span className="hidden sm:inline text-[10px] text-[#D71920] font-bold">Sound On</span>
            </>
          )}
        </button>

        {/* Skip Button */}
        <button
          type="button"
          onClick={completeIntro}
          className="group flex items-center gap-2 bg-[#111317]/90 hover:bg-[#D71920] text-white border border-[#292D34] hover:border-[#D71920] px-4 py-2.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all duration-200 shadow-2xl backdrop-blur-md active:scale-95"
          aria-label="Skip Intro Animation (Press Escape)"
        >
          <span>Skip Intro</span>
          <FastForward className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline text-[9px] font-mono text-gray-400 group-hover:text-white/80 border-l border-white/20 pl-2 ml-1">
            ESC
          </span>
        </button>
      </div>
    </div>
  );
}
