"use client";

import React from "react";
import { Category, Ecosystem, WorkMode, EmploymentType, Seniority } from "@/lib/types";

interface FilterState {
  categories: Category[];
  ecosystems: Ecosystem[];
  workModes: WorkMode[];
  employmentTypes: EmploymentType[];
  seniorities: Seniority[];
  companyTypes: string[];
}

interface JobFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  sort: string;
  onSortChange: (sort: string) => void;
  onReset: () => void;
  hideHeader?: boolean;
}

const CATEGORIES: Category[] = [
  "Engineering", "Product", "Design", "Business Development", "Marketing", "Community",
  "Research", "Operations", "Ecosystem Growth", "DevRel", "Security", "Data", "AI x Crypto"
];

const ECOSYSTEMS: Ecosystem[] = [
  "Solana", "Ethereum", "Avalanche", "Bitcoin", "DeFi", "Infra", "L2", "AI x Crypto",
  "Gaming", "Consumer Crypto", "Venture / Fund", "DAO", "Protocol", "Startup", "Multi-chain"
];

const WORK_MODES: WorkMode[] = ["Remote", "Hybrid", "On-site"];
const EMPLOYMENT_TYPES: EmploymentType[] = ["Full-time", "Contract", "Internship", "Part-time"];
const SENIORITIES: Seniority[] = ["Entry", "Mid", "Senior", "Lead", "Principal", "Head"];
const COMPANY_TYPES = ["Protocol", "Startup", "Fund", "Infrastructure", "DAO", "Research"];

export default function JobFilters({ filters, onChange, sort, onSortChange, onReset, hideHeader = false }: JobFiltersProps) {
  const toggle = <T extends string>(arr: T[], value: T): T[] =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const update = (key: keyof FilterState, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-7">
      {hideHeader ? (
        <div className="flex justify-end mb-2">
          <button onClick={onReset} className="text-xs text-zinc-500 hover:text-zinc-300">Reset all</button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="section-title">Filters</div>
          <button onClick={onReset} className="text-xs text-zinc-500 hover:text-zinc-300">Reset all</button>
        </div>
      )}

      {/* Sort - hidden when header is hidden (controlled from parent) */}
      {!hideHeader && (
        <div>
          <div className="text-sm font-medium mb-2 text-zinc-300">Sort</div>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="input w-full text-sm py-2"
          >
            <option value="recent">Recently posted</option>
            <option value="oldest">Oldest first</option>
            <option value="title">Title A–Z</option>
          </select>
        </div>
      )}

      {/* Role Category */}
      <div>
        <div className="text-sm font-medium mb-2 text-zinc-300">Role Category</div>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const active = filters.categories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => update("categories", toggle(filters.categories, cat))}
                className={`filter-chip text-xs ${active ? "active" : ""}`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Ecosystem */}
      <div>
        <div className="text-sm font-medium mb-2 text-zinc-300">Ecosystem</div>
        <div className="flex flex-wrap gap-1.5">
          {ECOSYSTEMS.map((eco) => {
            const active = filters.ecosystems.includes(eco);
            return (
              <button
                key={eco}
                onClick={() => update("ecosystems", toggle(filters.ecosystems, eco))}
                className={`filter-chip text-xs ${active ? "active" : ""}`}
              >
                {eco}
              </button>
            );
          })}
        </div>
      </div>

      {/* Work Mode */}
      <div>
        <div className="text-sm font-medium mb-2 text-zinc-300">Work Mode</div>
        <div className="flex flex-wrap gap-1.5">
          {WORK_MODES.map((mode) => {
            const active = filters.workModes.includes(mode);
            return (
              <button
                key={mode}
                onClick={() => update("workModes", toggle(filters.workModes, mode))}
                className={`filter-chip text-xs ${active ? "active" : ""}`}
              >
                {mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* Employment Type */}
      <div>
        <div className="text-sm font-medium mb-2 text-zinc-300">Employment Type</div>
        <div className="flex flex-wrap gap-1.5">
          {EMPLOYMENT_TYPES.map((type) => {
            const active = filters.employmentTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() => update("employmentTypes", toggle(filters.employmentTypes, type))}
                className={`filter-chip text-xs ${active ? "active" : ""}`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Seniority */}
      <div>
        <div className="text-sm font-medium mb-2 text-zinc-300">Seniority</div>
        <div className="flex flex-wrap gap-1.5">
          {SENIORITIES.map((sen) => {
            const active = filters.seniorities.includes(sen);
            return (
              <button
                key={sen}
                onClick={() => update("seniorities", toggle(filters.seniorities, sen))}
                className={`filter-chip text-xs ${active ? "active" : ""}`}
              >
                {sen}
              </button>
            );
          })}
        </div>
      </div>

      {/* Company Type */}
      <div>
        <div className="text-sm font-medium mb-2 text-zinc-300">Company Type</div>
        <div className="flex flex-wrap gap-1.5">
          {COMPANY_TYPES.map((ct) => {
            const active = filters.companyTypes.includes(ct);
            return (
              <button
                key={ct}
                onClick={() => update("companyTypes", toggle(filters.companyTypes, ct))}
                className={`filter-chip text-xs ${active ? "active" : ""}`}
              >
                {ct}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
