"use client";

import React, { useState } from "react";

export interface TransitionConfig {
  duration?: number;
  type?: string;
  bounce?: number;
  ease?: string;
}

export interface RandomLetterSwapProps {
  label: string;
  className?: string;
  staggerDuration?: number;
  transition?: TransitionConfig;
  reverse?: boolean;
  isHovered?: boolean;
}

export function RandomLetterSwap({
  label,
  className = "",
  staggerDuration = 0.025,
  transition = { duration: 0.6, type: "spring", bounce: 0.2 },
  isHovered: externalHovered,
}: RandomLetterSwapProps) {
  const [internalHovered, setInternalHovered] = useState(false);

  const isHovered = externalHovered !== undefined ? externalHovered : internalHovered;
  const duration = transition.duration ?? 0.6;
  const ease = "cubic-bezier(0.34, 1.56, 0.64, 1)"; // Precise spring physics curve

  const letters = label.split("");

  return (
    <span
      className={`relative inline-flex items-center overflow-hidden select-none whitespace-nowrap leading-none ${className}`}
      onMouseEnter={() => setInternalHovered(true)}
      onMouseLeave={() => setInternalHovered(false)}
      onFocus={() => setInternalHovered(true)}
      onBlur={() => setInternalHovered(false)}
    >
      {/* Screen-reader accessible label */}
      <span className="sr-only">{label}</span>

      {/* Visual animated letter spans */}
      <span aria-hidden="true" className="inline-flex items-center">
        {letters.map((char, index) => {
          const delay = index * staggerDuration;
          const isSpace = char === " ";

          if (isSpace) {
            return (
              <span key={index} className="inline-block w-[0.3em]">
                &nbsp;
              </span>
            );
          }

          return (
            <span
              key={index}
              className="relative inline-flex flex-col justify-start overflow-hidden h-[1.3em] leading-[1.3em]"
            >
              <span
                className="inline-block will-change-transform"
                style={{
                  transform: isHovered ? "translateY(-100%)" : "translateY(0%)",
                  transition: `transform ${duration}s ${ease} ${delay}s`,
                }}
              >
                {char}
              </span>
              <span
                className="absolute top-full left-0 inline-block text-[#D71920] will-change-transform"
                style={{
                  transform: isHovered ? "translateY(-100%)" : "translateY(0%)",
                  transition: `transform ${duration}s ${ease} ${delay}s`,
                }}
              >
                {char}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}

export default RandomLetterSwap;
