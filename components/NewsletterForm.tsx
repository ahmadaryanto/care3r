"use client";

import React, { useState } from "react";
import { toast } from "sonner";

export default function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [roleInterests, setRoleInterests] = useState<string[]>([]);
  const [ecosystemInterests, setEcosystemInterests] = useState<string[]>([]);
  const [remotePref, setRemotePref] = useState("Remote");
  const [loading, setLoading] = useState(false);

  const roleOptions = ["Engineering", "Product", "Design", "BD / Growth", "Research", "Marketing", "Community", "Operations"];
  const ecoOptions = ["Solana", "Ethereum", "DeFi", "Infra", "AI x Crypto", "L2", "Gaming"];

  const toggle = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    if (list.includes(val)) setList(list.filter(v => v !== val));
    else setList([...list, val]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 650));

    toast.success("You're in. Welcome to the drops.", {
      description: "We'll send you the best opportunities as they surface.",
    });

    setEmail("");
    setRoleInterests([]);
    setEcosystemInterests([]);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@domain.com"
          className="input w-full"
          required
        />
      </div>

      {!compact && (
        <>
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Role interests</div>
            <div className="flex flex-wrap gap-1.5">
              {roleOptions.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => toggle(roleInterests, setRoleInterests, r)}
                  className={`filter-chip text-xs ${roleInterests.includes(r) ? "active" : ""}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Ecosystem interests</div>
            <div className="flex flex-wrap gap-1.5">
              {ecoOptions.map((e) => (
                <button
                  type="button"
                  key={e}
                  onClick={() => toggle(ecosystemInterests, setEcosystemInterests, e)}
                  className={`filter-chip text-xs ${ecosystemInterests.includes(e) ? "active" : ""}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Work preference</div>
            <select
              value={remotePref}
              onChange={(e) => setRemotePref(e.target.value)}
              className="input w-full text-sm py-2"
            >
              <option>Remote</option>
              <option>Hybrid</option>
              <option>Open to relocation</option>
              <option>On-site</option>
            </select>
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={loading || !email}
        className="btn-primary w-full justify-center disabled:opacity-70"
      >
        {loading ? "Joining..." : "Join Job Drops"}
      </button>

      <p className="text-[11px] text-center text-zinc-500">
        1–2 high-signal emails per week. Unsubscribe anytime.
      </p>
    </form>
  );
}
