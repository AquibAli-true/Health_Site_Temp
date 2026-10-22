import { useState, useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { ProductAnalysisView } from "./productAnalysisView.jsx";
import FoodScanner from "./foodScanner.jsx";
import { FoodAnalysisView } from "./foodAnalysisView.jsx";

// ------------------------------------------------------------
// Flow
//   menu  -> tap "Scan barcode" -> camera starts immediately
//         -> first successful decode stops the camera
//         -> POST to the server -> result view
//   menu  -> tap "Scan food"    -> FoodScanner (does its own request)
//
// analysisState: "idle" | "loading" | "success" | "error"
//   - barcode mode + "idle" means "camera should be running"
//   - food mode    + "idle" means "FoodScanner should be mounted"
// ------------------------------------------------------------

const READER_ID = "barcode-reader";
const API_BASE = (import.meta.env.VITE_SERVER || "").replace(/\/+$/, "");

// Packaged food only uses EAN/UPC. Fewer formats = faster frames, fewer misreads.
const BARCODE_FORMATS = [
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
];

// Wide, short strip: 1D barcodes only need a horizontal scan line.
const getScanBox = (viewfinderWidth, viewfinderHeight) => {
  const width = Math.max(50, Math.floor(viewfinderWidth * 0.9));
  const height = Math.max(
    50,
    Math.floor(Math.min(viewfinderHeight * 0.45, width * 0.5))
  );
  return { width, height };
};

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function describeCameraError(err) {
  const raw = typeof err === "string" ? err : err?.message || "";
  const name = err?.name || "";

  if (!window.isSecureContext) {
    return "The camera only works over HTTPS (or localhost). Open the app through a secure URL.";
  }
  if (name === "NotAllowedError" || /permission|denied|notallowed/i.test(raw)) {
    return "Camera permission was denied. Allow camera access in your browser settings, then try again.";
  }
  if (name === "NotFoundError" || /notfound|no camera/i.test(raw)) {
    return "No camera was found on this device.";
  }
  if (name === "NotReadableError" || /notreadable|in use/i.test(raw)) {
    return "The camera is being used by another app or tab. Close it and try again.";
  }
  return `Camera failed to start${raw ? `: ${raw}` : "."}`;
}

// Best effort: continuous autofocus makes close-up barcodes decode far faster.
// Done on the track directly because html5-qrcode validates videoConstraints
// keys and may reject `advanced`.
async function enableContinuousFocus(videoEl) {
  try {
    const track = videoEl?.srcObject?.getVideoTracks?.()[0];
    const capabilities = track?.getCapabilities?.();
    if (capabilities?.focusMode?.includes("continuous")) {
      await track.applyConstraints({ advanced: [{ focusMode: "continuous" }] });
    }
  } catch {
    // Unsupported on this device; scanning still works.
  }
}

// Never rejects. Also releases the camera tracks directly so the camera
// light can't stay on if stop() throws.
async function shutDownScanner(scanner, videoEl) {
  try {
    await scanner.stop();
  } catch {
    // Not running (failed to start, or already stopped).
  }
  try {
    scanner.clear();
  } catch {
    // Reader element may already be gone.
  }
  try {
    videoEl?.srcObject?.getTracks().forEach((track) => track.stop());
  } catch {
    // Already released.
  }
}

async function postBarcode(barcodeValue, signal) {
  const res = await fetch(`${API_BASE}/home/barcode-scanner`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ barcodeValue }),
    signal,
  });

  const text = await res.text();
  let data = null;
  let isJson = false;

  try {
    data = JSON.parse(text);
    isJson = true;
  } catch {
    // Not JSON; handled below.
  }

  if (!res.ok) {
    if (isJson) {
      const message = data?.message || "Barcode request failed";
      const detail = data?.error;
      throw new Error(
        `${message} (HTTP ${res.status})${detail ? `: ${detail}` : ""}`
      );
    }

    const preview = text
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 250);

    throw new Error(
      preview
        ? `Barcode request failed (HTTP ${res.status}): ${preview}`
        : `Barcode request failed (HTTP ${res.status}): the server returned an empty response.`
    );
  }

  if (!isJson) {
    throw new Error("The server returned an invalid response instead of JSON.");
  }

  return data;
}

// ------------------------------------------------------------
// Small presentational pieces
// ------------------------------------------------------------

const BARS = [
  [2, 2, 0.55],
  [6, 1, 0.4],
  [9, 3, 0.6],
  [14, 1, 0.35],
  [17, 2, 0.55],
  [21, 1, 0.4],
  [24, 3, 0.6],
  [29, 1, 0.4],
];

function BarcodeIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 34 34" aria-hidden="true">
      {BARS.map(([x, width, opacity]) => (
        <rect
          key={x}
          x={x}
          y="4"
          width={width}
          height="26"
          fill="#1F2A24"
          opacity={opacity}
        />
      ))}
    </svg>
  );
}

const FRAME_CORNERS = [
  "M14 16v-2a4 4 0 0 1 4-4h2",
  "M42 16v-2a4 4 0 0 0-4-4h-2",
  "M14 40v2a4 4 0 0 0 4 4h2",
  "M42 40v2a4 4 0 0 1-4 4h-2",
];

function FrameIcon() {
  return (
    <svg
      width="52"
      height="52"
      viewBox="0 0 56 56"
      className="animate-[framePulse_2.4s_ease-in-out_infinite]"
      aria-hidden="true"
    >
      {FRAME_CORNERS.map((d) => (
        <path
          key={d}
          d={d}
          stroke="#E8735C"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      ))}
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
  );
}

function ErrorPanel({ message, onRetry, onCancel }) {
  return (
    <div
      role="alert"
      className="flex max-w-sm flex-col items-center gap-3 text-center"
    >
      <p className="font-poppins text-sm text-red-600">{message}</p>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer rounded-md bg-(--accent-coral) px-4 py-2 font-poppins font-medium text-white"
        >
          Try again
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer font-poppins text-sm underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

const MODE_CARD_CLASS =
  "flex w-full cursor-pointer items-center gap-[14px] rounded-2xl border-0 bg-(--bg-card-subtle) p-4 text-left";

// ------------------------------------------------------------
// Scanner
// ------------------------------------------------------------

const Scanner = () => {
  const [mode, setMode] = useState(null); // null | "barcode" | "food"
  const [barcodeValue, setBarcodeValue] = useState(null);
  const [analysisState, setAnalysisState] = useState("idle");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);

  // Each camera teardown is chained here so the next camera start always
  // waits for the previous one to fully stop (prevents two Html5Qrcode
  // instances fighting over the same #barcode-reader element).
  const teardownRef = useRef(Promise.resolve());

  const isScanning = mode === "barcode" && analysisState === "idle";

  // ------------------------------------------------------------
  // Camera: runs while isScanning is true, stops the moment it turns false
  // (successful scan, error, cancel, or leaving the page).
  // ------------------------------------------------------------
  useEffect(() => {
    if (!isScanning) return;

    let cancelled = false;
    let scanner = null;
    let videoEl = null;

    setCameraReady(false);

    const run = teardownRef.current.then(async () => {
      if (cancelled) return;

      try {
        scanner = new Html5Qrcode(READER_ID, {
          formatsToSupport: BARCODE_FORMATS,
          // Native BarcodeDetector where available (Chrome/Android);
          // falls back to the JS decoder elsewhere.
          experimentalFeatures: { useBarCodeDetectorIfSupported: true },
          verbose: false,
        });

        let decoded = false;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            disableFlip: true,
            qrbox: getScanBox,
            videoConstraints: {
              facingMode: "environment",
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          },
          (decodedText) => {
            if (cancelled || decoded) return;
            decoded = true;

            // Set both together so there is no blank frame between
            // "camera closed" and "analyzing".
            setBarcodeValue(decodedText);
            setAnalysisState("loading");
          },
          () => {
            // An undecodable frame is normal; keep scanning.
          }
        );

        videoEl = document.querySelector(`#${READER_ID} video`);

        if (cancelled) return;

        setCameraReady(true);
        enableContinuousFocus(videoEl);
      } catch (err) {
        if (cancelled) return;

        console.error("Camera failed to start:", err);
        setError(describeCameraError(err));
        setAnalysisState("error");
      }
    });

    return () => {
      cancelled = true;
      teardownRef.current = run.then(() =>
        scanner ? shutDownScanner(scanner, videoEl) : undefined
      );
    };
  }, [isScanning]);

  // ------------------------------------------------------------
  // Barcode analysis: runs once per decoded barcode.
  // ------------------------------------------------------------
  useEffect(() => {
    if (!barcodeValue) return;

    if (!API_BASE) {
      setError(
        "VITE_SERVER is not set, so the app doesn't know where the barcode server is."
      );
      setAnalysisState("error");
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        const data = await postBarcode(barcodeValue, controller.signal);

        setAnalysisResult(data);
        setAnalysisState("success");
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error("Barcode analysis failed:", err);

        setError(
          err instanceof TypeError && err.message === "Failed to fetch"
            ? "Could not reach the barcode analysis server. The backend may be offline, or the request may be blocked by CORS."
            : err?.message || "Barcode analysis failed for an unknown reason."
        );
        setAnalysisState("error");
      }
    })();

    return () => controller.abort();
  }, [barcodeValue]);

  // ------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------

  // Back to a clean "ready" state for the current mode. For barcode mode
  // this restarts the camera; for food mode it remounts FoodScanner.
  const clearAnalysis = () => {
    setBarcodeValue(null);
    setAnalysisResult(null);
    setAnalysisState("idle");
    setError(null);
  };

  const selectMode = (nextMode) => {
    clearAnalysis();
    setMode(nextMode);
  };

  const reset = () => {
    clearAnalysis();
    setMode(null);
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

    setError(err?.message || "Something went wrong analyzing this photo.");
    setAnalysisState("error");
  };

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-(--bg-main) p-4">
      {/* Mode selection */}
      {mode === null && (
        <div className="mx-auto max-w-[380px] rounded-[22px] bg-(--bg-card) p-[14px]">
          <div className="rounded-2xl bg-(--bg-main) px-5 pb-[26px] pt-[30px] font-poppins text-(--text-main)">
            <p className="mb-1.5 text-[12px] font-semibold tracking-[0.08em] text-(--accent-coral)">
              Scan
            </p>

            <h1 className="mb-[22px] text-[23px] font-extrabold leading-[1.25] tracking-[-0.01em]">
              What are you logging?
            </h1>

            <button
              type="button"
              onClick={() => selectMode("barcode")}
              className={`${MODE_CARD_CLASS} mb-3`}
            >
              <div className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-(--bg-main)">
                <BarcodeIcon />
                <div className="absolute left-1 right-1 top-1 h-0.5 animate-[scanSweep_2.4s_ease-in-out_infinite] bg-(--accent-coral)" />
              </div>

              <div>
                <p className="mb-0.5 text-[15px] font-semibold">Scan barcode</p>
                <p className="text-[12.5px] text-(--text-muted)">
                  Packaged food with a label
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => selectMode("food")}
              className={MODE_CARD_CLASS}
            >
              <div className="h-[52px] w-[52px] shrink-0 rounded-xl bg-(--bg-main)">
                <FrameIcon />
              </div>

              <div>
                <p className="mb-0.5 text-[15px] font-semibold">Scan food</p>
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

      {/* Barcode camera (starts automatically, stops on the first result) */}
      {isScanning && (
        <div className="flex w-full max-w-[280px] flex-col items-center gap-3">
          <div
            id={READER_ID}
            className="min-h-[160px] w-full overflow-hidden rounded-xl border border-black/10 bg-(--bg-card)"
          />

          <p className="text-center font-poppins text-sm text-(--text-muted)">
            {cameraReady
              ? "Point your camera at the barcode."
              : "Starting camera…"}
          </p>

          {cameraReady && (
            <p className="text-center font-poppins text-xs text-(--text-muted)">
              Hold it 15–25 cm away, steady and well lit.
            </p>
          )}

          <button
            type="button"
            onClick={reset}
            className="cursor-pointer font-poppins text-sm underline"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Barcode analysis in progress */}
      {mode === "barcode" && analysisState === "loading" && (
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-(--bg-card-subtle) border-t-(--accent-coral)" />

          <p className="font-poppins text-sm text-(--text-muted)">
            Analyzing product…
          </p>
        </div>
      )}

      {/* Food scanner (unmounted on error/success so retry starts fresh) */}
      {mode === "food" && analysisState === "idle" && (
        <FoodScanner
          onAnalysisComplete={handleFoodAnalysisComplete}
          onError={handleFoodAnalysisError}
          onCancel={reset}
        />
      )}

      {/* Errors, for both modes (camera, barcode request, food request) */}
      {mode !== null && analysisState === "error" && (
        <ErrorPanel
          message={error || "Something went wrong. Please try again."}
          onRetry={clearAnalysis}
          onCancel={reset}
        />
      )}

      {/* Barcode result */}
      {mode === "barcode" && analysisState === "success" && analysisResult && (
        <ProductAnalysisView
          result={analysisResult}
          onClose={reset}
          onAddToDashboard={handleAddToDashboard}
        />
      )}

      {/* Food result */}
      {mode === "food" && analysisState === "success" && analysisResult && (
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
