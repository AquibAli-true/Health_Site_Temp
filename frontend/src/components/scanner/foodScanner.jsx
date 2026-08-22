import { useState, useRef, useEffect, useCallback } from "react";

const FoodScanner = ({ onAnalysisComplete, onError, onCancel }) => {
  // captureState: "camera" | "preview" | "loading" | "error"
  const [captureState, setCaptureState] = useState("camera");

  // Captured image remains a base64 data URL for preview.
  const [capturedImage, setCapturedImage] = useState(null);

  const [cameraError, setCameraError] = useState(null);
  const [requestError, setRequestError] = useState(null);

  const [foodName, setFoodName] = useState("");
  const [weightG, setWeightG] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // ---------------------------------------------------------------------
  // Camera lifecycle
  // ---------------------------------------------------------------------

  useEffect(() => {
    if (captureState !== "camera") return;

    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("Camera failed to start:", err);

        if (!cancelled) {
          setCameraError(
            "Camera failed to start. Check permissions."
          );
        }
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [captureState]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // ---------------------------------------------------------------------
  // Capture current video frame
  // ---------------------------------------------------------------------

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    if (!video.videoWidth || !video.videoHeight) {
      setCameraError("Camera image is not ready yet. Try again.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      setCameraError("Could not capture the image.");
      return;
    }

    ctx.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

    setCapturedImage(dataUrl);
    setCameraError(null);

    stopCamera();
    setCaptureState("preview");
  };

  // ---------------------------------------------------------------------
  // Retake
  // ---------------------------------------------------------------------

  const handleRetake = () => {
    setCapturedImage(null);
    setCameraError(null);
    setRequestError(null);
    setCaptureState("camera");
  };

  // ---------------------------------------------------------------------
  // Convert base64 data URL to Blob
  // ---------------------------------------------------------------------

  const dataUrlToBlob = (dataUrl) => {
    const [header, base64] = dataUrl.split(",");

    if (!header || !base64) {
      throw new Error("Invalid captured image.");
    }

    const mimeMatch = header.match(/data:(.*?);base64/);

    if (!mimeMatch) {
      throw new Error("Invalid image format.");
    }

    const mimeType = mimeMatch[1];

    const binaryString = atob(base64);
    const byteArray = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }

    return new Blob([byteArray], {
      type: mimeType,
    });
  };

  // ---------------------------------------------------------------------
  // Analyze
  // ---------------------------------------------------------------------

  const handleAnalyze = async () => {
    if (!capturedImage) return;

    setCaptureState("loading");
    setRequestError(null);

    const trimmedName = foodName.trim();

    let parsedWeight = null;

    if (weightG.trim() !== "") {
      parsedWeight = Number(weightG);

      if (!Number.isFinite(parsedWeight) || parsedWeight <= 0) {
        setRequestError("Please enter a valid weight.");
        setCaptureState("error");
        return;
      }
    }

    try {
      const imageBlob = dataUrlToBlob(capturedImage);

      const formData = new FormData();

      formData.append(
        "image",
        imageBlob,
        "food.jpg"
      );

      if (trimmedName !== "") {
        formData.append("food_name", trimmedName);
      }

      if (parsedWeight !== null) {
        formData.append(
          "weight_g",
          parsedWeight.toString()
        );
      }

      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/home/food-scanner`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Request failed (${response.status})`
        );
      }

      onAnalysisComplete(data);
    } catch (err) {
      console.error("Food analysis failed:", err);

      const message =
        err?.message ||
        "Something went wrong analyzing this photo.";

      setRequestError(message);
      setCaptureState("error");

      if (onError) {
        onError(err);
      }
    }
  };

  // ---------------------------------------------------------------------
  // Cancel
  // ---------------------------------------------------------------------

  const handleCancel = () => {
    stopCamera();
    onCancel();
  };

  // ---------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">

      {/* Hidden canvas used only for frame capture */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />

      {/* Live camera */}
      {captureState === "camera" && (
        <>
          <div className="w-full overflow-hidden rounded-md border border-black/10 bg-black">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full"
            />
          </div>

          <p className="font-poppins text-sm text-(--text-muted)">
            Frame your food, then capture
          </p>

          {cameraError && (
            <p className="font-poppins text-sm text-red-600">
              {cameraError}
            </p>
          )}

          <button
            onClick={handleCapture}
            disabled={!!cameraError}
            className="cursor-pointer rounded-md bg-(--accent-coral) px-6 py-2.5 font-poppins font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Capture
          </button>

          <button
            onClick={handleCancel}
            className="cursor-pointer font-poppins text-sm underline"
          >
            Cancel
          </button>
        </>
      )}

      {/* Captured image preview */}
      {captureState === "preview" && capturedImage && (
        <>
          <div className="w-full overflow-hidden rounded-md border border-black/10">
            <img
              src={capturedImage}
              alt="Captured food"
              className="w-full"
            />
          </div>

          <div className="flex w-full flex-col gap-2">
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="Food name (optional)"
              className="w-full rounded-md border border-black/10 bg-(--bg-card-subtle) px-3 py-2 font-poppins text-sm"
            />

            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.1"
              value={weightG}
              onChange={(e) => setWeightG(e.target.value)}
              placeholder="Weight in grams (optional)"
              className="w-full rounded-md border border-black/10 bg-(--bg-card-subtle) px-3 py-2 font-poppins text-sm"
            />
          </div>

          <div className="flex w-full gap-2">
            <button
              onClick={handleRetake}
              className="flex-1 cursor-pointer rounded-md border border-black/10 bg-(--bg-card-subtle) py-2.5 font-poppins font-medium"
            >
              Retake
            </button>

            <button
              onClick={handleAnalyze}
              className="flex-1 cursor-pointer rounded-md bg-(--accent-coral) py-2.5 font-poppins font-medium text-white"
            >
              Use photo
            </button>
          </div>
        </>
      )}

      {/* Loading */}
      {captureState === "loading" && (
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-(--bg-card-subtle) border-t-(--accent-coral)" />

          <p className="font-poppins text-sm text-(--text-muted)">
            Analyzing your food…
          </p>
        </div>
      )}

      {/* Request error */}
      {captureState === "error" && (
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="font-poppins text-sm text-red-600">
            {requestError || "Something went wrong."}
          </p>

          <button
            onClick={handleRetake}
            className="cursor-pointer rounded-md bg-(--accent-coral) px-6 py-2.5 font-poppins font-medium text-white"
          >
            Try again
          </button>

          <button
            onClick={handleCancel}
            className="cursor-pointer font-poppins text-sm underline"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodScanner;