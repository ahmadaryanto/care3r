"use client";

import React from "react";
import CuratedDropCard from "@/components/CuratedDropCard";
import { curatedDrops } from "@/lib/mock-data";

export default function CuratedDropsPage() {
  const featured = curatedDrops.filter((d) => d.featured);
  const rest = curatedDrops.filter((d) => !d.featured);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-2xl mb-10">
        <div className="section-title mb-1">Editorial Collections</div>
        <h1 className="text-4xl font-semibold tracking-tight">Curated Drops</h1>
        <p className="mt-3 text-lg text-zinc-400">
          Handpicked groups of opportunities organized by theme, narrative, and signal. 
          These are not exhaustive — they are focused.
        </p>
      </div>

      {featured.length > 0 && (
        <div className="mb-10">
          <div className="text-sm uppercase tracking-widest text-zinc-500 mb-4">Featured collections</div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((drop) => (
              <CuratedDropCard key={drop.id} drop={drop} />
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="text-sm uppercase tracking-widest text-zinc-500 mb-4">More collections</div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((drop) => (
            <CuratedDropCard key={drop.id} drop={drop} />
          ))}
        </div>
      </div>
    </div>
  );
}
