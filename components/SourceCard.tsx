import React from "react";
import { Source } from "@/lib/types";
import { ExternalLink, Clock } from "lucide-react";

interface SourceCardProps {
  source: Source;
}

export default function SourceCard({ source }: SourceCardProps) {
  return (
    <div className="card p-6 h-full flex flex-col">
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <a 
              href={source.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-lg hover:text-[#c9a8ff] transition-colors flex items-center gap-1.5"
            >
              {source.name}
              <ExternalLink size={15} className="text-zinc-500" />
            </a>
            <div className="text-sm text-zinc-400 mt-0.5">{source.ecosystem}</div>
          </div>
          <div className={`text-[10px] px-2.5 py-px rounded-full border ${source.active ? 'border-emerald-900 text-emerald-400' : 'border-zinc-700 text-zinc-500'}`}>
            {source.active ? "Active" : "Inactive"}
          </div>
        </div>

        <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
          {source.description}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-[#1f1f24] flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Clock size={13} />
          <span>Updated {new Date(source.last_checked).toLocaleDateString('en-US')}</span>
        </div>
        <div className="font-mono text-xs text-zinc-500">
          {source.indexed_jobs_count} jobs
        </div>
      </div>
    </div>
  );
}
