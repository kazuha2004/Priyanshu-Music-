"use client";

interface StartListeningOverlayProps {
  onStart: () => void;
}

export default function StartListeningOverlay({
  onStart,
}: StartListeningOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-30 flex flex-col items-center justify-center"
      style={{ background: "rgba(10, 6, 2, 0.5)" }}
    >
      {/* Branding */}
      <div className="text-center px-6 max-w-lg">
        {/* Station identifier */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            style={{
              width: 40,
              height: 2,
              background: "linear-gradient(to right, transparent, var(--amber))",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--amber)",
              fontWeight: 500,
            }}
          >
            FM 96.6
          </span>
          <div
            style={{
              width: 40,
              height: 2,
              background: "linear-gradient(to left, transparent, var(--amber))",
            }}
          />
        </div>

        {/* Station name */}
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(3rem, 10vw, 5.5rem)",
            fontWeight: 400,
            fontStyle: "italic",
            color: "var(--cream)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            marginBottom: "0.5rem",
            textShadow: "0 2px 20px rgba(10,6,2,0.8)",
          }}
        >
          Soulstation
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.8rem, 2vw, 1rem)",
            color: "var(--text-secondary)",
            letterSpacing: "0.12em",
            marginBottom: "3.5rem",
            fontWeight: 300,
          }}
        >
          a room with music always playing
        </p>

        {/* CTA */}
        <button
          onClick={onStart}
          aria-label="Start listening — initialize music playback"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--charcoal)",
            background: "var(--amber)",
            border: "none",
            padding: "14px 36px",
            borderRadius: "2px",
            cursor: "pointer",
            transition: "background 0.2s, transform 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--muted-gold)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--amber)";
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform =
              "scale(0.97)";
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
        >
          Turn On The Radio
        </button>

        {/* Sub-hint */}
        <p
          style={{
            marginTop: "2.5rem",
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            color: "var(--text-muted)",
            letterSpacing: "0.05em",
          }}
        >
          indie · lo-fi · cinematic · carefully chosen
        </p>
      </div>
    </div>
  );
}
