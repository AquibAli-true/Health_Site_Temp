


    
  
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
