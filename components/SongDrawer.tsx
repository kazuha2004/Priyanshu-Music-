"use client";

import { useState, useEffect, useRef } from "react";
import { SONGS, STATIONS, searchSongs, type Song, type Station } from "@/data/songs";

interface SongDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: Song | null;
  currentStation: Station | null;
  onSelectSong: (song: Song) => void;
}

export default function SongDrawer({
  isOpen,
  onClose,
  currentSong,
  currentStation,
  onSelectSong,
}: SongDrawerProps) {
  const [query, setQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Collect all unique moods
  const allMoods = Array.from(
    new Set(SONGS.flatMap((s) => s.mood ?? []))
  ).sort();

  // Filter songs
  let displaySongs = query ? searchSongs(query) : SONGS;
  if (selectedMood) {
    displaySongs = displaySongs.filter((s) => s.mood?.includes(selectedMood));
  }
  if (!query && !selectedMood && currentStation) {
    // Default: show station songs first
    const stationSongs = displaySongs.filter((s) =>
      s.category?.some((c) => currentStation.categories.includes(c))
    );
    const rest = displaySongs.filter(
      (s) => !s.category?.some((c) => currentStation.categories.includes(c))
    );
    displaySongs = [...stationSongs, ...rest];
  }

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 350);
    } else {
      setQuery("");
      setSelectedMood(null);
    }
  }, [isOpen]);

  // Keyboard: Escape closes
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`drawer-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`drawer-panel library-drawer ${isOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Song Library"
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
              Library
            </h2>
            <p
              style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: 2 }}
            >
              {displaySongs.length} track{displaySongs.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            className="btn-icon"
            onClick={onClose}
            aria-label="Close library"
            style={{ fontSize: 20 }}
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3" style={{ borderBottom: "1px solid rgba(139,94,60,0.12)" }}>
          <input
            ref={inputRef}
            type="search"
            placeholder="Search songs, artists, albums…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search songs"
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(139,94,60,0.25)",
              borderRadius: "var(--radius-sm)",
              padding: "9px 14px",
              fontSize: "13px",
              color: "var(--text-primary)",
              fontFamily: "var(--font-body)",
              outline: "none",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(139,94,60,0.25)";
            }}
          />
        </div>

        {/* Mood filter pills */}
        <div
          className="flex gap-2 px-5 py-3 overflow-x-auto"
          style={{
            borderBottom: "1px solid rgba(139,94,60,0.12)",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          aria-label="Filter by mood"
        >
          <button
            onClick={() => setSelectedMood(null)}
            style={{
              flexShrink: 0,
              padding: "4px 12px",
              borderRadius: 20,
              border: `1px solid ${!selectedMood ? "rgba(201,168,76,0.5)" : "rgba(139,94,60,0.25)"}`,
              background: !selectedMood
                ? "rgba(201,168,76,0.1)"
                : "transparent",
              fontSize: "11px",
              color: !selectedMood ? "var(--amber)" : "var(--text-muted)",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontFamily: "var(--font-body)",
              letterSpacing: "0.05em",
            }}
          >
            All
          </button>
          {allMoods.map((mood) => (
            <button
              key={mood}
              onClick={() =>
                setSelectedMood((prev) => (prev === mood ? null : mood))
              }
              style={{
                flexShrink: 0,
                padding: "4px 12px",
                borderRadius: 20,
                border: `1px solid ${selectedMood === mood ? "rgba(201,168,76,0.5)" : "rgba(139,94,60,0.25)"}`,
                background:
                  selectedMood === mood
                    ? "rgba(201,168,76,0.1)"
                    : "transparent",
                fontSize: "11px",
                color:
                  selectedMood === mood ? "var(--amber)" : "var(--text-muted)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: "var(--font-body)",
                textTransform: "capitalize",
                letterSpacing: "0.05em",
              }}
            >
              {mood}
            </button>
          ))}
        </div>

        {/* Song list */}
        <div
          className="library-list flex-1 overflow-y-auto px-3 py-2"
          role="list"
          aria-label="Songs"
        >
          {displaySongs.length === 0 ? (
            <div
              className="flex items-center justify-center"
              style={{ height: 200 }}
            >
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                No songs found
              </p>
            </div>
          ) : (
            displaySongs.map((song) => (
              <SongRow
                key={song.id}
                song={song}
                isActive={currentSong?.id === song.id}
                onSelect={() => {
                  onSelectSong(song);
                }}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-3 safe-bottom"
          style={{ borderTop: "1px solid rgba(139,94,60,0.12)" }}
        >
          <p style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.05em" }}>
            Playback via YouTube. Music belongs to its rightful owners.
          </p>
        </div>
      </div>
    </>
  );
}

function SongRow({
  song,
  isActive,
  onSelect,
}: {
  song: Song;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={`song-card ${isActive ? "active" : ""}`}
      onClick={onSelect}
      role="listitem"
      tabIndex={0}
      aria-label={`Play ${song.title} by ${song.artist ?? "Unknown"}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      {/* Track indicator */}
      <div
        style={{
          width: 3,
          height: 36,
          borderRadius: 2,
          background: isActive ? "var(--amber)" : "rgba(139,94,60,0.2)",
          flexShrink: 0,
          transition: "background 0.2s",
        }}
        aria-hidden="true"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="truncate-1"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "14px",
            fontStyle: "italic",
            color: isActive ? "var(--amber)" : "var(--cream)",
            fontWeight: 400,
            lineHeight: 1.3,
          }}
        >
          {song.title}
        </p>
        <p
          className="truncate-1"
          style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: 1 }}
        >
          {song.artist}
          {song.year && <span> · {song.year}</span>}
        </p>
      </div>

      {/* Mood tags */}
      <div className="flex gap-1" style={{ flexShrink: 0 }}>
        {song.mood?.slice(0, 2).map((m) => (
          <span
            key={m}
            style={{
              fontSize: "9px",
              padding: "2px 7px",
              borderRadius: 10,
              background: "rgba(139,94,60,0.15)",
              color: "var(--text-muted)",
              textTransform: "capitalize",
              letterSpacing: "0.06em",
            }}
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
