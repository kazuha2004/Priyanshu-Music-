"use client";

/**
 * Hotspots — nearly invisible interactive zones over the background artwork.
 *
 * Desktop artwork layout:
 * - Vinyl player: left-center
 * - Tea/coffee mug: center-bottom
 * - Radio: center-right
 * - Lamp: center
 * - Window (rain): top-left
 *
 * Hotspots are expressed as % of viewport width/height.
 * They become visible only on hover/focus — no visible circles or markers on the art.
 */

interface HotspotsProps {
  onOpenLibrary: () => void;
  onOpenStations: () => void;
  onSetAtmosphere: (mode: "normal" | "rain" | "night") => void;
  atmosphere: "normal" | "rain" | "night";
}

interface Hotspot {
  id: string;
  label: string;
  hint: string;
  // Position as % of viewport
  top: string;
  left: string;
  size: number; // px
  onClick: () => void;
  /** Only show on desktop */
  desktopOnly?: boolean;
}

export default function Hotspots({
  onOpenLibrary,
  onOpenStations,
  onSetAtmosphere,
  atmosphere,
}: HotspotsProps) {
  const hotspots: Hotspot[] = [
    {
      id: "vinyl",
      label: "Vinyl Player",
      hint: "Browse Library",
      top: "52%",
      left: "18%",
      size: 56,
      onClick: onOpenLibrary,
      desktopOnly: true,
    },
    {
      id: "radio",
      label: "Radio",
      hint: "Change Station",
      top: "54%",
      left: "57%",
      size: 48,
      onClick: onOpenStations,
      desktopOnly: true,
    },
    {
      id: "tea",
      label: "Tea",
      hint: atmosphere === "rain" ? "Clear Rain" : "Rain Mode",
      top: "70%",
      left: "38%",
      size: 40,
      onClick: () =>
        onSetAtmosphere(atmosphere === "rain" ? "normal" : "rain"),
      desktopOnly: true,
    },
    {
      id: "lamp",
      label: "Lamp",
      hint: atmosphere === "night" ? "Day Mode" : "Night Mode",
      top: "44%",
      left: "44%",
      size: 44,
      onClick: () =>
        onSetAtmosphere(atmosphere === "night" ? "normal" : "night"),
      desktopOnly: true,
    },
    {
      id: "window",
      label: "Window",
      hint: "Rain Sounds",
      top: "25%",
      left: "12%",
      size: 60,
      onClick: () =>
        onSetAtmosphere(atmosphere === "rain" ? "normal" : "rain"),
      desktopOnly: true,
    },
  ];

  return (
    // Only render on desktop — hotspot positions are calibrated to desktop image
    <div
      className="fixed inset-0 hidden md:block"
      style={{ zIndex: 5, pointerEvents: "none" }}
      aria-hidden="true"
    >
      {hotspots.map((spot) => (
        <button
          key={spot.id}
          className="hotspot"
          onClick={spot.onClick}
          aria-label={`${spot.label} — ${spot.hint}`}
          title={spot.hint}
          style={{
            top: spot.top,
            left: spot.left,
            width: spot.size,
            height: spot.size,
            transform: "translate(-50%, -50%)",
            pointerEvents: "all",
          }}
        >
          <span className="hotspot-tooltip">{spot.hint}</span>
        </button>
      ))}
    </div>
  );
}
