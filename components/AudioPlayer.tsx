"use client";

import { useCallback, useEffect, useRef } from "react";

export interface AudioPlayerHandle {
  play: () => Promise<void>;
  pause: () => void;
  seekTo: (seconds: number) => void;
}

interface AudioPlayerProps {
  audioUrl: string;
  isPlaying: boolean;
  volume: number;
  onReady: () => void;
  onPlaying: () => void;
  onPause: () => void;
  onWaiting: () => void;
  onEnded: () => void;
  onTimeUpdate: (current: number, duration: number) => void;
  onError: () => void;
  playerRef: React.MutableRefObject<AudioPlayerHandle | null>;
}

export default function AudioPlayer({
  audioUrl,
  isPlaying,
  volume,
  onReady,
  onPlaying,
  onPause,
  onWaiting,
  onEnded,
  onTimeUpdate,
  onError,
  playerRef,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const endedUrlRef = useRef<string | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const sourceChangingRef = useRef(false);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    playerRef.current = {
      play: () => audio.play(),
      pause: () => audio.pause(),
      seekTo: (seconds) => {
        audio.currentTime = Math.max(0, Math.min(seconds, audio.duration || seconds));
      },
    };

    return () => {
      playerRef.current = null;
    };
  }, [playerRef]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    endedUrlRef.current = null;
    retryCountRef.current = 0;
    sourceChangingRef.current = true;
    audio.load();
    if (isPlayingRef.current) {
      audio.play().catch(() => undefined).finally(() => {
        sourceChangingRef.current = false;
      });
    } else {
      sourceChangingRef.current = false;
    }
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume / 100;
    if (isPlaying) {
      audio.play().catch(() => onPause());
    } else {
      audio.pause();
    }
  }, [isPlaying, onPause, volume]);

  const handleEnded = () => {
    if (endedUrlRef.current === audioUrl) return;
    endedUrlRef.current = audioUrl;
    onEnded();
  };

  const handleAudioError = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (retryCountRef.current < 3) {
      retryCountRef.current += 1;
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      retryTimerRef.current = setTimeout(() => {
        audio.load();
        if (isPlayingRef.current) audio.play().catch(() => undefined);
      }, retryCountRef.current * 750);
      return;
    }

    onError();
  }, [onError]);

  return (
    <audio
      ref={audioRef}
      src={audioUrl}
      preload="auto"
      onCanPlay={onReady}
      onPlaying={onPlaying}
      onPause={() => {
        if (!sourceChangingRef.current) onPause();
      }}
      onWaiting={onWaiting}
      onEnded={handleEnded}
      onTimeUpdate={(event) => {
        const audio = event.currentTarget;
        onTimeUpdate(audio.currentTime, audio.duration || 0);
      }}
      onError={handleAudioError}
      style={{ position: "fixed", width: 1, height: 1, opacity: 0.01 }}
      aria-label="Soulstation audio"
    />
  );
}
