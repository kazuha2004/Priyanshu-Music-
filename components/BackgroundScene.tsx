"use client";

import Image from "next/image";
import { memo } from "react";

interface BackgroundSceneProps {
  atmosphere?: "normal" | "rain" | "night";
}

function BackgroundScene({
  atmosphere = "normal",
}: BackgroundSceneProps) {
  return (
    <div
      className="fixed inset-0 z-0"
      role="img"
      aria-label="A cozy vintage room with a vinyl player, radio, tea, and rain-streaked window"
    >
      {/* Desktop Background */}
      <div className="hidden md:block absolute inset-0">
        <Image
          src="/bg/desktop.png"
          alt=""
          fill
          priority
          quality={90}
          sizes="(min-width: 768px) 100vw, 0px"
          style={{ objectFit: "cover", objectPosition: "center center" }}
          aria-hidden="true"
        />
      </div>

      {/* Mobile Background */}
      <div className="block md:hidden absolute inset-0">
        <Image
          src="/bg/mobile.png"
          alt=""
          fill
          priority
          quality={85}
          sizes="(max-width: 767px) 100vw, 0px"
          style={{ objectFit: "cover", objectPosition: "center top" }}
          aria-hidden="true"
        />
      </div>

      {/* Base warm overlay — darkens without washing out the scene */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,6,2,0.35) 0%, rgba(10,6,2,0.1) 40%, rgba(10,6,2,0.55) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Left vignette — safe space for header/UI */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(10,6,2,0.5) 0%, transparent 40%)",
        }}
        aria-hidden="true"
      />

      {/* Top vignette — for header */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,6,2,0.6) 0%, transparent 20%)",
        }}
        aria-hidden="true"
      />

      {/* Night tint — applied when atmosphere is night */}
      {atmosphere === "night" && (
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ background: "rgba(4, 10, 30, 0.4)" }}
          aria-hidden="true"
        />
      )}

      {/* Rain tint — applied when atmosphere is rain */}
      {atmosphere === "rain" && (
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ background: "rgba(20, 30, 45, 0.3)" }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export default memo(BackgroundScene);
