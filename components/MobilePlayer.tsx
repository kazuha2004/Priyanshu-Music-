"use client";

import { useRef, useCallback } from "react";
import { formatTime } from "@/lib/youtube";
import type { Song } from "@/data/songs";

interface MobilePlayerProps {
  song: Song | null;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (t: number) => void;
  playerReady: boolean;
  error: boolean;
  onOpenLibrary: () => void;
  frequency: number;
  frequencies: readonly number[];
  onTune: (frequency: number) => void;
}

const IconPrev = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
  </svg>
);
const IconNext = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
  </svg>
);
const IconPlay = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const IconPause = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);
const IconLoading = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin-vinyl 1s linear infinite" }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default function MobilePlayer({
  song,
  isPlaying,
  isBuffering,
  currentTime,
  duration,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onSeek,
  playerReady,
  error,
  onOpenLibrary,
  frequency,
  frequencies,
  onTune,
}: MobilePlayerProps) {
  const progressRef = useRef<HTMLDivElement>(null);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || duration <= 0) return;
      const rect = progressRef.current.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      onSeek(pct * duration);
    },
    [duration, onSeek]
  );

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!song && !error) return null;

  const frequencyRuler = (
    <div className="mobile-frequency-scale mobile-frequency-ruler md:hidden" aria-label="FM frequency scale">
      {frequencies.map((item) => (
        <button
          key={item}
          type="button"
          className={item === frequency ? "active" : ""}
          onClick={() => onTune(item)}
        >
          <span>{item.toFixed(1)}</span>
          <i />
        </button>
      ))}
    </div>
  );

  return (
    <>
      {frequencyRuler}
      <div
      className="mobile-player fixed bottom-0 left-0 right-0 z-20 md:hidden safe-bottom"
      style={{
        background: "rgba(16, 10, 6, 0.93)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(139, 94, 60, 0.25)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.5)",
      }}
      role="region"
      aria-label="Music player"
    >
      {/* Progress bar at top edge */}
      <div
        ref={progressRef}
        onClick={handleProgressClick}
        style={{
          height: 2,
          background: "rgba(255,255,255,0.08)",
          cursor: "pointer",
          position: "relative",
        }}
        role="slider"
        aria-label="Song progress"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${progress}%`,
            background: "var(--amber)",
            transition: "width 0.25s linear",
          }}
        />
      </div>

      {/* Main row */}
      <div
        className="flex items-center gap-3 px-4"
        style={{ height: "var(--player-height-mobile)" }}
      >
        {/* Artwork placeholder / vinyl */}
        <button
          onClick={onOpenLibrary}
          aria-label="Open song library"
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "radial-gradient(circle, #3a2e24, #0e0b08)",
            border: "1px solid rgba(139,94,60,0.3)",
            flexShrink: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            animation: isPlaying ? "spin-vinyl 2.5s linear infinite" : "none",
          }}
        >
          {song?.artwork ? (
            <img
              src={song.artwork}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", opacity: 0.7 }}
            />
          ) : (
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "var(--amber)",
                opacity: 0.6,
              }}
            />
          )}
        </button>

        {/* Song info */}
        <div className="flex-1 min-w-0">
          {error ? (
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Unavailable
            </p>
          ) : (
            <>
              <p
                className="truncate-1"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "14px",
                  fontStyle: "italic",
                  color: "var(--cream)",
                  fontWeight: 400,
                  lineHeight: 1.2,
                  marginBottom: "2px",
                }}
              >
                {song?.title}
              </p>
              <p
                className="truncate-1"
                style={{ fontSize: "11px", color: "var(--text-secondary)" }}
              >
                {song?.artist}
              </p>
            </>
          )}
        </div>

        <div className="mobile-frequency-readout" aria-label={`Currently tuned to ${frequency.toFixed(1)} FM`}>
          <span>{frequency.toFixed(1)} FM</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-0">
          <button
            className="btn-icon"
            onClick={onPrev}
            aria-label="Previous song"
            disabled={!playerReady}
            style={{ width: 40, height: 40 }}
          >
            <IconPrev />
          </button>

          <button
            className="mobile-play-button"
            aria-label={isPlaying ? "Pause" : "Play"}
            onClick={isPlaying ? onPause : onPlay}
            disabled={!playerReady || error || isBuffering}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "1.5px solid var(--amber)",
              background: "transparent",
              color: "var(--amber)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: (!playerReady || error || isBuffering) ? "not-allowed" : "pointer",
              opacity: (!playerReady || error) ? 0.4 : (isBuffering ? 0.7 : 1),
              transition: "background 0.15s",
              flexShrink: 0,
            }}
          >
            {isBuffering ? <IconLoading /> : isPlaying ? <IconPause /> : <IconPlay />}
          </button>

          <button
            className="btn-icon"
            onClick={onNext}
            aria-label="Next song"
            disabled={!playerReady}
            style={{ width: 40, height: 40 }}
          >
            <IconNext />
          </button>
        </div>
      </div>
      </div>
    </>
  );
}
