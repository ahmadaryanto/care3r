import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#201c2b] bg-[#050308] mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 text-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#9b6dff] to-[#c9a8ff] flex items-center justify-center">
              <span className="text-white text-xs font-semibold">C</span>
            </div>
            <div>
              <div className="font-semibold tracking-tight">care3r</div>
              <div className="text-xs text-zinc-500">Remote Web3 jobs</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2 text-zinc-500">
            <Link href="/jobs" className="hover:text-zinc-300 transition-colors">Jobs</Link>
            <Link href="/curated-drops" className="hover:text-zinc-300 transition-colors">Curated Drops</Link>
            <Link href="/sources" className="hover:text-zinc-300 transition-colors">Sources</Link>
            <Link href="/submit-source" className="hover:text-zinc-300 transition-colors">Submit Source</Link>
            <Link href="/about" className="hover:text-zinc-300 transition-colors">About</Link>
          </div>

          <div className="text-xs text-zinc-500">
            © {new Date().getFullYear()} care3r. Remote Web3 careers.
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#1f1f24] text-[11px] text-zinc-500 max-w-2xl">
          Not a generic job board. We surface the best opportunities from trusted sources across protocols, funds, and crypto-native teams before they hit the broader timeline.
        </div>
      </div>
    </footer>
  );
}
