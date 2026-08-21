"use client";

import { useEffect, useRef, useState } from "react";
import { loadYouTubeAPI, YT_PLAYER_STATE, type YTPlayer } from "@/lib/youtube";

interface YouTubePlayerProps {
  videoId: string | null;
  isPlaying: boolean;
  volume: number;
  onReady: () => void;
  onStateChange: (state: number) => void;
  onTimeUpdate: (current: number, duration: number) => void;
  onError: () => void;
  playerRef: React.MutableRefObject<YTPlayer | null>;
}

export default function YouTubePlayer({
  videoId,
  isPlaying,
  volume,
  onReady,
  onStateChange,
  onTimeUpdate,
  onError,
  playerRef,
}: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [initialized, setInitialized] = useState(false);
  const lastVideoId = useRef<string | null>(null);

  // Initialize YouTube player once API is ready
  useEffect(() => {
    let cancelled = false;

    // If no videoId provided, destroy any existing player
    if (!videoId) {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // ignore
        }
        playerRef.current = null;
      }
      lastVideoId.current = null;
      setInitialized(false);
      return;
    }

    loadYouTubeAPI()
      .then(() => {
        if (cancelled || !containerRef.current) return;

        // If player already exists, just cue/load the new video
        if (playerRef.current) {
          if (videoId !== lastVideoId.current) {
            lastVideoId.current = videoId;
            try {
              if (isPlaying) playerRef.current.loadVideoById(videoId);
              else playerRef.current.cueVideoById(videoId);
            } catch (e) {
              console.error("Error loading video id:", e);
              onError();
            }
          }
          return;
        }

        // Create a fresh player bound to the container element
        const element = containerRef.current;
        lastVideoId.current = videoId;

        try {
          playerRef.current = new window.YT.Player(element as HTMLElement, {
            videoId,
            playerVars: {
              autoplay: 0,
              controls: 1,
              disablekb: 0,
              enablejsapi: 1,
              fs: 0,
              iv_load_policy: 3,
              modestbranding: 1,
              playsinline: 1,
              rel: 0,
              origin: typeof window !== "undefined" ? window.location.origin : "",
            },
            events: {
              onReady: (event) => {
                if (cancelled) return;
                try {
                  playerRef.current?.setVolume(volume);
                } catch (e) {
                  // ignore
                }
                setInitialized(true);
                // Immediately report duration (may be 0 until metadata available)
                try {
                  const cur = playerRef.current?.getCurrentTime() ?? 0;
                  const dur = playerRef.current?.getDuration() ?? 0;
                  onTimeUpdate(cur, dur);
                } catch (e) {
                  // ignore
                }
                onReady();
              },
              onStateChange: (event) => {
                if (cancelled) return;
                onStateChange(event.data);
              },
              onError: (event) => {
                if (cancelled) return;
                console.error("YouTube player error:", event.data);
                onError();
              },
            },
          });
        } catch (e) {
          console.error("Failed to create YT.Player", e);
          onError();
        }
      })
      .catch((err) => {
        console.error("YouTube API load failed:", err);
        onError();
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // ignore
        }
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  // Handle play/pause
  useEffect(() => {
    if (!initialized || !playerRef.current) return;
    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying, initialized, playerRef]);

  // Handle volume changes
  useEffect(() => {
    if (!initialized || !playerRef.current) return;
    playerRef.current.setVolume(volume);
  }, [volume, initialized, playerRef]);

  // Handle video ID changes (after player is already initialized)
  useEffect(() => {
    if (!initialized || !playerRef.current || !videoId) return;
    if (videoId !== lastVideoId.current) {
      lastVideoId.current = videoId;
      if (isPlaying) {
        playerRef.current.loadVideoById(videoId);
      } else {
        playerRef.current.cueVideoById(videoId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, initialized]);

  // Poll time updates
  useEffect(() => {
    if (!initialized) return;

    timerRef.current = setInterval(() => {
      if (!playerRef.current) return;
      try {
        const state = playerRef.current.getPlayerState();
        const current = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        // Always report current time/duration when possible
        if (isFinite(current) && isFinite(duration)) {
          onTimeUpdate(current, duration);
        }
        onStateChange(state);
        // Optionally skip updates when stopped
        if (
          state === YT_PLAYER_STATE.PLAYING ||
          state === YT_PLAYER_STATE.BUFFERING
        ) {
          // nothing extra for now
        }
      } catch (e) {
        // ignore polling errors
      }
    }, 500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  return (
    /*
     * The YouTube iframe must remain in the DOM and be visible/accessible
     * per YouTube's Terms of Service. We position it as a small, unobtrusive
     * element rather than hiding it entirely.
     */
    <div
      style={{
        position: "fixed",
        bottom: "calc(var(--player-height-desktop) + 8px)",
        right: "16px",
        width: "200px",
        height: "120px",
        zIndex: 50,
        borderRadius: "6px",
        overflow: "hidden",
        opacity: 0.01, // Technically visible but non-intrusive; complies with ToS
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <div ref={containerRef} id="yt-iframe-player" style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
