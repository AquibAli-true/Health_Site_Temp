import {
  RATING_STYLES,
  DIETARY_STYLES,
  CONCERN_STYLES,
  GRADE_STYLES,
} from "./statusColors.js";

// ---- small shared bits ----

function SectionLabel({ children, tag }) {
  return (
    <div className="mb-1.5 flex items-center gap-2">
      <p className="text-[13px] font-semibold text-(--text-main)">
        {children}
      </p>
      {tag && (
        <span className="rounded-md bg-(--bg-card-subtle) px-[7px] py-[2px] text-[10.5px] text-(--text-muted)">
          {tag}
        </span>
      )}
    </div>
  );
}
 
function EmptyRow({ children }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-(--bg-card-subtle) px-3 py-2.5">
      <svg width="16" height="16" viewBox="0 0 16 16" className="shrink-0 text-(--text-muted)">
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8 7.2v3.6M8 5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      <p className="text-[12.5px] text-(--text-muted)">{children}</p>
    </div>
  );
}
 
function WarningRow({ children }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2.5">
      <svg width="16" height="16" viewBox="0 0 16 16" className="shrink-0 text-amber-600">
        <path
          d="M8 1.5 15 14H1L8 1.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path d="M8 6.5v3M8 11.5v.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      <p className="text-[12.5px] text-amber-800">{children}</p>
    </div>
  );
}
 
// ---- header ----
 
function ProductHeader({ product, onClose }) {
  return (
    <div className="flex items-center gap-3 border-b border-black/[0.06] px-4 py-3.5">
      <button
        onClick={onClose}
        aria-label="Close"
        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-(--text-main)"
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path
            d="M14 4 4 14M4 4l10 10"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
 
      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-(--bg-card-subtle)">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-(--text-muted)">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <rect x="2" y="4" width="16" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.3" />
              <circle cx="7" cy="9" r="1.4" fill="currentColor" />
              <path d="m3 15 4.5-4.5L11 14l3-3.5 3 3.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </div>
        )}
      </div>
 
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-(--text-main)">
          {product.name || "Unnamed product"}
        </p>
        {product.brand && (
          <p className="truncate text-[12.5px] text-(--text-muted)">
            {product.brand}
          </p>
        )}
      </div>
    </div>
  );
}
 
// ---- rating strip ----
 
function RatingStrip({ summary }) {
  const style = RATING_STYLES[summary.overall_rating] ?? RATING_STYLES.unknown;
 
  return (
    <div className="flex items-center gap-2 border-b border-black/[0.06] px-4 py-3">
      <span
        className={`shrink-0 rounded-md px-2.5 py-[3px] text-[11px] font-semibold ${style.bg} ${style.text}`}
      >
        {style.label}
      </span>
      <p className="text-[12.5px] text-(--text-muted)">{summary.headline}</p>
    </div>
  );
}
 
// ---- nutrition ----
 
const NUTRIENT_FIELDS = [
  { key: "calories_g_alias", field: "calories", label: "Calories", unit: "kcal" },
  { field: "protein_g", label: "Protein", unit: "g" },
  { field: "carbohydrates_g", label: "Carbs", unit: "g" },
  { field: "sugars_g", label: "Sugar", unit: "g" },
  { field: "fat_g", label: "Fat", unit: "g" },
  { field: "saturated_fat_g", label: "Saturated fat", unit: "g" },
  { field: "fiber_g", label: "Fiber", unit: "g" },
  { field: "salt_g", label: "Salt", unit: "g" },
];
 
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
 
  return (
    <div>
      <SectionLabel tag={nutrition.status === "partial" ? "Partial" : null}>
        Nutrition
        <span className="ml-1 font-normal text-(--text-muted)">
          per {nutrition.per || "100g"}
        </span>
      </SectionLabel>
 
      <div className="grid grid-cols-2 gap-2">
        {present.map((n) => (
          <div key={n.field} className="rounded-lg bg-(--bg-card-subtle) px-3 py-2.5">
            <p className="mb-0.5 text-[11px] text-(--text-muted)">{n.label}</p>
            <p className="text-[15px] font-semibold text-(--text-main)">
              {nutrition[n.field]} {n.unit}
            </p>
          </div>
        ))}
      </div>
 
      {missing.length > 0 && (
        <p className="mt-1.5 text-[11px] text-(--text-muted)">
          {missing.map((n) => n.label).join(", ")} not reported for this product
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
        <p className="mb-2 text-[12.5px] leading-relaxed text-(--text-muted)">
          {ingredients.cleaned_ingredient_text}
        </p>
      )}
 
      {ingredients.notable_ingredients?.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {ingredients.notable_ingredients.map((item, i) => (
            <div key={i} className="rounded-lg bg-(--bg-card-subtle) px-3 py-2">
              <p className="text-[12.5px] font-medium text-(--text-main)">
                {item.name}
              </p>
              <p className="text-[11.5px] text-(--text-muted)">
                {item.why_it_matters}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
 
// ---- allergens ----
 
function AllergensSection({ allergens }) {
  if (allergens.status === "unknown") {
    return (
      <div>
        <SectionLabel>Allergens</SectionLabel>
        <WarningRow>
          Allergen information unavailable — not confirmed allergen-free
        </WarningRow>
      </div>
    );
  }
 
  const hasAny =
    allergens.contains?.length > 0 ||
    allergens.may_contain?.length > 0 ||
    allergens.traces?.length > 0;
 
  if (!hasAny) {
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
 
      {allergens.contains?.length > 0 && (
        <div className="mb-1.5 flex flex-wrap gap-1.5">
          {allergens.contains.map((a) => (
            <span
              key={a}
              className="rounded-full bg-red-50 px-2.5 py-1 text-[11.5px] font-medium text-red-700"
            >
              {a}
            </span>
          ))}
        </div>
      )}
 
      {allergens.may_contain?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {allergens.may_contain.map((a) => (
            <span
              key={a}
              className="rounded-full bg-amber-50 px-2.5 py-1 text-[11.5px] font-medium text-amber-700"
            >
              May contain {a}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
 
// ---- additives ----
 
function AdditivesSection({ additives }) {
  if (additives.status === "unknown" || additives.count === 0) {
    return null; // no additives found is a fine, quiet non-event — no need for an empty-state row
  }
 
  return (
    <div>
      <SectionLabel>{`Additives (${additives.count})`}</SectionLabel>
      <div className="flex flex-wrap gap-1.5">
        {additives.items.map((item) => {
          const style = CONCERN_STYLES[item.concern_level] ?? CONCERN_STYLES.unknown;
          return (
            <span
              key={item.code}
              title={`${item.name} — ${item.purpose}`}
              className={`rounded-full px-2.5 py-1 text-[11.5px] font-medium ${style.bg} ${style.text}`}
            >
              {item.code}
            </span>
          );
        })}
      </div>
    </div>
  );
}
 
// ---- dietary ----
 
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
          return (
            <div
              key={row.field}
              title={entry.explanation}
              className="flex items-center justify-between rounded-lg bg-(--bg-card-subtle) px-2.5 py-2"
            >
              <span
                className={`text-[12px] ${
                  entry.status === "unknown" ? "text-(--text-muted)" : "text-(--text-main)"
                }`}
              >
                {row.label}
              </span>
              <span className={`text-[11px] font-semibold ${style.text}`}>
                {style.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
 
// ---- scores ----
 
function ScoreBadge({ title, score }) {
  if (!score || score.grade === null || score.grade === undefined) return null;
  const style = GRADE_STYLES[score.grade] ?? GRADE_STYLES.e;
 
  return (
    <div className="flex-1 rounded-lg bg-(--bg-card-subtle) px-3 py-2.5">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-[11px] text-(--text-muted)">{title}</p>
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-md text-[13px] font-bold uppercase ${style.bg} ${style.text}`}
        >
          {score.grade}
        </span>
      </div>
      {score.explanation && (
        <p className="text-[11.5px] leading-snug text-(--text-muted)">
          {score.explanation}
        </p>
      )}
    </div>
  );
}
 
function ScoresSection({ scores }) {
  const hasNutri = scores.nutriscore?.grade != null;
  const hasEco = scores.ecoscore?.grade != null;
 
  if (!hasNutri && !hasEco) {
    return (
      <div>
        <SectionLabel>Scores</SectionLabel>
        <EmptyRow>Nutri-Score and Eco-Score unavailable — insufficient data</EmptyRow>
      </div>
    );
  }
 
  return (
    <div>
      <SectionLabel>Scores</SectionLabel>
      <div className="flex gap-2">
        <ScoreBadge title="Nutri-Score" score={scores.nutriscore} />
        <ScoreBadge title="Eco-Score" score={scores.ecoscore} />
      </div>
    </div>
  );
}
 
// ---- suitability ----
 
function SuitabilityList({ items, icon }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="flex flex-col gap-1">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-1.5">
          {icon}
          <span className="text-[12px] text-(--text-muted)">{item}</span>
        </div>
      ))}
    </div>
  );
}
 
const CheckIcon = (
  <svg width="13" height="13" viewBox="0 0 13 13" className="mt-[3px] shrink-0 text-emerald-600">
    <path d="M2.5 6.8 5 9.3l5.5-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CrossIcon = (
  <svg width="13" height="13" viewBox="0 0 13 13" className="mt-[3px] shrink-0 text-red-600">
    <path d="M3 3l7 7M10 3l-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const DotIcon = (
  <svg width="13" height="13" viewBox="0 0 13 13" className="mt-[3px] shrink-0 text-amber-600">
    <circle cx="6.5" cy="6.5" r="3" fill="currentColor" />
  </svg>
);
 
function SuitabilitySection({ suitability }) {
  return (
    <div>
      <SectionLabel>Good to know</SectionLabel>
      <p className="mb-2 text-[12.5px] leading-relaxed text-(--text-muted)">
        {suitability.overall}
      </p>
      <div className="flex flex-col gap-1.5">
        <SuitabilityList items={suitability.good_for} icon={CheckIcon} />
        <SuitabilityList items={suitability.potentially_good_for} icon={DotIcon} />
        <SuitabilityList items={suitability.caution_for} icon={DotIcon} />
        <SuitabilityList items={suitability.avoid_for} icon={CrossIcon} />
      </div>
    </div>
  );
}
 
// ---- top-level content stack ----
// Shared by both the desktop modal shell and the mobile full-page shell.
// onClose is called by the header's X button either way — modal closes it,
// page navigates back.
 
export function ProductAnalysisContent({ analysis, onClose, onAddToDashboard }) {
  const {
    product,
    summary,
    nutrition,
    ingredients,
    allergens,
    additives,
    dietary,
    scores,
    suitability,
  } = analysis;
 
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-(--bg-card)">
      <ProductHeader product={product} onClose={onClose} />
      <RatingStrip summary={summary} />
 
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
        <NutritionSection nutrition={nutrition} />
        <IngredientsSection ingredients={ingredients} />
        <AllergensSection allergens={allergens} />
        <AdditivesSection additives={additives} />
        <DietarySection dietary={dietary} />
        <ScoresSection scores={scores} />
        <SuitabilitySection suitability={suitability} />
      </div>
 
      <div className="border-t border-black/[0.06] px-4 py-3.5">
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
