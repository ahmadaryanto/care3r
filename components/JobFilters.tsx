"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FILTER_GROUPS, type FilterKey, type FilterState } from "@/lib/job-filters";

interface JobFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  counts: Record<FilterKey, Record<string, number>>;
}

const DEFAULT_OPEN: FilterKey[] = ["ecosystems", "categories", "workModes", "seniorities"];

export default function JobFilters({ filters, onChange, onReset, counts }: JobFiltersProps) {
  const [open, setOpen] = useState<Set<FilterKey>>(new Set(DEFAULT_OPEN));

  const toggleValue = (key: FilterKey, value: string) => {
    const current = filters[key] as string[];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  const toggleGroup = (key: FilterKey) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <div className="space-y-1">
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="section-title">Filters</span>
        <button type="button" onClick={onReset} className="text-xs text-zinc-400 transition-colors hover:text-white">
          Reset
        </button>
      </div>

      {FILTER_GROUPS.map(({ key, label, options }) => {
        const selected = filters[key] as string[];
        const isOpen = open.has(key);
        // Show options that have results (or are selected), most common first.
        const visible = options
          .filter((o) => (counts[key]?.[o] ?? 0) > 0 || selected.includes(o))
          .sort((a, b) => (counts[key]?.[b] ?? 0) - (counts[key]?.[a] ?? 0));

        return (
          <section key={key} className="border-b border-white/[0.05] py-2 last:border-0">
            <button
              type="button"
              onClick={() => toggleGroup(key)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between rounded-md px-1 py-1.5 text-left text-[13px] font-medium text-zinc-200 hover:text-white"
            >
              <span>
                {label}
                {selected.length > 0 && <span className="ml-1.5 text-[#c9a8ff]">{selected.length}</span>}
              </span>
              <ChevronDown size={15} className={`text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
              <ul className="mt-1 space-y-0.5">
                {visible.length === 0 && <li className="px-1 py-1 text-xs text-zinc-400">No matching roles</li>}
                {visible.map((option) => {
                  const active = selected.includes(option);
                  const count = counts[key]?.[option] ?? 0;
                  return (
                    <li key={option}>
                      <button
                        type="button"
                        onClick={() => toggleValue(key, option)}
                        aria-pressed={active}
                        className={`group flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[13px] transition-colors ${
                          active ? "bg-[#9b6dff]/12 text-white" : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100"
                        }`}
                      >
                        <span
                          className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
                            active ? "border-[#9b6dff] bg-[#9b6dff]" : "border-zinc-600 group-hover:border-zinc-400"
                          }`}
                          aria-hidden="true"
                        >
                          {active && (
                            <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-white">
                              <path d="M2.5 6.5l2.2 2.2L9.5 3.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span className="flex-1 truncate">{option}</span>
                        <span className={`text-xs tabular-nums ${active ? "text-[#c9a8ff]" : "text-zinc-400"}`}>{count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
