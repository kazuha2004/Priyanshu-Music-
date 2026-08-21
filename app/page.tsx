"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

import BackgroundScene from "@/components/BackgroundScene";
import Atmosphere from "@/components/Atmosphere";
import Header from "@/components/Header";
import MusicPlayer from "@/components/MusicPlayer";
import MobilePlayer from "@/components/MobilePlayer";
import SongDrawer from "@/components/SongDrawer";
import StationDrawer from "@/components/StationDrawer";
import AboutPanel from "@/components/AboutPanel";
import Hotspots from "@/components/Hotspots";

import { SONGS, RADIO_FREQUENCIES, getFrequencyQueues, getSongsForStation, type Song, type Station } from "@/data/songs";
import { YT_PLAYER_STATE, type YTPlayer } from "@/lib/youtube";

// Lazy-load the YouTube player (reduces initial JS)
const YouTubePlayer = dynamic(() => import("@/components/YouTubePlayer"), {
  ssr: false,
});

type Atmosphere = "normal" | "rain" | "night";

export default function Home() {
  // ── Player state ──
  const [hasStarted] = useState(true);
  const [frequencyQueues, setFrequencyQueues] = useState<Record<string, Song[]>>(() =>
    Object.fromEntries(
      Object.entries(getFrequencyQueues())
    )
  );
  const [playerReady, setPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(frequencyQueues["96.6"]?.[0] ?? SONGS[0] ?? null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [playerError, setPlayerError] = useState(false);
  const [frequency, setFrequency] = useState<number>(96.6);
  const [listenerCount, setListenerCount] = useState(1);
  const playerRef = useRef<YTPlayer | null>(null);

  // ── Station / atmosphere ──
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [atmosphere, setAtmosphere] = useState<Atmosphere>("normal");

  // ── UI state ──
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isStationDrawerOpen, setIsStationDrawerOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // ── Derive queue from station ──
  const queue = currentStation
    ? getSongsForStation(currentStation)
    : frequencyQueues[String(frequency)] ?? SONGS;
  const currentIndex = currentSong
    ? queue.findIndex((s) => s.id === currentSong.id)
    : -1;

  // ── Actions ──
  const selectSong = useCallback(
    (song: Song | undefined) => {
      if (!song) return;
      if (!song.youtubeId) {
        setPlayerError(true);
        setCurrentSong(song);
        setIsPlaying(false);
        setIsBuffering(false);
        return;
      }
      setPlayerError(false);
      setCurrentSong(song);
      setIsPlaying(true);
      setIsBuffering(true);
    },
    []
  );

  const handleNext = useCallback(() => {
    if (queue.length === 0) return;
    if (currentIndex < queue.length - 1) {
      selectSong(queue[currentIndex + 1]);
      return;
    }

    const currentFrequencyIndex = RADIO_FREQUENCIES.indexOf(
      frequency as (typeof RADIO_FREQUENCIES)[number]
    );
    const nextFrequency = RADIO_FREQUENCIES[
      (currentFrequencyIndex + 1) % RADIO_FREQUENCIES.length
    ];
    const nextQueue = frequencyQueues[String(nextFrequency)] ?? SONGS;
    setCurrentStation(null);
    setFrequency(nextFrequency);
    selectSong(nextQueue[0]);
  }, [currentIndex, frequency, frequencyQueues, queue, selectSong]);

  const handlePrev = useCallback(() => {
    if (queue.length === 0) return;
    // If more than 3s in, restart; otherwise go previous
    if (currentTime > 3 && playerRef.current) {
      playerRef.current.seekTo(0, true);
      return;
    }
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
    selectSong(queue[prevIndex]);
  }, [currentIndex, currentTime, queue, selectSong]);

  const handleSeek = useCallback((t: number) => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(t, true);
    setCurrentTime(t);
  }, []);

  const handleVolumeChange = useCallback((v: number) => {
    setVolume(v);
  }, []);

  const handleTune = useCallback((nextFrequency: number) => {
    setFrequency(nextFrequency);
    setCurrentStation(null);
    const nextQueue = frequencyQueues[String(nextFrequency)] ?? SONGS;
    selectSong(nextQueue[0]);
  }, [frequencyQueues, selectSong]);

  useEffect(() => {
    const shuffledQueues = Object.fromEntries(
      RADIO_FREQUENCIES.map((channelFrequency) => {
        const shuffled = [...getFrequencyQueues()[String(channelFrequency)]];
        for (let index = shuffled.length - 1; index > 0; index -= 1) {
          const swapIndex = Math.floor(Math.random() * (index + 1));
          [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
        }
        return [String(channelFrequency), shuffled];
      })
    );
    setFrequencyQueues(shuffledQueues);
    setCurrentSong(shuffledQueues["96.6"]?.[0] ?? SONGS[0] ?? null);
  }, []);

  const handlePlayerReady = useCallback(() => {
    setPlayerReady(true);
    setIsBuffering(false);
  }, []);

  const handleStateChange = useCallback(
    (state: number) => {
      if (state === YT_PLAYER_STATE.PLAYING) {
        setIsPlaying(true);
        setIsBuffering(false);
      } else if (state === YT_PLAYER_STATE.BUFFERING) {
        setIsBuffering(true);
      } else if (
        state === YT_PLAYER_STATE.PAUSED ||
        state === YT_PLAYER_STATE.ENDED
      ) {
        setIsPlaying(false);
        setIsBuffering(false);
        if (state === YT_PLAYER_STATE.ENDED) {
          // Auto-advance
          handleNext();
        }
      }
    },
    [handleNext]
  );

  useEffect(() => {
    if (!hasStarted) return;
    const channel = typeof BroadcastChannel !== "undefined"
      ? new BroadcastChannel("soulstation-listeners")
      : null;
    const id = `${Date.now()}-${Math.random()}`;
    const peers = new Map<string, number>([[id, Date.now()]]);
    const announce = () => {
      peers.set(id, Date.now());
      channel?.postMessage({ id, at: Date.now() });
      setListenerCount(Math.max(1, peers.size));
    };
    const receive = (event: MessageEvent<{ id?: string; at?: number }>) => {
      if (event.data.id && event.data.at) peers.set(event.data.id, event.data.at);
      setListenerCount(Math.max(1, peers.size));
    };
    channel?.addEventListener("message", receive);
    announce();
    const timer = window.setInterval(() => {
      const cutoff = Date.now() - 15000;
      for (const [peerId, lastSeen] of peers) if (lastSeen < cutoff) peers.delete(peerId);
      announce();
    }, 5000);
    return () => {
      window.clearInterval(timer);
      channel?.close();
    };
  }, [hasStarted]);

  const handleTimeUpdate = useCallback((current: number, dur: number) => {
    setCurrentTime(current);
    setDuration(dur);
  }, []);

  const handlePlayerError = useCallback(() => {
    setPlayerError(true);
    setIsPlaying(false);
    setIsBuffering(false);
  }, []);

  const handleSelectStation = useCallback(
    (station: Station | null) => {
      setCurrentStation(station);
      if (station) {
        const songs = getSongsForStation(station);
        if (songs.length > 0) selectSong(songs[0]);
        // Auto atmosphere
        if (station.id === "rain") setAtmosphere("rain");
        else if (station.id === "night") setAtmosphere("night");
        else setAtmosphere("normal");
      }
    },
    [selectSong]
  );

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
      if (e.code === "ArrowRight" && e.altKey) handleNext();
      if (e.code === "ArrowLeft" && e.altKey) handlePrev();
      if (e.key === "Escape") {
        setIsLibraryOpen(false);
        setIsStationDrawerOpen(false);
        setIsAboutOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleNext, handlePrev]);

  // ── Render ──
  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        background: "var(--charcoal)",
      }}
    >
      {/* Layer 0: Background */}
      <BackgroundScene atmosphere={atmosphere} />

      {/* Layer 1–2: Atmosphere effects */}
      <Atmosphere mode={atmosphere} />

      <div className="mobile-scene-copy" aria-hidden="true">
        <span>FM {frequency.toFixed(1)} · {isPlaying ? "ON AIR" : "EVENING RADIO"}</span>
        <strong>Thoda ruk jao.</strong>
        <small>is room mein gaane bajte rahenge</small>
      </div>

      {/* Layer 3: Hotspots (desktop only) */}
      {hasStarted && (
        <Hotspots
          onOpenLibrary={() => setIsLibraryOpen(true)}
          onOpenStations={() => setIsStationDrawerOpen(true)}
          onSetAtmosphere={setAtmosphere}
          atmosphere={atmosphere}
        />
      )}

      {/* Header */}
      {
        <Header
          onOpenLibrary={() => setIsLibraryOpen(true)}
          onOpenStations={() => setIsStationDrawerOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
          isPlaying={isPlaying}
          currentStation={currentStation}
          listenerCount={listenerCount}
        />
      }

      {/* Layer 6: Desktop music player */}
      {hasStarted && (
        <MusicPlayer
          song={currentSong}
          isPlaying={isPlaying}
          isBuffering={isBuffering}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          playerRef={playerRef}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onNext={handleNext}
          onPrev={handlePrev}
          onVolumeChange={handleVolumeChange}
          onSeek={handleSeek}
          playerReady={playerReady}
          error={playerError}
          frequency={frequency}
          frequencies={RADIO_FREQUENCIES}
          onTune={handleTune}
        />
      )}

      {/* Layer 6: Mobile player */}
      {hasStarted && (
        <MobilePlayer
          song={currentSong}
          isPlaying={isPlaying}
          isBuffering={isBuffering}
          currentTime={currentTime}
          duration={duration}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onNext={handleNext}
          onPrev={handlePrev}
          onSeek={handleSeek}
          playerReady={playerReady}
          error={playerError}
          onOpenLibrary={() => setIsLibraryOpen(true)}
          frequency={frequency}
          frequencies={RADIO_FREQUENCIES}
          onTune={handleTune}
        />
      )}

      {/* Layer 7: YouTube player (hidden but required) */}
      {hasStarted && currentSong?.youtubeId && (
        <YouTubePlayer
          videoId={currentSong.youtubeId}
          isPlaying={isPlaying}
          volume={volume}
          onReady={handlePlayerReady}
          onStateChange={handleStateChange}
          onTimeUpdate={handleTimeUpdate}
          onError={handlePlayerError}
          playerRef={playerRef}
        />
      )}

      {/* Layer 8: Drawers */}
      <SongDrawer
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        currentSong={currentSong}
        currentStation={currentStation}
        onSelectSong={(song) => {
          selectSong(song);
          setIsLibraryOpen(false);
        }}
      />

      <StationDrawer
        isOpen={isStationDrawerOpen}
        onClose={() => setIsStationDrawerOpen(false)}
        currentStation={currentStation}
        onSelectStation={handleSelectStation}
      />

      <AboutPanel
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <div className="creator-credit" aria-label="Made by Priyanshu">
        Made by <strong>Priyanshu</strong>
      </div>
    </main>
  );
}
