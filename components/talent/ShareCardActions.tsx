"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Download, Share2, Link2 } from "lucide-react";

export default function ShareCardActions({
  candidateId,
  candidateName,
  score,
  role,
}: {
  candidateId: string;
  candidateName: string;
  score: number;
  role: string;
}) {
  const [busy, setBusy] = useState(false);

  function getUrl() {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/card/${candidateId}`;
  }

  function getProfileUrl() {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/talent/${candidateId}`;
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(getUrl());
      toast.success("Public card link copied");
    } catch {
      toast.error("Could not copy link");
    }
  }

  async function copyProfile() {
    try {
      await navigator.clipboard.writeText(getProfileUrl());
      toast.success("Public profile link copied");
    } catch {
      toast.error("Could not copy link");
    }
  }

  async function shareNative() {
    const url = getUrl();
    const text = `${candidateName} — ${role} · CV Power ${score}/100 on care3r`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "CV Power Card", text, url });
        return;
      } catch {
        /* user cancelled */
      }
    }
    await copyLink();
  }

  async function downloadPng() {
    setBusy(true);
    try {
      const el = document.getElementById("cv-power-card-export");
      if (!el) {
        toast.error("Card not found");
        return;
      }

      // SVG foreignObject snapshot (no extra deps)
      const width = el.scrollWidth;
      const height = el.scrollHeight;
      const clone = el.cloneNode(true) as HTMLElement;
      clone.style.width = `${width}px`;
      clone.style.background = "#0f0c18";

      const serializer = new XMLSerializer();
      const xhtml = new XMLSerializer().serializeToString(
        // wrap in foreignObject-friendly markup via outerHTML
        document.implementation.createHTMLDocument("export").body
      );
      void xhtml;
      void serializer;

      const html = `
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: system-ui, sans-serif; background:#0f0c18; color:white; padding:32px; width:${width}px; box-sizing:border-box;">
          <div style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#c4b5fd; margin-bottom:12px;">CV POWER</div>
          <div style="font-size:28px; font-weight:700;">${candidateName}</div>
          <div style="color:#a1a1aa; margin-top:4px; margin-bottom:16px;">${role}</div>
          <div style="font-size:42px; font-weight:700; color:#c4b5fd;">${score}<span style="font-size:18px; color:#71717a;">/100</span></div>
          <div style="margin-top:20px; font-size:12px; color:#71717a;">CV Power Score by care3r</div>
        </div>
      `;

      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${Math.max(width, 480)}" height="${Math.max(height, 320)}">
          <foreignObject width="100%" height="100%">
            ${html}
          </foreignObject>
        </svg>
      `;

      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("render failed"));
        img.src = url;
      });

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(width, 480) * 2;
      canvas.height = Math.max(height, 320) * 2;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no canvas");
      ctx.scale(2, 2);
      ctx.fillStyle = "#0f0c18";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const png = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = png;
      a.download = `cv-power-${candidateId}.png`;
      a.click();
      toast.success("PNG downloaded");
    } catch {
      // Fallback: open print-friendly card
      toast.message("Opening print dialog — save as PNG/PDF from there");
      window.print();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={shareNative}
        className="btn-primary gap-2 px-4 py-2.5 text-sm"
      >
        <Share2 size={15} />
        Share
      </button>
      <button
        type="button"
        onClick={downloadPng}
        disabled={busy}
        className="btn-secondary gap-2 px-4 py-2.5 text-sm disabled:opacity-60"
      >
        <Download size={15} />
        Download PNG
      </button>
      <button
        type="button"
        onClick={copyLink}
        className="btn-secondary gap-2 px-4 py-2.5 text-sm"
      >
        <Copy size={15} />
        Copy card link
      </button>
      <button
        type="button"
        onClick={copyProfile}
        className="btn-ghost gap-2 px-3 py-2.5 text-sm"
      >
        <Link2 size={15} />
        Copy profile link
      </button>
    </div>
  );
}
