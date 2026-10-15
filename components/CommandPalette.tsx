"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Briefcase, CornerDownLeft, Search } from "lucide-react";
import CompanyLogo from "@/components/CompanyLogo";

type Item = { id: string; t: string; c: string; e: string; l: string; f: 0 | 1 };
type Result = { kind: "page"; href: string; label: string; hint: string } | { kind: "job"; item: Item };

const PAGES = [
  { href: "/jobs", label: "All jobs", hint: "Browse every role" },
  { href: "/curated-drops", label: "Curated Drops", hint: "Hand-picked collections" },
  { href: "/cv", label: "CV Power Score", hint: "Score your CV" },
  { href: "/sources", label: "Sources", hint: "Boards we track" },
  { href: "/about", label: "About", hint: "What care3r is" },
];

export const OPEN_PALETTE_EVENT = "care3r:open-palette";

let cache: Item[] | null = null;

function score(item: Item, terms: string[]) {
  const title = item.t.toLowerCase();
  const company = item.c.toLowerCase();
  const hay = `${title} ${company} ${item.e.toLowerCase()} ${item.l.toLowerCase()}`;
  if (!terms.every((t) => hay.includes(t))) return -1;
  let s = item.f ? 2 : 0;
  for (const t of terms) {
    if (title.startsWith(t)) s += 6;
    else if (title.includes(` ${t}`)) s += 4;
    if (company.startsWith(t)) s += 5;
  }
  return s;
}

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Item[] | null>(cache);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const show = useCallback(() => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setActive(0);
    setOpen(true);
    if (!cache) {
      fetch("/api/jobs/index")
        .then((r) => r.json())
        .then((data: Item[]) => {
          cache = data;
          setItems(data);
        })
        .catch(() => setItems([]));
    }
  }, []);

  const hide = useCallback(() => {
    setOpen(false);
    lastFocus.current?.focus?.();
  }, []);

  // Global shortcuts: Cmd/Ctrl+K toggles, custom event opens (navbar button).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) hide();
        else show();
      }
    };
    const onOpen = () => show();
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, [open, show, hide]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);
    const pages = PAGES.filter((p) => !q || p.label.toLowerCase().includes(q)).map((p) => ({ kind: "page" as const, ...p }));
    const source = items ?? [];
    const jobs = terms.length
      ? source
          .map((item) => ({ item, s: score(item, terms) }))
          .filter((r) => r.s >= 0)
          .sort((a, b) => b.s - a.s)
          .slice(0, 8)
          .map((r) => ({ kind: "job" as const, item: r.item }))
      : source
          .filter((i) => i.f)
          .slice(0, 5)
          .map((item) => ({ kind: "job" as const, item }));
    return q ? [...jobs, ...pages] : [...pages, ...jobs];
  }, [query, items]);

  const go = (r: Result) => {
    setOpen(false);
    router.push(r.kind === "page" ? r.href : `/jobs/${r.item.id}`);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") hide();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  };

  if (!open) return null;

  const loading = items === null;
  const activeId = results[active] ? `cmd-${active}` : undefined;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-3 pt-[12vh] sm:pt-[14vh]">
      <button type="button" aria-label="Close search" className="backdrop absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={hide} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search care3r"
        className="rise-in relative w-full max-w-xl overflow-hidden rounded-2xl border border-[#2a2338] bg-[#0b0812]/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(155,109,255,0.08)]"
      >
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4">
          <Search size={17} className="shrink-0 text-zinc-500" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKey}
            placeholder="Search jobs, companies, pages…"
            className="h-14 w-full bg-transparent text-[16px] text-white placeholder:text-zinc-500 focus:outline-none"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmd-results"
            aria-activedescendant={activeId}
          />
          <span className="kbd shrink-0">esc</span>
        </div>

        <ul id="cmd-results" role="listbox" className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
          {loading &&
            Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="flex items-center gap-3 px-3 py-2.5">
                <div className="skeleton h-8 w-8 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <div className="skeleton h-3 w-2/3" />
                  <div className="skeleton h-2.5 w-1/3" />
                </div>
              </li>
            ))}

          {!loading && results.length === 0 && (
            <li className="px-3 py-10 text-center text-sm text-zinc-400">No matches for &ldquo;{query}&rdquo;</li>
          )}

          {!loading &&
            results.map((r, i) => (
              <li
                key={r.kind === "page" ? r.href : r.item.id}
                id={`cmd-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseMove={() => setActive(i)}
                onClick={() => go(r)}
                className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 ${i === active ? "bg-white/[0.06]" : ""}`}
              >
                {r.kind === "job" ? (
                  <>
                    <CompanyLogo company={r.item.c} size={32} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-white">{r.item.t}</div>
                      <div className="truncate text-xs text-zinc-400">
                        {r.item.c} · {r.item.e} · {r.item.l}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#9b6dff]/12 text-[#c9a8ff]">
                      <Briefcase size={15} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-white">{r.label}</div>
                      <div className="text-xs text-zinc-400">{r.hint}</div>
                    </div>
                  </>
                )}
                {i === active ? (
                  <CornerDownLeft size={14} className="shrink-0 text-zinc-400" />
                ) : (
                  <ArrowRight size={14} className="shrink-0 text-transparent" />
                )}
              </li>
            ))}
        </ul>

        <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5 text-[11px] text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="kbd">↑</span>
            <span className="kbd">↓</span> to navigate <span className="kbd ml-2">↵</span> to open
          </span>
          <span>{items ? `${items.length} roles` : ""}</span>
        </div>
      </div>
    </div>
  );
}
