"use client";

import React, { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: "md" | "lg";
  /** Focus with the "/" key (use on one search bar per page). */
  shortcut?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search roles, companies, ecosystems, or skills…",
  size = "md",
  shortcut = false,
}: SearchBarProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!shortcut) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcut]);

  const lg = size === "lg";

  return (
    <div className="group relative w-full">
      <Search
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-[#c9a8ff] ${lg ? "left-5" : "left-4"}`}
        size={lg ? 19 : 17}
        aria-hidden="true"
      />
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search jobs"
        className={`w-full rounded-xl border border-[#201c2b] bg-[#0c0814]/90 text-[16px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-[border-color,box-shadow] placeholder:text-zinc-400 focus:border-[#9b6dff] focus:shadow-[0_0_0_4px_rgba(155,109,255,0.12)] focus:outline-none [&::-webkit-search-cancel-button]:hidden ${
          lg ? "h-14 pl-13 pr-24 text-[17px]" : "h-11 pl-11 pr-20"
        }`}
        style={{ paddingLeft: lg ? 52 : 44 }}
      />
      <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
        {value ? (
          <button
            type="button"
            onClick={() => {
              onChange("");
              ref.current?.focus();
            }}
            className="rounded-md p-1 text-zinc-400 hover:bg-white/5 hover:text-white"
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        ) : (
          shortcut && <span className="kbd hidden sm:inline-flex" aria-hidden="true">/</span>
        )}
      </div>
    </div>
  );
}
