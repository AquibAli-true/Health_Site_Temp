// Central status -> color mapping.
// Semantic meaning (good/bad/caution) uses literal Tailwind colors so a
// warning always reads as red regardless of brand palette. Brand vars
// (--bg-card, --accent-coral, etc.) are used structurally in the
// components themselves, not encoded here.

export const RATING_STYLES = {
  excellent: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Excellent" },
  good: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Good" },
  average: { bg: "bg-amber-50", text: "text-amber-700", label: "Average" },
  poor: { bg: "bg-red-50", text: "text-red-700", label: "Poor" },
  unknown: { bg: "bg-(--bg-card-subtle)", text: "text-(--text-muted)", label: "Unknown" },
};

export const DIETARY_STYLES = {
  yes: { text: "text-emerald-700", label: "Yes" },
  no: { text: "text-red-700", label: "No" },
  maybe: { text: "text-amber-700", label: "Maybe" },
  unknown: { text: "text-(--text-muted)", label: "Unknown" },
};

export const CONCERN_STYLES = {
  low: { bg: "bg-(--bg-card-subtle)", text: "text-(--text-muted)" },
  moderate: { bg: "bg-amber-50", text: "text-amber-700" },
  high: { bg: "bg-red-50", text: "text-red-700" },
  unknown: { bg: "bg-(--bg-card-subtle)", text: "text-(--text-muted)" },
};

// Nutri-Score / Eco-Score letter grades (a-e) - always exactly 5 letters,
// so this gets its own fixed 5-step ramp independent of the enums above.
export const GRADE_STYLES = {
  a: { bg: "bg-emerald-50", text: "text-emerald-700" },
  b: { bg: "bg-lime-50", text: "text-lime-700" },
  c: { bg: "bg-amber-50", text: "text-amber-700" },
  d: { bg: "bg-orange-50", text: "text-orange-700" },
  e: { bg: "bg-red-50", text: "text-red-700" },
};