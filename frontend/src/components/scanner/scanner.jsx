import { useState, useEffect } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { ProductAnalysisView } from "./productAnalysisView.jsx";
import FoodScanner from "./foodScanner.jsx";
import { FoodAnalysisView } from "./foodAnalysisView.jsx";

const Scanner = () => {
  const [mode, setMode] = useState(null); // null | "barcode" | "food"
  const [barcodeValue, setBarcodeValue] = useState(null);
  const [error, setError] = useState(null);

  // analysisState: "idle" | "loading" | "success" | "error"
  // Shared shape for both barcode and food.
  const [analysisState, setAnalysisState] = useState("idle");
  const [analysisResult, setAnalysisResult] = useState(null);

  const [scannerActive, setScannerActive] = useState(false);
  const readerId = "barcode-reader";

  // ------------------------------------------------------------
  // Barcode camera: starts only when the user presses Start scanning.
  // ------------------------------------------------------------
useEffect(() => {
  if (mode !== "barcode" || !scannerActive) return;

  const html5Qrcode = new Html5Qrcode(readerId, {
    formatsToSupport: [
      Html5QrcodeSupportedFormats.EAN_13,
      Html5QrcodeSupportedFormats.EAN_8,
      Html5QrcodeSupportedFormats.UPC_A,
      Html5QrcodeSupportedFormats.UPC_E,
      Html5QrcodeSupportedFormats.CODE_128,
      Html5QrcodeSupportedFormats.CODE_39,
      Html5QrcodeSupportedFormats.ITF,
    ],
  });

  let cancelled = false;
  let decoded = false;

  const startPromise = html5Qrcode
    .start(
      { facingMode: "environment" },
      {
        fps: 15,
        disableFlip: true,
      },
      (decodedText) => {
        if (cancelled || decoded) return;

        decoded = true;
        setBarcodeValue(decodedText);
        setScannerActive(false);
      },
      () => {
        // An undecodable video frame is normal; keep scanning.
      }
    )
    .catch((err) => {
      if (cancelled) return;

      setError(
        `Camera failed to start: ${err?.message || String(err)}`
      );
      setScannerActive(false);
    });

  return () => {
    cancelled = true;

    startPromise.then(async () => {
      try {
        if (html5Qrcode.isScanning) {
          await html5Qrcode.stop();
        }
      } catch {
        // Scanner may already be stopped.
      }

      try {
        html5Qrcode.clear();
      } catch {
        // Reader element may already be removed.
      }
    });
  };
}, [mode, scannerActive]);

  // ------------------------------------------------------------
  // Barcode analysis
  // ------------------------------------------------------------

  useEffect(() => {
    if (!barcodeValue) return;

    let cancelled = false;

    async function analyze() {
      setAnalysisState("loading");
      setAnalysisResult(null);

      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER}/home/barcode-scanner`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ barcodeValue }),
          }
        );

        const responseText = await res.text();
        let data;

        try {
          data = JSON.parse(responseText);
        } catch {
          if (!res.ok) {
            const bodyPreview = responseText
              .replace(/<[^>]*>/g, " ")
              .replace(/\s+/g, " ")
              .trim()
              .slice(0, 250);

            throw new Error(
              bodyPreview
                ? `Barcode request failed (HTTP ${res.status}): ${bodyPreview}`
                : `Barcode request failed (HTTP ${res.status}): the server returned an empty response.`
            );
          }

          throw new Error(
            "The server returned an invalid response instead of JSON."
          );
        }

        if (!res.ok) {
          const message = data?.message || "Barcode request failed";
          const detail = data?.error;

          throw new Error(
            `${message} (HTTP ${res.status})${detail ? `: ${detail}` : ""}`
          );
        }

        if (!cancelled) {
          setAnalysisResult(data);
          setAnalysisState("success");
        }
      } catch (err) {
        console.error("Barcode analysis failed:", err);

        if (!cancelled) {
          setAnalysisState("error");
          setError(
            err instanceof TypeError && err.message === "Failed to fetch"
              ? "Could not reach the barcode analysis server. The backend may be offline, or the request may be blocked by CORS."
              : err?.message || "Barcode analysis failed for an unknown reason."
          );
        }
      }
    }

    analyze();

    return () => {
      cancelled = true;
    };
  }, [barcodeValue]);

  // ------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------

  const stopScanner = () => {
    // The camera effect's cleanup stops the Html5Qrcode instance.
    setScannerActive(false);
  };

  const reset = () => {
    stopScanner();

    setMode(null);
    setBarcodeValue(null);
    setError(null);
    setAnalysisState("idle");
    setAnalysisResult(null);
  };

  const handleAddToDashboard = () => {
    // Wired up later.
  };

  // FoodScanner performs its own food-analysis request and returns
  // the parsed result here.
  const handleFoodAnalysisComplete = (data) => {
    setAnalysisResult(data);
    setAnalysisState("success");
    setError(null);
  };

  const handleFoodAnalysisError = (err) => {
    console.error("Food analysis failed:", err);

    setAnalysisState("error");
    setError(
      err?.message || "Something went wrong analyzing this photo."
    );
  };

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-(--bg-main) p-4">
      {/* Scan selection screen */}
      {mode === null && (
        <div className="mx-auto max-w-[380px] rounded-[22px] bg-(--bg-card) p-[14px]">
          <div className="rounded-2xl bg-(--bg-main) px-5 pb-[26px] pt-[30px] font-poppins text-(--text-main)">
            <h2 className="absolute m-[-1px] h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]">
              Scan screen mockup: choose to scan a barcode or take a food photo
              to log a meal
            </h2>

            <p className="mb-1.5 text-[12px] font-semibold tracking-[0.08em] text-(--accent-coral)">
              Scan
            </p>

            <h1 className="mb-[22px] text-[23px] font-extrabold leading-[1.25] tracking-[-0.01em]">
              What are you logging?
            </h1>

            {/* Barcode */}
            <button
              onClick={() => {
                setError(null);
                setBarcodeValue(null);
                setAnalysisState("idle");
                setAnalysisResult(null);
                setScannerActive(false);
                setMode("barcode");
              }}
              className="mb-3 flex w-full cursor-pointer items-center gap-[14px] rounded-2xl border-0 bg-(--bg-card-subtle) p-4 text-left font-inherit"
            >
              <div className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-(--bg-main)">
                <svg width="32" height="32" viewBox="0 0 34 34">
                  <rect
                    x="2"
                    y="4"
                    width="2"
                    height="26"
                    fill="#1F2A24"
                    opacity="0.55"
                  />
                  <rect
                    x="6"
                    y="4"
                    width="1"
                    height="26"
                    fill="#1F2A24"
                    opacity="0.4"
                  />
                  <rect
                    x="9"
                    y="4"
                    width="3"
                    height="26"
                    fill="#1F2A24"
                    opacity="0.6"
                  />
                  <rect
                    x="14"
                    y="4"
                    width="1"
                    height="26"
                    fill="#1F2A24"
                    opacity="0.35"
                  />
                  <rect
                    x="17"
                    y="4"
                    width="2"
                    height="26"
                    fill="#1F2A24"
                    opacity="0.55"
                  />
                  <rect
                    x="21"
                    y="4"
                    width="1"
                    height="26"
                    fill="#1F2A24"
                    opacity="0.4"
                  />
                  <rect
                    x="24"
                    y="4"
                    width="3"
                    height="26"
                    fill="#1F2A24"
                    opacity="0.6"
                  />
                  <rect
                    x="29"
                    y="4"
                    width="1"
                    height="26"
                    fill="#1F2A24"
                    opacity="0.4"
                  />
                </svg>

                <div className="absolute left-1 right-1 top-1 h-0.5 animate-[scanSweep_2.4s_ease-in-out_infinite] bg-(--accent-coral)" />
              </div>

              <div>
                <p className="mb-0.5 text-[15px] font-semibold">
                  Scan barcode
                </p>

                <p className="text-[12.5px] text-(--text-muted)">
                  Packaged food with a label
                </p>
              </div>
            </button>

            {/* Food */}
            <button
              onClick={() => setMode("food")}
              className="flex w-full cursor-pointer items-center gap-[14px] rounded-2xl border-0 bg-(--bg-card-subtle) p-4 text-left font-inherit"
            >
              <div className="h-[52px] w-[52px] shrink-0 rounded-xl bg-(--bg-main)">
                <svg
                  width="52"
                  height="52"
                  viewBox="0 0 56 56"
                  className="animate-[framePulse_2.4s_ease-in-out_infinite]"
                >
                  <path
                    d="M14 16v-2a4 4 0 0 1 4-4h2"
                    stroke="#E8735C"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />

                  <path
                    d="M42 16v-2a4 4 0 0 0-4-4h-2"
                    stroke="#E8735C"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />

                  <path
                    d="M14 40v2a4 4 0 0 0 4 4h2"
                    stroke="#E8735C"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />

                  <path
                    d="M42 40v2a4 4 0 0 1-4 4h-2"
                    stroke="#E8735C"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />

                  <circle
                    cx="28"
                    cy="28"
                    r="7"
                    fill="none"
                    stroke="#1F2A24"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                </svg>
              </div>

              <div>
                <p className="mb-0.5 text-[15px] font-semibold">
                  Scan food
                </p>

                <p className="text-[12.5px] text-(--text-muted)">
                  Homemade and plated meals
                </p>
              </div>
            </button>

            <p className="mt-[18px] text-center text-[12px] text-(--text-muted)">
              Point your camera and we'll do the rest.
            </p>
          </div>
        </div>
      )}

      {/* Barcode scanner */}
      {mode === "barcode" && !barcodeValue && (
        <div className="flex w-full max-w-sm flex-col items-center gap-3">
          <div
            id={readerId}
            className="w-full overflow-hidden rounded-md border border-black/10"
          />

          <p className="font-poppins text-sm text-(--text-muted)">
            {scannerActive
              ? "Point your camera at the barcode."
              : "Press Start scanning to open your camera."}
          </p>

          <button
            onClick={() => {
              if (scannerActive) {
                stopScanner();
              } else {
                setError(null);
                setScannerActive(true);
              }
            }}
            className="cursor-pointer rounded-md bg-(--accent-coral) px-4 py-2 font-poppins font-medium text-white"
          >
            {scannerActive ? "Stop scanning" : "Start scanning"}
          </button>

          {error && (
            <p className="font-poppins text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            onClick={reset}
            className="cursor-pointer font-poppins text-sm underline"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Barcode loading */}
      {mode === "barcode" &&
        barcodeValue &&
        analysisState === "loading" && (
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-(--bg-card-subtle) border-t-(--accent-coral)" />

            <p className="font-poppins text-sm text-(--text-muted)">
              Analyzing product…
            </p>
          </div>
        )}

      {/* Barcode error */}
      {mode === "barcode" &&
        barcodeValue &&
        analysisState === "error" && (
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="font-poppins text-sm text-red-600">
              {error || "Something went wrong analyzing this product."}
            </p>

            <button
              onClick={reset}
              className="cursor-pointer rounded-md bg-(--accent-coral) p-2 font-poppins font-medium text-white"
            >
              Try again
            </button>
          </div>
        )}

      {/* Food scanner */}
      {mode === "food" && analysisState !== "success" && (
        <FoodScanner
          onAnalysisComplete={handleFoodAnalysisComplete}
          onError={handleFoodAnalysisError}
          onCancel={reset}
        />
      )}

      {/* Barcode result */}
      {mode === "barcode" &&
        analysisState === "success" &&
        analysisResult && (
          <ProductAnalysisView
            result={analysisResult}
            onClose={reset}
            onAddToDashboard={handleAddToDashboard}
          />
        )}

      {/* Food result */}
      {mode === "food" &&
        analysisState === "success" &&
        analysisResult && (
          <FoodAnalysisView
            result={analysisResult}
            onClose={reset}
            onAddToDashboard={handleAddToDashboard}
          />
        )}
    </div>
  );
};

export default Scanner;
