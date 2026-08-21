"use client";

import { useRef, useCallback } from "react";
import { formatTime, type YTPlayer } from "@/lib/youtube";
import type { Song } from "@/data/songs";

interface MusicPlayerProps {
  song: Song | null;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playerRef: React.MutableRefObject<YTPlayer | null>;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onVolumeChange: (v: number) => void;
  onSeek: (t: number) => void;
  playerReady: boolean;
  error: boolean;
  frequency: number;
  frequencies: readonly number[];
  onTune: (frequency: number) => void;
}

// Inline SVG icons to avoid dependencies
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
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const IconPause = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);
const IconVolume = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
  </svg>
);
const IconLoading = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin-vinyl 1s linear infinite" }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default function MusicPlayer({
  song,
  isPlaying,
  isBuffering,
  currentTime,
  duration,
  volume,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onVolumeChange,
  onSeek,
  playerRef,
  playerReady,
  error,
  frequency,
  frequencies,
  onTune,
}: MusicPlayerProps) {
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

  const frequencyIndex = Math.max(0, frequencies.indexOf(frequency));

  return (
    <div
      className="fixed left-1/2 z-20 hidden md:flex"
      style={{
        bottom: "22px",
        transform: "translateX(-50%)",
        width: "min(860px, calc(100vw - 72px))",
        padding: "0 8px",
        flexDirection: "column",
      }}
      role="region"
      aria-label="FM radio tuner"
    >
      <div className="radio-frequency-scale" aria-label="FM frequency scale">
        {frequencies.map((item) => (
          <button key={item} type="button" onClick={() => onTune(item)} className={item === frequency ? "active" : ""}>
            <b>{item.toFixed(1)}</b>
            <i />
          </button>
        ))}
      </div>

      <div className="radio-console">
        <div className="radio-console-status">
          <span className="radio-signal" aria-hidden="true" />
          <span>{isPlaying ? "ON AIR" : "STANDBY"}</span>
          <small>FM / EVENING RADIO</small>
        </div>

        <div className="radio-now-playing">
          <span className="radio-now-label">NOW PLAYING</span>
          <strong>{error ? "Signal unavailable" : song?.title}</strong>
          <small>{song?.artist || "Tune in to begin"}</small>
        </div>

        <div className="radio-tuner" aria-label={`Tune radio, currently ${frequency.toFixed(1)} FM`}>
          <div className="radio-knob">
            <span />
            <input
              className="radio-tune-input"
              type="range"
              min={0}
              max={frequencies.length - 1}
              step={1}
              value={frequencyIndex}
              onChange={(event) => onTune(frequencies[Number(event.target.value)])}
              aria-label="Tune frequency"
            />
          </div>
          <small>TUNE</small>
        </div>

        <div className="radio-frequency-readout">
          <strong>{frequency.toFixed(1)}</strong>
          <span>FM</span>
          <small>सुनते रहो</small>
        </div>

        <div className="radio-controls">
          <button className="btn-icon" onClick={onPrev} aria-label="Previous song" disabled={!playerReady}>
            <IconPrev />
          </button>
          <button
            className="btn-play"
            onClick={isPlaying ? onPause : onPlay}
            aria-label={isPlaying ? "Pause radio" : "Play radio"}
            disabled={!playerReady || error || isBuffering}
            style={{ opacity: (!playerReady || error) ? 0.4 : (isBuffering ? 0.7 : 1) }}
          >
            {isBuffering ? <IconLoading /> : isPlaying ? <IconPause /> : <IconPlay />}
          </button>
          <button className="btn-icon" onClick={onNext} aria-label="Next song" disabled={!playerReady}>
            <IconNext />
          </button>
        </div>
      </div>

      <div className="radio-progress-row">
        <span>{formatTime(currentTime)}</span>
        <div
          ref={progressRef}
          className="progress-track flex-1"
          onClick={handleProgressClick}
          role="slider"
          aria-label="Song progress"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onKeyDown={(e) => {
            if (!duration) return;
            if (e.key === "ArrowRight") onSeek(Math.min(currentTime + 10, duration));
            if (e.key === "ArrowLeft") onSeek(Math.max(currentTime - 10, 0));
          }}
        >
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span>{formatTime(duration)}</span>
        <div className="radio-volume" title={`Volume ${volume}%`}>
          <IconVolume />
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            aria-label={`Volume: ${volume}%`}
          />
        </div>
      </div>
    </div>
  );
}
