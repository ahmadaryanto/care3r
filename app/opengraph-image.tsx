import { ImageResponse } from "next/og";
import { JOBS_FEED_META } from "@/lib/jobs-feed";

export const alt = "care3r: curated Web3 jobs for builders, operators, and crypto-native talent";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const count = JOBS_FEED_META.count;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#f4f4f5",
          fontFamily: "sans-serif",
          background:
            "radial-gradient(ellipse 70% 60% at 12% 0%, rgba(155,109,255,0.35), transparent 60%), radial-gradient(ellipse 50% 50% at 95% 10%, rgba(232,160,74,0.12), transparent 60%), #050308",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #9b6dff, #c9a8ff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            C
          </div>
          <div style={{ display: "flex", fontSize: 38, fontWeight: 600, letterSpacing: -1 }}>care3r</div>
          <div
            style={{
              display: "flex",
              marginLeft: 12,
              padding: "6px 16px",
              borderRadius: 999,
              border: "1px solid #2a2338",
              fontSize: 20,
              color: "#a1a1aa",
              letterSpacing: 2,
            }}
          >
            CURATED · HIGH-SIGNAL · WEB3
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, letterSpacing: -3, lineHeight: 1.02, maxWidth: 980 }}>
            Curated Web3 jobs for builders, operators, and crypto-native talent.
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#a1a1aa" }}>
            Protocols · funds · startups · infrastructure
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26 }}>
          <div style={{ display: "flex", color: "#c9a8ff" }}>{count.toLocaleString("en-US")} roles in the latest snapshot</div>
          <div style={{ display: "flex", color: "#71717a" }}>care3r.vercel.app</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
