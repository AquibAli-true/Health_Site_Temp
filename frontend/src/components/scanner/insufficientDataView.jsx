export function InsufficientDataView({ onClose }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-(--bg-card)">
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
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
          <svg width="24" height="24" viewBox="0 0 24 24" className="text-amber-600">
            <path
              d="M12 3 22 20H2L12 3Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M12 10v4M12 17v.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <p className="text-[16px] font-semibold text-(--text-main)">
          Insufficient data
        </p>
        <p className="max-w-[260px] text-[13px] leading-relaxed text-(--text-muted)">
          This product doesn't have enough information on Open Food Facts to
          show a reliable analysis.
        </p>

        <button
          onClick={onClose}
          className="mt-2 cursor-pointer rounded-xl bg-(--bg-card-subtle) px-4 py-2 text-[13px] font-medium text-(--text-main)"
        >
          Scan another product
        </button>
      </div>
    </div>
  );
}