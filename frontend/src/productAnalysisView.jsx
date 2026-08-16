import { useEffect, useState } from "react";
import { ProductAnalysisContent } from "./productAnalysisContent.jsx";
import { InsufficientDataView } from "./insufficientDataView.jsx";

// md breakpoint, matching Tailwind's default (768px)
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
 
export function ProductAnalysisView({ result, onClose, onAddToDashboard }) {
  const isDesktop = useIsDesktop();
 
  const inner =
    result.meta.analysis_status === "insufficient_data" ? (
      <InsufficientDataView onClose={onClose} />
    ) : (
      <ProductAnalysisContent
        analysis={result.analysis}
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
