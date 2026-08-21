"use client";

import { useEffect, useRef } from "react";

interface AtmosphereProps {
  mode: "normal" | "rain" | "night";
}

const RAIN_DROPS = 55;

function RainLayer() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 2 }}
      aria-hidden="true"
    >
      {Array.from({ length: RAIN_DROPS }, (_, i) => {
        const left = Math.random() * 100;
        const height = 40 + Math.random() * 80;
        const duration = 0.6 + Math.random() * 0.8;
        const delay = Math.random() * 2;
        const opacity = 0.15 + Math.random() * 0.3;
        return (
          <div
            key={i}
            className="rain-drop"
            style={{
              left: `${left}%`,
              height: `${height}px`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              opacity,
            }}
          />
        );
      })}
    </div>
  );
}

export default function Atmosphere({ mode }: AtmosphereProps) {
  return (
    <>
      {/* Film grain — always present, very subtle */}
      <div className="film-grain" aria-hidden="true" />

      {/* Rain overlay */}
      {mode === "rain" && <RainLayer />}

      {/* Warm amber light layer — simulates room warmth */}
      <div
        className="fixed inset-0 pointer-events-none warm-flicker"
        style={{
          zIndex: 1,
          background:
            "radial-gradient(ellipse 60% 40% at 55% 60%, rgba(180, 100, 30, 0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
    </>
  );
}
