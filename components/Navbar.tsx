"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";

const navLinks = [
  { href: "/jobs", label: "Jobs" },
  { href: "/curated-drops", label: "Curated Drops" },
  { href: "/sources", label: "Sources" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/jobs" && pathname.startsWith("/jobs")) return true;
    return pathname === href;
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[#201c2b] bg-[#050308]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#9b6dff] to-[#c9a8ff] flex items-center justify-center">
              <span className="text-white text-lg font-semibold tracking-[-1px]">O</span>
            </div>
            <span className="font-semibold text-xl tracking-[-0.4px] text-white group-hover:text-[#c9a8ff] transition-colors">
              orpheuzkaze
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive(link.href) ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/newsletter" className="nav-link text-xs border border-[#1f1f24] rounded-full px-3 py-1 hover:border-zinc-700">Join Drops</Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/submit-source"
            className="hidden sm:flex btn-ghost text-sm"
          >
            Submit Source
          </Link>

          <Link
            href="/jobs"
            className="btn-primary text-sm px-5 py-2"
          >
            Explore Jobs
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-3 -mr-2 text-zinc-400 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#201c2b] bg-[#050308] px-6 py-6 flex flex-col gap-3 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`py-2 ${isActive(link.href) ? "text-white" : "text-zinc-400"}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/submit-source"
            onClick={() => setMobileOpen(false)}
            className="py-2 text-zinc-400"
          >
            Submit Source
          </Link>
          <Link
            href="/newsletter"
            onClick={() => setMobileOpen(false)}
            className="py-2 text-zinc-400"
          >
            Join Drops
          </Link>
          <Link
            href="/jobs"
            onClick={() => setMobileOpen(false)}
            className="btn-primary mt-2 text-sm py-3 justify-center"
          >
            Explore Jobs
          </Link>
        </div>
      )}
    </nav>
  );
}
