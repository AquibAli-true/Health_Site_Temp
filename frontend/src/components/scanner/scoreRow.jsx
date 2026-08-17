import { GRADE_STYLES, NOVA_STYLES } from "./statusColors.js";

function ScoreCell({ label, children, style }) {
  return (
    <div className={`rounded-[10px] px-2 py-2 text-center ${style.bg}`}>
      <p className={`mb-[3px] text-[9.5px] font-medium ${style.label ?? style.text}`}>
        {label}
      </p>
      {children}
    </div>
  );
}

const EMPTY_STYLE = { bg: "bg-(--bg-card-subtle)", text: "text-(--text-muted)", label: "text-(--text-muted)" };

function GradeCell({ label, grade, fallbackText }) {
  const hasGrade = grade !== null && grade !== undefined;
  const style = hasGrade ? (GRADE_STYLES[grade] ?? GRADE_STYLES.e) : EMPTY_STYLE;

  return (
    <ScoreCell label={label} style={style}>
      {hasGrade ? (
        <p className={`text-[20px] font-semibold uppercase ${style.text}`}>
          {grade}
        </p>
      ) : (
        <p className="text-[10.5px] leading-snug text-(--text-muted)">
          {fallbackText || "Not enough data"}
        </p>
      )}
    </ScoreCell>
  );
}

export function ScoreRow({ scores, processing }) {
  const novaGroup = processing?.nova_group;
  const hasNova = novaGroup !== null && novaGroup !== undefined;
  const novaStyle = hasNova ? (NOVA_STYLES[novaGroup] ?? GRADE_STYLES.e) : EMPTY_STYLE;

  return (
    <div className="grid grid-cols-3 gap-1.5 border-b border-black/[0.06] px-4 py-3">
      <GradeCell
        label="Nutri-score"
        grade={scores.nutriscore?.grade}
        fallbackText={scores.nutriscore?.explanation}
      />

      <GradeCell
        label="Eco-score"
        grade={scores.ecoscore?.grade}
        fallbackText={scores.ecoscore?.explanation}
      />

      <ScoreCell label="Nova group" style={novaStyle}>
        {hasNova ? (
          <p className={`text-[20px] font-semibold ${novaStyle.text}`}>
            {novaGroup}
          </p>
        ) : (
          <p className="text-[10px] leading-snug text-(--text-muted)">
            {processing?.label || "Not enough data"}
          </p>
        )}
      </ScoreCell>
    </div>
  );
}