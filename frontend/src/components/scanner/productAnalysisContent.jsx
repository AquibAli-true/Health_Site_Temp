import { useState } from "react";
import { ScoreRow } from "./ScoreRow";
import { RATING_STYLES, DIETARY_STYLES, CONCERN_STYLES } from "./statusColors.js";

// ---- small shared bits ----

function SectionLabel({ children, tag }) {
  return (
    <div className="mb-1.5 flex items-center gap-2">
      <p className="text-[12.5px] font-semibold text-(--text-main)">
        {children}
      </p>
      {tag && (
        <span className="rounded-md bg-(--bg-card-subtle) px-[7px] py-[2px] text-[10px] text-(--text-muted)">
          {tag}
        </span>
      )}
    </div>
  );
}

function EmptyRow({ children }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-(--bg-card-subtle) px-3 py-2.5">
      <svg width="14" height="14" viewBox="0 0 16 16" className="shrink-0 text-(--text-muted)">
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8 7.2v3.6M8 5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      <p className="text-[11px] text-(--text-muted)">{children}</p>
    </div>
  );
}

function WarningRow({ children }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-[#FAEEDA] px-3 py-2.5">
      <svg width="14" height="14" viewBox="0 0 16 16" className="shrink-0 text-[#854F0B]">
        <path d="M8 1.5 15 14H1L8 1.5Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M8 6.5v3M8 11.5v.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      <p className="text-[11px] text-[#854F0B]">{children}</p>
    </div>
  );
}

// ---- header ----

function ProductHeader({ product, analysisStatus, onClose }) {
  const statusLabel =
    { partial: "Partial", complete: "Complete", insufficient_data: "Insufficient" }[
      analysisStatus
    ] || null;

  return (
    <div className="flex items-center gap-2.5 border-b border-black/[0.06] px-4 py-3">
      <button
        onClick={onClose}
        aria-label="Close"
        className="flex h-[26px] w-[26px] shrink-0 cursor-pointer items-center justify-center rounded-full text-(--text-main)"
      >
        <svg width="16" height="16" viewBox="0 0 18 18">
          <path d="M14 4 4 14M4 4l10 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>

      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-[10px] bg-(--bg-card-subtle)">
        {product.image_url ? (
          <img src={product.image_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-(--text-muted)">
            <svg width="18" height="18" viewBox="0 0 20 20">
              <rect x="2" y="4" width="16" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.3" />
              <circle cx="7" cy="9" r="1.4" fill="currentColor" />
              <path d="m3 15 4.5-4.5L11 14l3-3.5 3 3.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-medium text-(--text-main)">
          {product.name || "Unnamed product"}
        </p>
        <p className="truncate text-[11.5px] text-(--text-muted)">
          {[product.brand, product.quantity].filter(Boolean).join(" · ") || "\u00A0"}
        </p>
      </div>

      {statusLabel && (
        <span className="shrink-0 rounded-md bg-[#FAEEDA] px-2 py-[2px] text-[10px] text-[#854F0B]">
          {statusLabel}
        </span>
      )}
    </div>
  );
}

// ---- rating strip ----

function RatingStrip({ summary }) {
  const style = RATING_STYLES[summary.overall_rating] ?? RATING_STYLES.unknown;

  return (
    <div className="flex items-center gap-2 border-b border-black/[0.06] px-4 py-2.5">
      <span className={`shrink-0 rounded-md px-2.5 py-[3px] text-[10.5px] font-semibold ${style.bg} ${style.text}`}>
        {style.label}
      </span>
      <p className="text-[11.5px] text-(--text-muted)">{summary.headline}</p>
    </div>
  );
}

// ---- nutrition ----

const NUTRIENT_FIELDS = [
  { field: "calories", label: "Calories", unit: "kcal" },
  { field: "protein_g", label: "Protein", unit: "g" },
  { field: "carbohydrates_g", label: "Carbs", unit: "g" },
  { field: "sugars_g", label: "Sugar", unit: "g" },
  { field: "added_sugars_g", label: "Added sugar", unit: "g" },
  { field: "fat_g", label: "Fat", unit: "g" },
  { field: "saturated_fat_g", label: "Sat. fat", unit: "g" },
  { field: "trans_fat_g", label: "Trans fat", unit: "g" },
  { field: "fiber_g", label: "Fiber", unit: "g" },
  { field: "salt_g", label: "Salt", unit: "g" },
];

// Salt values above this are almost certainly a source-data unit error
// (g/100g salt this high is physically implausible) — flagged, not hidden.
const SALT_SANITY_THRESHOLD = 100;

function NutritionSection({ nutrition }) {
  if (nutrition.status === "unknown") {
    return (
      <div>
        <SectionLabel>Nutrition</SectionLabel>
        <EmptyRow>Nutrition information not available for this product</EmptyRow>
      </div>
    );
  }

  const present = NUTRIENT_FIELDS.filter(
    (n) => nutrition[n.field] !== null && nutrition[n.field] !== undefined
  );
  const missing = NUTRIENT_FIELDS.filter(
    (n) => nutrition[n.field] === null || nutrition[n.field] === undefined
  );
  const saltLooksWrong =
    nutrition.salt_g !== null &&
    nutrition.salt_g !== undefined &&
    nutrition.salt_g > SALT_SANITY_THRESHOLD;

  return (
    <div>
      <SectionLabel tag={nutrition.status === "partial" ? "Partial" : null}>
        Nutrition
        <span className="ml-1 font-normal text-(--text-muted)">
          per {nutrition.per || "100g"}
        </span>
      </SectionLabel>

      <div className="grid grid-cols-2 gap-1.5">
        {present.map((n) => {
          const flagged = n.field === "salt_g" && saltLooksWrong;
          return (
            <div
              key={n.field}
              className={`rounded-lg px-2.5 py-2 ${flagged ? "bg-[#FCEBEB]" : "bg-(--bg-card-subtle)"}`}
            >
              <p className={`mb-0.5 text-[10px] ${flagged ? "text-[#A32D2D]" : "text-(--text-muted)"}`}>
                {n.label}
              </p>
              <p className={`text-[14px] font-medium ${flagged ? "text-[#501313]" : "text-(--text-main)"}`}>
                {nutrition[n.field]} {n.unit}
              </p>
            </div>
          );
        })}
      </div>

      {(missing.length > 0 || saltLooksWrong) && (
        <p className="mt-[5px] text-[10px] text-(--text-muted)">
          {[
            missing.length > 0 && `${missing.map((n) => n.label).join(", ")} not reported`,
            saltLooksWrong && "salt value likely a source data error",
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      )}
    </div>
  );
}

// ---- ingredients ----

function IngredientsSection({ ingredients }) {
  if (ingredients.status === "unknown") {
    return (
      <div>
        <SectionLabel>Ingredients</SectionLabel>
        <EmptyRow>Ingredient list not available for this product</EmptyRow>
      </div>
    );
  }

  return (
    <div>
      <SectionLabel tag={ingredients.status === "partial" ? "Partial" : null}>
        Ingredients
      </SectionLabel>

      {ingredients.cleaned_ingredient_text && (
        <p className="mb-2 text-[11px] leading-relaxed text-(--text-muted)">
          {ingredients.cleaned_ingredient_text}
        </p>
      )}

      {ingredients.notable_ingredients?.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {ingredients.notable_ingredients.map((item, i) => (
            <div key={i} className="rounded-lg bg-(--bg-card-subtle) px-2.5 py-2">
              <p className="text-[11px] font-medium text-(--text-main)">{item.name}</p>
              <p className="text-[10px] text-(--text-muted)">{item.why_it_matters}</p>
            </div>
          ))}
        </div>
      )}

      {ingredients.concerns?.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {ingredients.concerns.map((c, i) => (
            <span
              key={i}
              className="rounded-full bg-[#FAEEDA] px-2.5 py-1 text-[10.5px] text-[#854F0B]"
            >
              {c}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- allergens ----
// Three-way status per product: "unknown" (no data at all), "known" + empty
// arrays (confirmed none declared), "known" + populated (real allergens).

function AllergensSection({ allergens }) {
  if (allergens.status === "unknown") {
    return (
      <div>
        <SectionLabel>Allergens</SectionLabel>
        <WarningRow>Allergen information unavailable — not confirmed allergen-free</WarningRow>
      </div>
    );
  }

  const hasContains = allergens.contains?.length > 0;
  const hasMayContain = allergens.may_contain?.length > 0;
  const hasTraces = allergens.traces?.length > 0;

  if (!hasContains && !hasMayContain && !hasTraces) {
    return (
      <div>
        <SectionLabel>Allergens</SectionLabel>
        <EmptyRow>No allergens declared for this product</EmptyRow>
      </div>
    );
  }

  return (
    <div>
      <SectionLabel>Allergens</SectionLabel>

      {hasContains && (
        <div className="mb-1.5 flex flex-wrap gap-1.5">
          {allergens.contains.map((a) => (
            <span key={a} className="rounded-full bg-red-100 px-2.5 py-1 text-[10.5px] font-medium text-red-700">
              {a}
            </span>
          ))}
        </div>
      )}

      {hasMayContain && (
        <div className="mb-1.5 flex flex-wrap gap-1.5">
          {allergens.may_contain.map((a) => (
            <span key={a} className="rounded-full bg-[#FAEEDA] px-2.5 py-1 text-[10.5px] font-medium text-[#854F0B]">
              May contain {a}
            </span>
          ))}
        </div>
      )}

      {hasTraces && (
        <div className="flex flex-wrap gap-1.5">
          {allergens.traces.map((a) => (
            <span key={a} className="rounded-full bg-(--bg-card-subtle) px-2.5 py-1 text-[10.5px] font-medium text-(--text-muted)">
              Trace: {a}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- additives ----
// Compact by default (code + name + concern chip); tap to expand purpose
// and summary. Uses the real human-readable fields the schema provides
// instead of showing bare E-numbers.

function AdditiveRow({ item, expanded, onToggle }) {
  const style = CONCERN_STYLES[item.concern_level] ?? CONCERN_STYLES.unknown;

  return (
    <div className={`rounded-lg px-2.5 py-2 ${style.bg}`}>
      <button
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-2 border-0 bg-transparent p-0 text-left"
      >
        <span className={`text-[11px] ${style.text}`}>
          {item.code} · {item.name}
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          <span className={`rounded-[5px] border px-1.5 py-[1px] text-[9px] capitalize ${style.text} ${style.border}`}>
            {item.concern_level}
          </span>
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            className={`shrink-0 transition-transform ${expanded ? "rotate-180" : ""} ${style.text}`}
          >
            <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      {expanded && (
        <div className="mt-1.5 border-t border-black/10 pt-1.5">
          <p className="text-[10px] leading-relaxed text-(--text-muted)">
            <span className="font-medium">{item.type?.replace(/_/g, " ")}.</span> {item.purpose} {item.summary}
          </p>
        </div>
      )}
    </div>
  );
}

function AdditivesSection({ additives, expandedCode, onToggleExpand }) {
  if (additives.status === "unknown" || additives.count === 0) {
    return null; // genuinely no additives is a quiet non-event, not an empty state
  }

  return (
    <div>
      <SectionLabel>{`Additives (${additives.count})`}</SectionLabel>
      <div className="flex flex-col gap-1.5">
        {additives.items.map((item) => (
          <AdditiveRow
            key={item.code}
            item={item}
            expanded={expandedCode === item.code}
            onToggle={() => onToggleExpand(item.code)}
          />
        ))}
      </div>
    </div>
  );
}

// ---- dietary ----
// Explanation always shown underneath the status word, per spec — the
// sentence is the useful part, the word alone isn't enough.

const DIETARY_ROWS = [
  { field: "vegan", label: "Vegan" },
  { field: "vegetarian", label: "Vegetarian" },
  { field: "gluten_free", label: "Gluten free" },
  { field: "dairy_free", label: "Dairy free" },
  { field: "soy_free", label: "Soy free" },
  { field: "halal", label: "Halal" },
  { field: "kosher", label: "Kosher" },
];

function DietarySection({ dietary }) {
  return (
    <div>
      <SectionLabel>Dietary</SectionLabel>
      <div className="grid grid-cols-2 gap-1.5">
        {DIETARY_ROWS.map((row) => {
          const entry = dietary[row.field];
          if (!entry) return null;
          const style = DIETARY_STYLES[entry.status] ?? DIETARY_STYLES.unknown;
          const muted = entry.status === "unknown";

          return (
            <div key={row.field} className={`rounded-lg px-2.5 py-2 ${style.bg}`}>
              <div className="mb-0.5 flex items-center justify-between">
                <span className={`text-[11px] ${muted ? "text-(--text-muted)" : "text-(--text-main)"}`}>
                  {row.label}
                </span>
                <span className={`text-[10px] font-medium ${style.text}`}>{style.label}</span>
              </div>
              {entry.explanation && (
                <p className="text-[9.5px] leading-snug text-(--text-muted)">
                  {entry.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- sustainability ----

function SustainabilitySection({ sustainability }) {
  const hasStats =
    sustainability.carbon_footprint !== null && sustainability.carbon_footprint !== undefined;
  const hasPalmOil = sustainability.palm_oil && sustainability.palm_oil !== "unknown";
  const isGood = sustainability.status === "good";

  return (
    <div>
      <SectionLabel>Sustainability</SectionLabel>
      <div className={`rounded-lg px-2.5 py-2.5 ${isGood ? "bg-[#EAF3DE]" : "bg-(--bg-card-subtle)"}`}>
        {(hasStats || hasPalmOil) && (
          <div className="mb-1.5 flex gap-4">
            {hasStats && (
              <div>
                <p className={`text-[9px] ${isGood ? "text-[#3B6D11]" : "text-(--text-muted)"}`}>
                  Carbon footprint
                </p>
                <p className={`text-[13px] font-medium ${isGood ? "text-[#173404]" : "text-(--text-main)"}`}>
                  {sustainability.carbon_footprint} {sustainability.carbon_footprint_unit}
                </p>
              </div>
            )}
            {hasPalmOil && (
              <div>
                <p className={`text-[9px] ${isGood ? "text-[#3B6D11]" : "text-(--text-muted)"}`}>
                  Palm oil
                </p>
                <p className={`text-[13px] font-medium capitalize ${isGood ? "text-[#173404]" : "text-(--text-main)"}`}>
                  {sustainability.palm_oil}
                </p>
              </div>
            )}
          </div>
        )}

        {sustainability.summary && (
          <p className={`text-[10.5px] leading-relaxed ${isGood ? "text-[#3B6D11]" : "text-(--text-muted)"}`}>
            {sustainability.summary}
          </p>
        )}
      </div>
    </div>
  );
}

// ---- suitability ----
// Each populated bucket gets its own labeled group so "good for" and
// "potentially good for" read as clearly distinct claims, not one blob.

const SUITABILITY_BUCKETS = [
  { field: "good_for", label: "Good for", tone: "good" },
  { field: "potentially_good_for", label: "Potentially good for", tone: "caution" },
  { field: "caution_for", label: "Caution for", tone: "caution" },
  { field: "avoid_for", label: "Avoid for", tone: "bad" },
];

const CheckIcon = (
  <svg width="12" height="12" viewBox="0 0 13 13" className="mt-[2px] shrink-0 text-[#3B6D11]">
    <path d="M2.5 6.8 5 9.3l5.5-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CrossIcon = (
  <svg width="12" height="12" viewBox="0 0 13 13" className="mt-[2px] shrink-0 text-red-600">
    <path d="M3 3l7 7M10 3l-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const DotIcon = (
  <svg width="8" height="8" viewBox="0 0 8 8" className="mt-[5px] shrink-0 text-[#BA7517]">
    <circle cx="4" cy="4" r="3.5" fill="currentColor" />
  </svg>
);

const BUCKET_ICON = { good: CheckIcon, caution: DotIcon, bad: CrossIcon };
const BUCKET_LABEL_COLOR = {
  good: "text-[#3B6D11]",
  caution: "text-[#854F0B]",
  bad: "text-red-700",
};

function SuitabilitySection({ suitability }) {
  return (
    <div>
      <SectionLabel>Good to know</SectionLabel>
      {suitability.overall && (
        <p className="mb-2 text-[11px] leading-relaxed text-(--text-muted)">
          {suitability.overall}
        </p>
      )}

      <div className="flex flex-col gap-2">
        {SUITABILITY_BUCKETS.map((bucket) => {
          const items = suitability[bucket.field];
          if (!items || items.length === 0) return null;

          return (
            <div key={bucket.field}>
              <p className={`mb-[3px] text-[9.5px] font-semibold uppercase tracking-[0.03em] ${BUCKET_LABEL_COLOR[bucket.tone]}`}>
                {bucket.label}
              </p>
              <div className="flex flex-col gap-[3px]">
                {items.map((item, i) => (
                  <div key={i} className="flex items-start gap-[5px]">
                    {BUCKET_ICON[bucket.tone]}
                    <span className="text-[11px] text-(--text-muted)">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- top-level content stack ----
// Shared by both the desktop modal shell and the mobile full-page shell.
// analysisStatus comes from meta.analysis_status, displayed in the header —
// never re-derived or hardcoded on the frontend.

export function ProductAnalysisContent({ analysisStatus, analysis, onClose, onAddToDashboard }) {
  const {
    product,
    summary,
    nutrition,
    ingredients,
    allergens,
    additives,
    dietary,
    processing,
    scores,
    sustainability,
    suitability,
  } = analysis;

  const [expandedAdditive, setExpandedAdditive] = useState(null);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-(--bg-card)">
      <ProductHeader product={product} analysisStatus={analysisStatus} onClose={onClose} />
      <RatingStrip summary={summary} />
      <ScoreRow scores={scores} processing={processing} />

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
        <NutritionSection nutrition={nutrition} />
        <IngredientsSection ingredients={ingredients} />
        <AllergensSection allergens={allergens} />
        <AdditivesSection
          additives={additives}
          expandedCode={expandedAdditive}
          onToggleExpand={(code) =>
            setExpandedAdditive((cur) => (cur === code ? null : code))
          }
        />
        <DietarySection dietary={dietary} />
        <SustainabilitySection sustainability={sustainability} />
        <SuitabilitySection suitability={suitability} />
      </div>

      <div className="border-t border-black/[0.06] px-4 py-3">
        <button
          onClick={onAddToDashboard}
          className="w-full cursor-pointer rounded-xl bg-(--accent-coral) py-3 text-[14px] font-semibold text-white"
        >
          Add to dashboard
        </button>
      </div>
    </div>
  );
}