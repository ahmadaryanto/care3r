"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { OPEN_PALETTE_EVENT } from "@/components/CommandPalette";

const navLinks = [
  { href: "/jobs", label: "Jobs" },
  { href: "/curated-drops", label: "Curated Drops" },
  { href: "/cv", label: "CV Score" },
  { href: "/sources", label: "Sources" },
  { href: "/about", label: "About" },
];

const subscribeNoop = () => () => {};
const useIsMac = () =>
  useSyncExternalStore(
    subscribeNoop,
    () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent),
    () => true
  );

const openPalette = () => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMac = useIsMac();
  const close = () => setMobileOpen(false);

  const isActive = (href: string) => {
    if (href === "/jobs") return pathname.startsWith("/jobs");
    if (href === "/curated-drops") return pathname.startsWith("/curated-drops");
    if (href === "/cv") return pathname === "/cv" || pathname === "/submit" || pathname.startsWith("/card");
    return pathname === href;
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#050308]/80 backdrop-blur-xl backdrop-saturate-150" aria-label="Main">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-8">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#9b6dff] to-[#c9a8ff] shadow-[0_0_20px_-4px_rgba(155,109,255,0.6)]">
              <span className="text-[15px] font-semibold tracking-[-1px] text-white" aria-hidden="true">C</span>
            </div>
            <span className="text-[17px] font-semibold tracking-[-0.4px] text-white transition-colors group-hover:text-[#c9a8ff]">
              care3r
            </span>
          </Link>

          <div className="hidden items-center gap-0.5 text-[13.5px] lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                  isActive(link.href) ? "bg-white/[0.06] text-white" : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openPalette}
            className="hidden h-9 w-56 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-left text-[13px] text-zinc-400 transition-colors hover:border-white/[0.14] hover:text-zinc-200 md:flex xl:w-64"
          >
            <Search size={14} />
            <span className="flex-1">Search jobs…</span>
            <span className="kbd" suppressHydrationWarning>{isMac ? "⌘K" : "Ctrl K"}</span>
          </button>
          <button
            type="button"
            onClick={openPalette}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/[0.05] hover:text-white md:hidden"
            aria-label="Search jobs"
          >
            <Search size={18} />
          </button>
          <Link href="/newsletter" className="hidden rounded-lg px-3 py-1.5 text-[13px] font-medium text-zinc-400 transition-colors hover:text-white xl:block">
            Join Drops
          </Link>
          <Link href="/jobs" className="btn-primary hidden px-4 py-1.5 text-[13px] sm:inline-flex">
            Explore Jobs
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="-mr-1 flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/[0.05] hover:text-white lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-menu" className="rise-in flex flex-col gap-1 border-t border-white/[0.06] bg-[#050308] px-4 py-4 text-sm sm:px-6 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              onClick={close}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`rounded-lg px-3 py-2.5 font-medium ${isActive(link.href) ? "bg-white/[0.06] text-white" : "text-zinc-400 hover:text-white"}`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/submit-source" onClick={close} className="rounded-lg px-3 py-2.5 text-zinc-400 hover:text-white">
            Submit Source
          </Link>
          <Link href="/newsletter" onClick={close} className="rounded-lg px-3 py-2.5 text-zinc-400 hover:text-white">
            Join Drops
          </Link>
          <Link href="/jobs" onClick={close} className="btn-primary mt-3 justify-center py-3 text-sm">
            Explore Jobs
          </Link>
        </div>
      )}

    </nav>
  );
}
