import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";



const RING_COLORS = {
  calories: "#10b981", 
  protein: "#10b981", 
  fats: "#10b981", 
  carbs: "#10b981", 
};

const OVER_TARGET_COLOR = "#ef4444"; 

function safeNumber(n) {
  return typeof n === "number" && !Number.isNaN(n) ? n : 0;
}

function RingCard({ label, unit, logged, target, color }) {
  const loggedSafe = safeNumber(logged);
  const targetSafe = safeNumber(target);

  const remaining = targetSafe - loggedSafe;
  const remainingLabel =
    remaining >= 0
      ? `${Math.round(remaining)}${unit}`
      : `${Math.round(Math.abs(remaining))}${unit} over`;

  const rawPercent = targetSafe > 0 ? (loggedSafe / targetSafe) * 100 : 0;
  const displayPercent = Math.min(100, Math.max(0, rawPercent));
  const isOverTarget = rawPercent > 100;
  const ringColor = isOverTarget ? OVER_TARGET_COLOR : color;

  return (
    <div
      className="
        relative flex h-full w-full flex-col justify-center rounded-2xl
        border border-gray-100 bg-[#f0f5f2] shadow-[0_0_15px_rgba(0,0,0,0.7)] shadow-[#A0BFAC] p-3
        
        @xs:flex-row @xs:items-center @xs:justify-between @xs:p-4
      "
    >
     
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 pr-16 @xs:pr-2">
        <span className="text-[10px] font-inter font-semibold leading-snug tracking-wide text-gray-700 @xs:text-xs">
          {label.toUpperCase()} PROGRESS
        </span>
        <div className="flex flex-wrap items-baseline gap-x-1">
          <span className="text-lg font-bold leading-tight text-gray-700 @xs:text-2xl">
            {remainingLabel}
          </span>
          {remaining >= 0 && (
            <span className="text-[11px] font-nunito font-medium text-gray-400 @xs:text-sm">
              remaining
            </span>
          )}
        </div>
        <span className="text-[10px] font-nunito leading-snug text-gray-400 @xs:text-xs">
          Logged: {Math.round(loggedSafe)} / {Math.round(targetSafe)}
          {unit}
        </span>
      </div>

      
      <div
        className="
          absolute bottom-3 right-3 h-14 w-14
          @xs:static @xs:bottom-auto @xs:right-auto @xs:ml-2 @xs:h-16 @xs:w-16 @xs:shrink-0
          @sm:h-20 @sm:w-20
        "
      >
        <CircularProgressbar
          value={displayPercent}
          text={`${Math.round(rawPercent)}%`}
          styles={buildStyles({
            pathColor: ringColor,
            trailColor: "#e5e7eb",
            textColor: "#111827",
            textSize: "22px",
            strokeLinecap: "round",
            pathTransitionDuration: 0.6,
          })}
        />
      </div>
    </div>
  );
}

export default function NutritionProgress({
  userData,

  columnsOnLarge = 2,
}) {

  const {
    totalDailyCalories,
    totalDailyCarbs,
    totalDailyFats,
    totalDailyProteins,
    dailyTargetCalories,
    dailyTargetProteins,
    dailyTargetCarbs,
    dailyTargetFats,
  } = userData || {};


  const largeColsClass =
    columnsOnLarge === 4 ? "@lg:grid-cols-4" : "@lg:grid-cols-2";

  const rings = [
    {
      key: "calories",
      label: "Calories",
      unit: "",
      logged: totalDailyCalories,
      target: dailyTargetCalories,
      color: RING_COLORS.calories,
    },
    {
      key: "protein",
      label: "Protein",
      unit: "g",
      logged: totalDailyProteins,
      target: dailyTargetProteins,
      color: RING_COLORS.protein,
    },
    {
      key: "fats",
      label: "Fats",
      unit: "g",
      logged: totalDailyFats,
      target: dailyTargetFats,
      color: RING_COLORS.fats,
    },
    {
      key: "carbs",
      label: "Carbs",
      unit: "g",
      logged: totalDailyCarbs,
      target: dailyTargetCarbs,
      color: RING_COLORS.carbs,
    },
  ];

  return (
    <div className="@container w-full">
      <div className={`grid grid-cols-2 gap-3 @lg:gap-4 ${largeColsClass}`}>
        {rings.map((ring) => (
          <div
            key={ring.key}
            className="@container min-h-32 @xs:min-h-0"
          >
            <RingCard
              label={ring.label}
              unit={ring.unit}
              logged={ring.logged}
              target={ring.target}
              color={ring.color}
            />
          </div>
        ))}
      </div>
    </div>
  );
}