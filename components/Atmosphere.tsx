"use client";

import { memo } from "react";

interface AtmosphereProps {
  mode: "normal" | "rain" | "night";
}

const RAIN_DROPS = 55;
const RAIN_STYLES = Array.from({ length: RAIN_DROPS }, (_, index) => ({
  left: `${(index * 37) % 100}%`,
  height: `${40 + ((index * 17) % 80)}px`,
  animationDuration: `${0.6 + ((index * 13) % 80) / 100}s`,
  animationDelay: `${((index * 19) % 200) / 100}s`,
  opacity: 0.15 + ((index * 23) % 30) / 100,
}));

function RainLayer() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 2 }}
      aria-hidden="true"
    >
      {RAIN_STYLES.map((style, index) => (
        <div key={index} className="rain-drop" style={style} />
      ))}
    </div>
  );
}

function Atmosphere({ mode }: AtmosphereProps) {
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

export default memo(Atmosphere);
