"use client";

import React, { useState } from "react";
import { toast } from "sonner";

export default function SubmitSourceForm() {
  const [form, setForm] = useState({
    name: "",
    url: "",
    ecosystem: "",
    why: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const update = (k: string, v: string) => setForm({ ...form, [k]: v });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.url) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    toast.success("Source submitted", {
      description: "Thank you. Our curators will review it shortly.",
    });

    setForm({ name: "", url: "", ecosystem: "", why: "", email: "" });
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <div>
        <label className="block text-sm mb-1.5 text-zinc-400">Source name</label>
        <input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Protocol X Jobs Board"
          className="input w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1.5 text-zinc-400">Website URL</label>
        <input
          value={form.url}
          onChange={(e) => update("url", e.target.value)}
          placeholder="https://jobs.protocolx.xyz"
          className="input w-full"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1.5 text-zinc-400">Primary ecosystem or niche</label>
          <input
            value={form.ecosystem}
            onChange={(e) => update("ecosystem", e.target.value)}
            placeholder="Solana, DeFi, AI x Crypto..."
            className="input w-full"
          />
        </div>
        <div>
          <label className="block text-sm mb-1.5 text-zinc-400">Your email (optional)</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@domain.com"
            className="input w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1.5 text-zinc-400">Why should we add this source?</label>
        <textarea
          value={form.why}
          onChange={(e) => update("why", e.target.value)}
          placeholder="High quality roles from a respected protocol team. Regularly updated..."
          className="input w-full min-h-[110px] resize-y"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !form.name || !form.url}
        className="btn-primary px-8 disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Source"}
      </button>
    </form>
  );
}
