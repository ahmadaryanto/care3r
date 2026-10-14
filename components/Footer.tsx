import Link from "next/link";

const columns = [
  {
    title: "Jobs",
    links: [
      { href: "/jobs", label: "All jobs" },
      { href: "/curated-drops", label: "Curated Drops" },
      { href: "/sources", label: "Sources" },
      { href: "/newsletter", label: "Join Drops" },
    ],
  },
  {
    title: "Talent",
    links: [
      { href: "/cv", label: "CV Power Score" },
      { href: "/submit", label: "Scan your CV" },
      { href: "/recruiters", label: "For recruiters" },
    ],
  },
  {
    title: "care3r",
    links: [
      { href: "/about", label: "About" },
      { href: "/submit-source", label: "Submit a source" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-[#201c2b] bg-[#050308] sm:mt-16">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm sm:px-6 sm:py-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#9b6dff] to-[#c9a8ff]">
                <span className="text-xs font-semibold text-white" aria-hidden="true">C</span>
              </div>
              <div>
                <div className="font-semibold tracking-tight text-white">care3r</div>
                <div className="text-xs text-zinc-400">Remote Web3 jobs</div>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-zinc-400">
              Not a generic job board. We surface the best opportunities from trusted sources
              across protocols, funds, and crypto-native teams before they hit the broader timeline.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <div className="text-xs font-medium uppercase tracking-wider text-zinc-400">{col.title}</div>
                <ul className="mt-3 space-y-2">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-zinc-400 transition-colors hover:text-zinc-200">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-[#1f1f24] pt-6 text-xs text-zinc-400">
          © {new Date().getFullYear()} care3r. Remote Web3 careers.
        </div>
      </div>
    </footer>
  );
}
