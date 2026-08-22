import { useEffect, useState } from "react";

// md breakpoint, matching Tailwind's default (768px) — same pattern as
// ProductAnalysisView, kept consistent rather than reinvented.
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 768
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isDesktop;
}

function StatusRow({ label, status, explanation }) {
  const dotColor =
    status === "yes"
      ? "bg-emerald-500"
      : status === "no"
        ? "bg-red-400"
        : status === "maybe"
          ? "bg-amber-400"
          : "bg-(--text-muted)";

  return (
    <div className="flex items-start gap-2 py-1.5">
      <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${dotColor}`} />
      <div>
        <p className="font-poppins text-[13px] font-medium">{label}</p>
        {explanation && (
          <p className="font-poppins text-[12px] text-(--text-muted)">
            {explanation}
          </p>
        )}
      </div>
    </div>
  );
}

function NutrientLine({ label, value, unit }) {
  if (value === null || value === undefined) return null;
  return (
    <div className="flex items-center justify-between border-b border-black/5 py-1.5 last:border-0">
      <span className="font-poppins text-[13px] text-(--text-main)">
        {label}
      </span>
      <span className="font-poppins text-[13px] font-medium text-(--text-main)">
        {value}
        {unit}
      </span>
    </div>
  );
}

// Shown when scan_status !== "usable" — mirrors InsufficientDataView's role
// (a dead-end state with just a message and a way back) but keyed off the
// food schema's own status/reason fields instead of OFF's analysis_status.
function UnusableScanView({ scanStatus, reason, onClose }) {
  const messages = {
    poor_quality: "That photo's a bit hard to make out — try again with better lighting or a closer shot.",
    not_food: "We couldn't find food in that photo.",
    ambiguous: "This dish is hard to identify confidently from a photo alone.",
    unknown: "We couldn't analyze that photo."
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-(--bg-card) p-8 text-center">
      <p className="font-poppins text-[15px] font-semibold text-(--text-main)">
        {messages[scanStatus] || messages.unknown}
      </p>
      {reason && (
        <p className="font-poppins text-[13px] text-(--text-muted)">
          {reason}
        </p>
      )}
      <button
        onClick={onClose}
        className="mt-2 cursor-pointer rounded-md bg-(--accent-coral) px-6 py-2.5 font-poppins font-medium text-white"
      >
        Try again
      </button>
    </div>
  );
}

function FoodAnalysisContent({ analysis, weightG, onClose, onAddToDashboard }) {
  const { food, recipe, nutrition, ingredients, processing, dietary, allergens, condition, suitability, confidence } = analysis;

  const hasWeight = typeof weightG === "number" && weightG > 0;
  const scaleFactor = hasWeight ? weightG / 100 : 1;
  const scale = (val) => (val === null || val === undefined ? null : Math.round(val * scaleFactor * 10) / 10);

  return (
    <div className="flex max-h-[85vh] flex-1 flex-col overflow-hidden bg-(--bg-card)">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-black/5 p-4">
        <div>
          <p className="font-poppins text-[11px] font-semibold uppercase tracking-wide text-(--accent-coral)">
            {food?.cuisine || "Food"} · {food?.food_type?.replace("_", " ")}
          </p>
          <h2 className="font-poppins text-[19px] font-bold text-(--text-main)">
            {food?.name || "Unknown food"}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="cursor-pointer rounded-full p-1.5 text-(--text-muted) hover:bg-(--bg-card-subtle)"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Confidence banner */}
        {confidence && confidence.overall < 0.6 && (
          <div className="mb-4 rounded-lg bg-amber-50 px-3 py-2">
            <p className="font-poppins text-[12px] text-amber-800">
              This analysis has lower confidence ({Math.round(confidence.overall * 100)}%). {confidence.reason}
            </p>
          </div>
        )}

        {/* Nutrition */}
        {nutrition && (
          <section className="mb-5">
            <p className="mb-2 font-poppins text-[12px] font-semibold uppercase tracking-wide text-(--text-muted)">
              Nutrition {hasWeight ? `(${weightG}g)` : "(per 100g)"}
            </p>
            <NutrientLine label="Calories" value={scale(nutrition.calories_kcal)} unit=" kcal" />
            <NutrientLine label="Protein" value={scale(nutrition.protein_g)} unit="g" />
            <NutrientLine label="Carbohydrates" value={scale(nutrition.carbohydrates_g)} unit="g" />
            <NutrientLine label="Sugars" value={scale(nutrition.sugars_g)} unit="g" />
            <NutrientLine label="Fat" value={scale(nutrition.fat_g)} unit="g" />
            <NutrientLine label="Saturated fat" value={scale(nutrition.saturated_fat_g)} unit="g" />
            <NutrientLine label="Fiber" value={scale(nutrition.fiber_g)} unit="g" />
            <NutrientLine label="Sodium" value={scale(nutrition.sodium_mg)} unit="mg" />
            <NutrientLine label="Cholesterol" value={scale(nutrition.cholesterol_mg)} unit="mg" />
            {!hasWeight && (
              <p className="mt-2 font-poppins text-[11px] italic text-(--text-muted)">
                Enter a weight to log this to your dashboard.
              </p>
            )}
          </section>
        )}

        {/* Main ingredients */}
        {ingredients?.main_ingredients?.length > 0 && (
          <section className="mb-5">
            <p className="mb-2 font-poppins text-[12px] font-semibold uppercase tracking-wide text-(--text-muted)">
              Main ingredients
            </p>
            <p className="font-poppins text-[13px] text-(--text-main)">
              {ingredients.main_ingredients.join(", ")}
            </p>
          </section>
        )}

        {/* Recipe */}
        {recipe && (
          <section className="mb-5">
            <p className="mb-2 font-poppins text-[12px] font-semibold uppercase tracking-wide text-(--text-muted)">
              About this dish
            </p>
            <p className="font-poppins text-[13px] leading-relaxed text-(--text-main)">
              {recipe.description}
            </p>
          </section>
        )}

        {/* Dietary */}
        {dietary && (
          <section className="mb-5">
            <p className="mb-2 font-poppins text-[12px] font-semibold uppercase tracking-wide text-(--text-muted)">
              Dietary
            </p>
            {Object.entries(dietary).map(([key, val]) => (
              <StatusRow
                key={key}
                label={key.replace(/_/g, " ")}
                status={val.status}
                explanation={val.status !== "yes" ? val.explanation : null}
              />
            ))}
          </section>
        )}

        {/* Allergens */}
        {allergens && (allergens.likely_contains?.length > 0 || allergens.potential_allergens?.length > 0) && (
          <section className="mb-5">
            <p className="mb-2 font-poppins text-[12px] font-semibold uppercase tracking-wide text-(--text-muted)">
              Allergens
            </p>
            {allergens.likely_contains?.length > 0 && (
              <p className="font-poppins text-[13px] text-(--text-main)">
                Likely contains: {allergens.likely_contains.join(", ")}
              </p>
            )}
            {allergens.potential_allergens?.length > 0 && (
              <p className="mt-1 font-poppins text-[13px] text-(--text-muted)">
                May contain: {allergens.potential_allergens.join(", ")}
              </p>
            )}
          </section>
        )}

        {/* Processing */}
        {processing && processing.nova_group !== null && (
          <section className="mb-5">
            <p className="mb-2 font-poppins text-[12px] font-semibold uppercase tracking-wide text-(--text-muted)">
              Processing
            </p>
            <p className="font-poppins text-[13px] text-(--text-main)">
              NOVA group {processing.nova_group} — {processing.label}
            </p>
          </section>
        )}

        {/* Condition */}
        {condition?.visible_indicators?.length > 0 && (
          <section className="mb-5">
            <p className="mb-2 font-poppins text-[12px] font-semibold uppercase tracking-wide text-(--text-muted)">
              Visual notes
            </p>
            <p className="font-poppins text-[13px] text-(--text-main)">
              {condition.visible_indicators.join(", ")}
            </p>
          </section>
        )}

        {/* Suitability */}
        {suitability && (
          <section className="mb-2">
            <p className="mb-2 font-poppins text-[12px] font-semibold uppercase tracking-wide text-(--text-muted)">
              Suitability
            </p>
            <p className="font-poppins text-[13px] text-(--text-main)">
              {suitability.overall}
            </p>
            {suitability.avoid_for?.length > 0 && (
              <p className="mt-1 font-poppins text-[12px] text-red-600">
                Avoid for: {suitability.avoid_for.join(", ")}
              </p>
            )}
          </section>
        )}
      </div>

      {/* Footer action */}
      <div className="border-t border-black/5 p-4">
        <button
          onClick={onAddToDashboard}
          disabled={!hasWeight}
          className="w-full cursor-pointer rounded-md bg-(--accent-coral) py-3 font-poppins font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {hasWeight ? "Add to dashboard" : "Enter weight to add"}
        </button>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------
// FoodAnalysisView
//
// New, standalone modal for /home/food-scanner results — NOT a variant of
// ProductAnalysisView, which is OFF-data-specific. Same responsive shell
// pattern (useIsDesktop, fixed overlay, centered-on-desktop /
// full-screen-on-mobile) but its own content underneath, driven by the
// food schema's own meta.scan_status rather than OFF's meta.analysis_status.
//
// Expects `result` shaped as { meta: { scan_status, user_input }, analysis }
// per foodImageAnalysisSchema.js / foodScanner.js's response.
// -----------------------------------------------------------------------
export function FoodAnalysisView({ result, onClose, onAddToDashboard }) {
  const isDesktop = useIsDesktop();

  const scanStatus = result?.meta?.scan_status ?? "unknown";
  const weightG = result?.meta?.user_input?.weight_g ?? null;

  const inner =
    scanStatus !== "usable" ? (
      <UnusableScanView
        scanStatus={scanStatus}
        reason={result?.analysis?.confidence?.reason}
        onClose={onClose}
      />
    ) : (
      <FoodAnalysisContent
        analysis={result.analysis}
        weightG={weightG}
        onClose={onClose}
        onAddToDashboard={onAddToDashboard}
      />
    );

  if (isDesktop) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
        <div className="flex max-h-[85vh] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl shadow-xl">
          {inner}
        </div>
      </div>
    );
  }

  return <div className="fixed inset-0 z-50 flex flex-col">{inner}</div>;
}