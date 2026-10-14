import { ImageResponse } from "next/og";
import { getCandidateById } from "@/lib/talent/store";

export const alt = "CV Power Card on care3r";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COLORS: Record<string, string> = {
  red: "#f87171",
  orange: "#fb923c",
  yellow: "#facc15",
  green: "#34d399",
  purple: "#a78bfa",
};

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await getCandidateById(id);

  const name = c?.full_name ?? "CV Power Card";
  const role = c?.main_role ?? "Get your score on care3r";
  const score = c?.ai_score ?? 0;
  const label = c?.ai_score_label ?? "";
  const color = COLORS[c?.ai_score_color ?? "purple"] ?? COLORS.purple;
  const skills = (c?.skills ?? []).slice(0, 4);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #0b0812 0%, #140d22 60%, #0b0812 100%)",
          color: "#f4f4f5",
          fontFamily: "sans-serif",
          padding: 64,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "linear-gradient(135deg, #9b6dff, #c9a8ff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              C
            </div>
            <div style={{ display: "flex", fontSize: 28, fontWeight: 600 }}>care3r</div>
            <div style={{ display: "flex", fontSize: 22, color: "#a1a1aa", marginLeft: 8 }}>CV Power Card</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", fontSize: 68, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>{name}</div>
            <div style={{ display: "flex", fontSize: 32, color: "#c4b5fd" }}>{role}</div>
            {skills.length > 0 && (
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                {skills.map((s) => (
                  <div
                    key={s}
                    style={{
                      display: "flex",
                      padding: "8px 16px",
                      borderRadius: 999,
                      border: "1px solid #3b2d5c",
                      background: "#1a1229",
                      fontSize: 22,
                      color: "#d4d4d8",
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", fontSize: 22, color: "#71717a" }}>care3r.vercel.app/submit · Get your own score</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 340 }}>
          <div
            style={{
              width: 280,
              height: 280,
              borderRadius: 999,
              border: `18px solid ${color}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 80px ${color}55`,
            }}
          >
            <div style={{ display: "flex", fontSize: 104, fontWeight: 800, lineHeight: 1 }}>{score}</div>
            <div style={{ display: "flex", fontSize: 26, color: "#a1a1aa" }}>/ 100</div>
          </div>
          {label && <div style={{ display: "flex", marginTop: 26, fontSize: 30, fontWeight: 600, color }}>{label}</div>}
        </div>
      </div>
    ),
    { ...size }
  );
}
