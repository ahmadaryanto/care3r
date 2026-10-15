import { COMPANY_LOGOS } from "@/lib/company-logos";

/** Deterministic, brand-adjacent hue per company name for monograms. */
function hueFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  // Keep within violet -> blue -> teal so monograms sit inside the brand palette.
  return 190 + (h % 90);
}

function initials(name: string) {
  const words = name.replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function CompanyLogo({
  company,
  size = 40,
  className = "",
}: {
  company: string;
  size?: number;
  className?: string;
}) {
  const logo = COMPANY_LOGOS[company];
  const radius = Math.round(size * 0.26);
  const base = `relative shrink-0 overflow-hidden ring-1 ring-white/[0.08] ${className}`;

  if (logo) {
    return (
      <span
        className={`${base} ${logo.light ? "bg-white" : "bg-[#120e1c]"}`}
        style={{ width: size, height: size, borderRadius: radius }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny local icons; next/image adds no value here */}
        <img
          src={logo.src}
          alt=""
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </span>
    );
  }

  const hue = hueFor(company);
  return (
    <span
      aria-hidden="true"
      className={`${base} inline-flex items-center justify-center font-semibold text-white/90`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        fontSize: Math.round(size * 0.36),
        background: `linear-gradient(135deg, hsl(${hue} 55% 34%), hsl(${(hue + 40) % 360} 60% 22%))`,
      }}
    >
      {initials(company)}
    </span>
  );
}
