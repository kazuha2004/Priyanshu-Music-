"use client";

import { useEffect } from "react";

interface AboutPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutPanel({ isOpen, onClose }: AboutPanelProps) {
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
        className={`drawer-panel about-drawer ${isOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="About Soulstation"
        style={{ maxWidth: 380 }}
      >
        {/* Header */}
        <div
          className="drawer-header flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(139,94,60,0.2)" }}
        >
          <h2
            className="font-display"
            style={{
              fontSize: "22px",
              fontStyle: "italic",
              color: "var(--cream)",
              fontWeight: 400,
            }}
          >
            About
          </h2>
          <button
            className="btn-icon"
            onClick={onClose}
            aria-label="Close about panel"
            style={{ fontSize: 20 }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="about-content flex-1 overflow-y-auto px-5 py-6">
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

            {/* Station logo */}
            <div style={{ textAlign: "center", marginBottom: 4 }}>
              <p
                className="font-display"
                style={{
                  fontSize: "42px",
                  fontStyle: "italic",
                  color: "var(--cream)",
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                Soulstation
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: "var(--amber)",
                  letterSpacing: "0.2em",
                  marginTop: 8,
                }}
              >
                FM 94.5
              </p>
            </div>

            <section>
              <h3
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--amber)",
                  marginBottom: 10,
                }}
              >
                What is this?
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                Soulstation is an atmospheric internet radio experience — not a
                music app. It&apos;s a room that happens to have music playing,
                all day, all night.
              </p>
            </section>

            <section>
              <h3
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--amber)",
                  marginBottom: 10,
                }}
              >
                The feeling
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                Like settling into your favourite chair on a rainy evening. Like
                a cassette tape you found in a jacket pocket. Like a café you
                never want to leave.
              </p>
            </section>

            <section>
              <h3
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--amber)",
                  marginBottom: 10,
                }}
              >
                Music
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                Carefully selected indie, lo-fi, and cinematic tracks. Tune into
                a station — Rain, Night, Long Drive, Love, Heartbreak, or Indie
                — or browse the full library.
              </p>
            </section>

            <section
              style={{
                padding: "16px",
                background: "rgba(139,94,60,0.08)",
                border: "1px solid rgba(139,94,60,0.2)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--muted-gold)",
                  marginBottom: 8,
                }}
              >
                Copyright Notice
              </h3>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  lineHeight: 1.7,
                }}
              >
                Soulstation does not host, store, or distribute any copyrighted
                music recordings. All audio is streamed directly from YouTube
                via the official YouTube IFrame Player API, in compliance with
                YouTube&apos;s Terms of Service. All music rights belong to
                their respective artists, labels, and publishers.
              </p>
            </section>

          </div>
        </div>

        <div
          className="px-5 py-4 safe-bottom"
          style={{
            borderTop: "1px solid rgba(139,94,60,0.12)",
            fontSize: "11px",
            color: "var(--text-muted)",
          }}
        >
          Built with care. &copy; {new Date().getFullYear()} Soulstation.
        </div>
      </div>
    </>
  );
}
