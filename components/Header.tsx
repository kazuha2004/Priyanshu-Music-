"use client";

import { useState, useEffect } from "react";

interface HeaderProps {
  onOpenLibrary: () => void;
  onOpenStations: () => void;
  onOpenAbout: () => void;
  isPlaying: boolean;
  currentStation: { name: string; emoji: string } | null;
  listenerCount: number;
}

function LocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, []);
  return (
    <span
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "12px",
        letterSpacing: "0.1em",
        color: "var(--text-muted)",
        fontWeight: 400,
      }}
    >
      {time}
    </span>
  );
}

export default function Header({
  onOpenLibrary,
  onOpenStations,
  onOpenAbout,
  isPlaying,
  currentStation,
  listenerCount,
}: HeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-20 safe-top"
      style={{ height: "var(--header-height)" }}
    >
      {/* Desktop header */}
      <div
        className="hidden md:flex items-center justify-between h-full px-6"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,6,2,0.7) 0%, transparent 100%)",
        }}
      >
        {/* Left — time */}
        <div className="flex items-center gap-4" style={{ minWidth: 140, paddingLeft: 12 }}>
          <LocalTime />
        </div>

        {/* Center — live indicator + station */}
        <div className="flex items-center gap-3">
          <div className="live-pill">
            <div
              className="live-dot"
              style={{
                animation: isPlaying
                  ? "warm-flicker 1.5s ease-in-out infinite"
                  : "none",
                background: isPlaying ? "var(--rust)" : "var(--text-muted)",
              }}
            />
            <span>{isPlaying ? `${listenerCount} LISTENING` : "RADIO OFFLINE"}</span>
          </div>
          {currentStation && (
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                letterSpacing: "0.1em",
                color: "var(--text-muted)",
              }}
            >
              {currentStation.emoji} {currentStation.name.toUpperCase()}
            </span>
          )}
        </div>

        {/* Right — nav */}
        <nav
          className="flex items-center gap-1"
          aria-label="Site navigation"
          style={{ minWidth: 120, justifyContent: "flex-end" }}
        >
          <button
            className="btn-ghost"
            onClick={onOpenLibrary}
            aria-label="Open song library"
          >
            Songs
          </button>
          <button
            className="btn-ghost"
            onClick={onOpenStations}
            aria-label="Open station selector"
          >
            Stations
          </button>
          <button
            className="btn-ghost"
            onClick={onOpenAbout}
            aria-label="About Soulstation"
          >
            About
          </button>
        </nav>
      </div>

      {/* Mobile header */}
      <div
        className="mobile-header flex md:hidden items-center justify-between h-full px-4"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,6,2,0.75) 0%, transparent 100%)",
        }}
      >
        <div className="mobile-time">
          <LocalTime />
        </div>

        {/* Branding */}
        <div
          className="font-display"
          style={{
            fontSize: "20px",
            fontStyle: "italic",
            color: "var(--cream)",
            fontWeight: 400,
            letterSpacing: "-0.01em",
          }}
        >
          Soulstation
        </div>

        <div
          className="mobile-live-status live-pill"
          aria-label={isPlaying ? `${listenerCount} listeners active` : "Radio offline"}
        >
          <div
            className="live-dot"
            style={{
              animation: isPlaying
                ? "warm-flicker 1.5s ease-in-out infinite"
                : "none",
              background: isPlaying ? "var(--rust)" : "var(--text-muted)",
            }}
          />
          <span>{isPlaying ? listenerCount : "OFF"}</span>
        </div>

        {/* Mobile menu */}
        <div className="flex items-center gap-1">
          <button
            className="btn-ghost"
            style={{ padding: "6px 10px", fontSize: "11px" }}
            onClick={onOpenLibrary}
            aria-label="Open song library"
          >
            Songs
          </button>
          <button
            className="btn-ghost"
            style={{ padding: "6px 10px", fontSize: "11px" }}
            onClick={onOpenStations}
            aria-label="Open stations"
          >
            Stations
          </button>
        </div>
      </div>
    </header>
  );
}
