/**
 * YouTube IFrame Player API — types, loader, and helpers
 * Uses the official YouTube IFrame API (no audio scraping or downloading)
 */

export const YT_PLAYER_STATE = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const;

export type YTPlayerState = (typeof YT_PLAYER_STATE)[keyof typeof YT_PLAYER_STATE];

export interface YTPlayerOptions {
  videoId: string;
  playerVars?: {
    autoplay?: 0 | 1;
    controls?: 0 | 1;
    disablekb?: 0 | 1;
    enablejsapi?: 0 | 1;
    fs?: 0 | 1;
    iv_load_policy?: 1 | 3;
    modestbranding?: 0 | 1;
    playsinline?: 0 | 1;
    rel?: 0 | 1;
    origin?: string;
  };
  events?: {
    onReady?: (event: YTPlayerEvent) => void;
    onStateChange?: (event: YTPlayerStateChangeEvent) => void;
    onError?: (event: YTPlayerErrorEvent) => void;
  };
}

export interface YTPlayerEvent {
  target: YTPlayer;
}

export interface YTPlayerStateChangeEvent {
  target: YTPlayer;
  data: YTPlayerState;
}

export interface YTPlayerErrorEvent {
  target: YTPlayer;
  data: number;
}

export interface YTPlayer {
  loadVideoById(videoId: string, startSeconds?: number): void;
  cueVideoById(videoId: string, startSeconds?: number): void;
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  setVolume(volume: number): void;
  getVolume(): number;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): YTPlayerState;
  getVideoUrl(): string;
  destroy(): void;
}

declare global {
  interface Window {
    YT: {
      Player: new (element: string | HTMLElement, options: YTPlayerOptions) => YTPlayer;
      PlayerState: typeof YT_PLAYER_STATE;
    };
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

let apiLoaded = false;
let apiLoading = false;
const readyResolveCallbacks: (() => void)[] = [];
const readyRejectCallbacks: ((err: Error) => void)[] = [];

/**
 * Load the YouTube IFrame Player API script.
 * Safe to call multiple times — only loads once.
 */
export function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (apiLoaded) {
      resolve();
      return;
    }

    readyResolveCallbacks.push(resolve);
    readyRejectCallbacks.push(reject);

    if (apiLoading) return;
    apiLoading = true;

    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      apiLoaded = true;
      apiLoading = false;
      if (prevReady) prevReady();
      readyResolveCallbacks.forEach((cb) => cb());
      readyResolveCallbacks.length = 0;
      readyRejectCallbacks.length = 0;
    };

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      apiLoading = false;
      const err = new Error("Failed to load YouTube IFrame API");
      readyRejectCallbacks.forEach((cb) => cb(err));
      readyResolveCallbacks.length = 0;
      readyRejectCallbacks.length = 0;
    };
    document.head.appendChild(script);

    // Safety: reject if API doesn't call ready within 15s
    setTimeout(() => {
      if (!apiLoaded && apiLoading) {
        apiLoading = false;
        const err = new Error("YouTube IFrame API load timeout");
        readyRejectCallbacks.forEach((cb) => cb(err));
        readyResolveCallbacks.length = 0;
        readyRejectCallbacks.length = 0;
      }
    }, 15000);
  });
}

/** Format seconds as MM:SS */
export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
