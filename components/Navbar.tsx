"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/jobs", label: "Jobs" },
  { href: "/curated-drops", label: "Curated Drops" },
  { href: "/cv", label: "CV Score" },
  { href: "/sources", label: "Sources" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const close = () => setMobileOpen(false);

  const isActive = (href: string) => {
    if (href === "/jobs") return pathname.startsWith("/jobs");
    if (href === "/curated-drops") return pathname.startsWith("/curated-drops");
    if (href === "/cv") return pathname === "/cv" || pathname === "/submit" || pathname.startsWith("/card");
    return pathname === href;
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[#201c2b] bg-[#050308]/90 backdrop-blur-xl" aria-label="Main">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-10">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#9b6dff] to-[#c9a8ff]">
              <span className="text-lg font-semibold tracking-[-1px] text-white" aria-hidden="true">C</span>
            </div>
            <span className="text-xl font-semibold tracking-[-0.4px] text-white transition-colors group-hover:text-[#c9a8ff]">
              care3r
            </span>
          </Link>

          <div className="hidden items-center gap-7 text-sm lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`nav-link ${isActive(link.href) ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/newsletter"
              className="nav-link rounded-full border border-[#1f1f24] px-3 py-1 text-xs hover:border-zinc-700"
            >
              Join Drops
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/submit-source" className="btn-ghost hidden text-sm sm:flex">
            Submit Source
          </Link>
          <Link href="/jobs" className="btn-primary px-5 py-2 text-sm">
            Explore Jobs
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="-mr-2 p-3 text-zinc-400 hover:text-white lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          id="mobile-menu"
          className="flex flex-col gap-1 border-t border-[#201c2b] bg-[#050308] px-4 py-5 text-sm sm:px-6 lg:hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              onClick={close}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`rounded-lg px-2 py-2.5 ${isActive(link.href) ? "bg-white/5 text-white" : "text-zinc-400 hover:text-white"}`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/submit-source" onClick={close} className="rounded-lg px-2 py-2.5 text-zinc-400 hover:text-white">
            Submit Source
          </Link>
          <Link href="/newsletter" onClick={close} className="rounded-lg px-2 py-2.5 text-zinc-400 hover:text-white">
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
