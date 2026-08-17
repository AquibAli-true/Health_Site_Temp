// Central status -> color mapping.
// Structural surfaces (cards, backgrounds, borders) use the brand palette
// from index.css. Semantic states (good/bad/caution grades, concern levels)
// use their own fixed tints so meaning reads unambiguously regardless of
// brand color choices.

export const PALETTE = {
  bgMain: "#DDE8E2",
  bgCard: "#ffffff",
  bgCardSubtle: "#f0f5f2",
  accentEmerald: "#10b981",
  accentEmeraldHover: "#059669",
  accentCoral: "#ff6b4a",
  textMain: "#0e1e19",
  textMuted: "#5a6e67",
  border: "rgba(14,30,25,0.08)",
};

export const RATING_STYLES = {
  excellent: { bg: "bg-[#EAF3DE]", text: "text-[#3B6D11]", label: "Excellent" },
  good: { bg: "bg-[#EAF3DE]", text: "text-[#3B6D11]", label: "Good" },
  average: { bg: "bg-[#FAEEDA]", text: "text-[#854F0B]", label: "Average" },
  poor: { bg: "bg-[#FCEBEB]", text: "text-[#A32D2D]", label: "Poor" },
  unknown: { bg: "bg-(--bg-card-subtle)", text: "text-(--text-muted)", label: "Unknown" },
};

export const DIETARY_STYLES = {
  yes: { bg: "bg-[#EAF3DE]", text: "text-[#3B6D11]", label: "Yes" },
  no: { bg: "bg-(--bg-card-subtle)", text: "text-red-700", label: "No" },
  maybe: { bg: "bg-(--bg-card-subtle)", text: "text-[#854F0B]", label: "Maybe" },
  unknown: { bg: "bg-(--bg-card-subtle)", text: "text-(--text-muted)", label: "Unknown" },
};

export const CONCERN_STYLES = {
  low: { bg: "bg-(--bg-card-subtle)", text: "text-(--text-muted)", border: "border-black/10" },
  moderate: { bg: "bg-[#FAC775]", text: "text-[#633806]", border: "border-transparent" },
  high: { bg: "bg-red-100", text: "text-red-700", border: "border-transparent" },
  unknown: { bg: "bg-(--bg-card-subtle)", text: "text-(--text-muted)", border: "border-black/10" },
};

// Nutri-Score / Eco-Score letter grades - fixed 5-step ramp, a through e.
export const GRADE_STYLES = {
  a: { bg: "bg-[#EAF3DE]", text: "text-[#173404]", label: "text-[#3B6D11]" },
  b: { bg: "bg-[#EAF3DE]", text: "text-[#173404]", label: "text-[#3B6D11]" },
  c: { bg: "bg-[#FAEEDA]", text: "text-[#412402]", label: "text-[#854F0B]" },
  d: { bg: "bg-[#FCEBEB]", text: "text-[#501313]", label: "text-[#791F1F]" },
  e: { bg: "bg-[#FCEBEB]", text: "text-[#501313]", label: "text-[#791F1F]" },
};

// NOVA group 1-4 shares the same visual weight as nutri/eco grades:
// 1-2 read as fine, 3 as caution, 4 as flagged.
export const NOVA_STYLES = {
  1: GRADE_STYLES.a,
  2: GRADE_STYLES.b,
  3: GRADE_STYLES.c,
  4: GRADE_STYLES.e,
};