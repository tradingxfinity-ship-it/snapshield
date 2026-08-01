import { cn } from "@/lib/utils";

type SlabVisualProps = {
  accent?: string;
  guard?: string; // guard tint
  grade?: string;
  label?: string; // grade descriptor, e.g. "GEM MT"
  title?: string;
  subtitle?: string;
  cert?: string;
  className?: string;
  id?: string;
};

/**
 * A fully self-contained SVG render of a PSA-style graded slab holding a black
 * Snap Shield card. Used as the premium product imagery across the site so the
 * experience is crisp at any size without external photography.
 */
export default function SlabVisual({
  accent = "#2563EB",
  guard = "#e5edff",
  grade = "10",
  label = "GEM MT",
  title = "GRADED CARD GUARD",
  subtitle = "COLLECTOR SERIES",
  cert = "SS-000129456",
  className,
  id = "slab",
}: SlabVisualProps) {
  const g = (s: string) => `${id}-${s}`;
  const blue = "#3b82f6"; // on-card decoration colour (kept bright for the black card)
  const cx = 160;
  const cy = 226;

  return (
    <svg
      viewBox="0 0 320 460"
      className={cn("h-full w-full", className)}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Snap Shield graded card guard"
    >
      <defs>
        <linearGradient id={g("guard")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={guard} stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="1" stopColor={guard} stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id={g("card")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0c1424" />
          <stop offset="0.5" stopColor="#05080f" />
          <stop offset="1" stopColor="#0c1424" />
        </linearGradient>
        <radialGradient id={g("glow")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={blue} stopOpacity="0.38" />
          <stop offset="1" stopColor={blue} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={g("shine")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="0.4" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id={g("soft")} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor={accent} floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Snap Shield guard shell */}
      <g filter={`url(#${g("soft")})`}>
        <rect x="18" y="12" width="284" height="436" rx="30" fill={`url(#${g("guard")})`} stroke="#ffffff" strokeWidth="2" />
        <rect x="18" y="12" width="284" height="436" rx="30" fill="none" stroke={accent} strokeOpacity="0.25" strokeWidth="1.5" />
      </g>

      {/* snap corner tabs */}
      {[
        [30, 24],
        [266, 24],
        [30, 404],
        [266, 404],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="24" height="32" rx="9" fill="#ffffff" stroke={accent} strokeOpacity="0.3" />
      ))}

      {/* Inner slab */}
      <rect x="40" y="34" width="240" height="392" rx="18" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />

      {/* ---------- PSA-style label ---------- */}
      <text x="62" y="66" fill="#0b1220" fontFamily="Inter, sans-serif" fontSize="14" fontWeight="800" letterSpacing="0.2">
        SNAP<tspan fill={accent}>SHIELD</tspan>
      </text>
      <text x="62" y="80" fill="#475569" fontFamily="Inter, sans-serif" fontSize="7.5" fontWeight="600" letterSpacing="1">
        {title}
      </text>
      <text x="62" y="91" fill="#94a3b8" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="600" letterSpacing="1">
        {subtitle}
      </text>

      {/* divider + grade block */}
      <line x1="196" y1="52" x2="196" y2="98" stroke="#e5e7eb" strokeWidth="1" />
      <text x="204" y="64" fill="#0b1220" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="700" letterSpacing="0.5">
        {label}
      </text>
      <text x="262" y="72" textAnchor="end" fill="#0b1220" fontFamily="Inter, sans-serif" fontSize="22" fontWeight="900">
        {grade}
      </text>
      <text x="204" y="90" fill="#64748b" fontFamily="Inter, sans-serif" fontSize="6.5" fontWeight="600" letterSpacing="0.5">
        {cert}
      </text>

      {/* separator under label */}
      <line x1="52" y1="105" x2="268" y2="105" stroke="#eef2f7" strokeWidth="1.5" />

      {/* ---------- black card ---------- */}
      <rect x="54" y="112" width="212" height="300" rx="14" fill={`url(#${g("card")})`} />
      <rect x="60" y="118" width="200" height="288" rx="10" fill="none" stroke={blue} strokeOpacity="0.35" strokeWidth="1.2" />

      {/* tech-ring halo around the emblem */}
      <circle cx={cx} cy={cy} r="80" fill={`url(#${g("glow")})`} />
      <circle cx={cx} cy={cy} r="76" fill="none" stroke={blue} strokeOpacity="0.12" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="62" fill="none" stroke={blue} strokeOpacity="0.28" strokeWidth="1" strokeDasharray="3 7" />
      <circle cx={cx} cy={cy} r="46" fill="none" stroke={blue} strokeOpacity="0.2" strokeWidth="1" />
      {/* framing arcs */}
      <path d="M130.4 162.6 A70 70 0 0 1 189.6 162.6" fill="none" stroke={blue} strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" />
      <path d="M130.4 289.4 A70 70 0 0 0 189.6 289.4" fill="none" stroke={blue} strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" />
      {/* hud ticks */}
      <line x1={cx} y1={cy - 70} x2={cx} y2={cy - 62} stroke={blue} strokeOpacity="0.6" strokeWidth="1.6" strokeLinecap="round" />
      <line x1={cx} y1={cy + 62} x2={cx} y2={cy + 70} stroke={blue} strokeOpacity="0.6" strokeWidth="1.6" strokeLinecap="round" />
      <line x1={cx - 70} y1={cy} x2={cx - 62} y2={cy} stroke={blue} strokeOpacity="0.6" strokeWidth="1.6" strokeLinecap="round" />
      <line x1={cx + 62} y1={cy} x2={cx + 70} y2={cy} stroke={blue} strokeOpacity="0.6" strokeWidth="1.6" strokeLinecap="round" />

      {/* the shield mark */}
      <image href="/logo-mark.png" x="126" y="180" width="68" height="94" preserveAspectRatio="xMidYMid meet" />

      {/* wordmark + tagline */}
      <text x={cx} y="332" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="19" fontWeight="800" letterSpacing="0.5">
        <tspan fill="#ffffff">SNAP</tspan>
        <tspan fill="#60a5fa"> SHIELD</tspan>
      </text>
      <line x1="106" y1="347" x2="122" y2="347" stroke={blue} strokeOpacity="0.5" strokeWidth="1" />
      <line x1="198" y1="347" x2="214" y2="347" stroke={blue} strokeOpacity="0.5" strokeWidth="1" />
      <text x={cx} y="350" textAnchor="middle" fill="#94a3b8" fontFamily="Inter, sans-serif" fontSize="6.5" fontWeight="600" letterSpacing="3">
        PROTECT WHAT YOU GRADE
      </text>

      {/* glossy guard reflection */}
      <path d="M40 44 q60 -6 120 0 l-60 150 z" fill={`url(#${g("shine")})`} opacity="0.4" />
    </svg>
  );
}
