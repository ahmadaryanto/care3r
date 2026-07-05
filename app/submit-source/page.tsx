import SubmitSourceForm from "@/components/SubmitSourceForm";

export default function SubmitSourcePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <div className="max-w-xl">
        <div className="section-title mb-1">Contribute</div>
        <h1 className="text-4xl font-semibold tracking-tight">Submit a Job Source</h1>
        <p className="mt-3 text-lg text-zinc-400">
          Know a great source of high-signal Web3 roles that isn&apos;t tracked yet? Let us know. 
          Every new source is manually reviewed for quality.
        </p>
      </div>

      <div className="mt-10">
        <SubmitSourceForm />
      </div>

      <div className="mt-12 text-xs text-zinc-500 max-w-md">
        We currently track roles from Solana, Avalanche, Ethereum, Dragonfly, Block, Midnight, Web3.career, CryptoJobsList and several other premium sources.
      </div>
    </div>
  );
}
