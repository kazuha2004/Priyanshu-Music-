"use client";

import { useEffect } from "react";
import { STATIONS, getSongsForStation, type Station } from "@/data/songs";

interface StationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentStation: Station | null;
  onSelectStation: (station: Station) => void;
}

export default function StationDrawer({
  isOpen,
  onClose,
  currentStation,
  onSelectStation,
}: StationDrawerProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`drawer-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`drawer-panel stations-drawer ${isOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Station Selector"
      >
        {/* Header */}
        <div
          className="drawer-header flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(139,94,60,0.2)" }}
        >
          <div>
            <h2
              className="font-display"
              style={{
                fontSize: "22px",
                fontStyle: "italic",
                color: "var(--cream)",
                fontWeight: 400,
              }}
            >
              Stations
            </h2>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: 2 }}>
              Choose your mood
            </p>
          </div>
          <button
            className="btn-icon"
            onClick={onClose}
            aria-label="Close stations"
            style={{ fontSize: 20 }}
          >
            ✕
          </button>
        </div>

        {/* Station grid */}
        <div
          className="station-grid flex-1 overflow-y-auto p-5"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", alignContent: "start" }}
          role="list"
          aria-label="Available stations"
        >
          {STATIONS.map((station) => {
            const songCount = getSongsForStation(station).length;
            const isActive = currentStation?.id === station.id;
            return (
              <button
                key={station.id}
                className={`station-card ${isActive ? "active" : ""}`}
                onClick={() => {
                  onSelectStation(station);
                  onClose();
                }}
                role="listitem"
                aria-label={`${station.name} station — ${songCount} songs`}
                aria-pressed={isActive}
              >
                <span
                  style={{ fontSize: "28px", lineHeight: 1, marginBottom: 4 }}
                  aria-hidden="true"
                >
                  {station.emoji}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "16px",
                    fontStyle: "italic",
                    color: isActive ? "var(--amber)" : "var(--cream)",
                    fontWeight: 400,
                    lineHeight: 1.2,
                  }}
                >
                  {station.name}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    lineHeight: 1.4,
                    textAlign: "left",
                    marginTop: 2,
                  }}
                >
                  {station.description}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    color: "var(--text-muted)",
                    marginTop: 6,
                    letterSpacing: "0.06em",
                    opacity: 0.7,
                  }}
                >
                  {songCount} track{songCount !== 1 ? "s" : ""}
                </span>
              </button>
            );
          })}
        </div>

        {/* All Stations option */}
        <div className="px-5 pb-4 safe-bottom" style={{ borderTop: "1px solid rgba(139,94,60,0.12)", paddingTop: 16 }}>
          <button
            className="btn-ghost"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={() => {
              onSelectStation(null as unknown as Station);
              onClose();
            }}
            aria-label="Show all songs"
          >
            ✦ All Songs
          </button>
        </div>
      </div>
    </>
  );
}
