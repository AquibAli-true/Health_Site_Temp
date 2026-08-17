const express = require("express");
const router = express.Router();
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");
const foodAnalysisSchema = require("./foodAnalysisSchema.js");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Helper function to handle multi-model fallback execution
async function runAnalysis({ prompt, schema }) {
  const modelChain = [
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3-flash",
    "gemini-3.1-flash-lite"
  ];

  const config = {
    responseMimeType: "application/json",
    responseSchema: schema,
    thinkingConfig: {
      thinkingLevel: "minimal"
    }
  };

  let analysisResult = null;
  let lastError = null;

  for (const model of modelChain) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: config
      });

      // Parse and assign to analysisResult
      analysisResult = JSON.parse(response.text);
      
      // Exit loop immediately upon success
      break;

    } catch (error) {
      const isRateLimit =
        error?.status === 429 ||
        error?.message?.includes("429") ||
        error?.message?.includes("RESOURCE_EXHAUSTED");

      if (isRateLimit) {
        lastError = error;
        continue; // Fallback to next model
      }

      // Throw non-429 errors immediately (e.g. invalid auth, schema errors)
      throw error;
    }
  }

  if (!analysisResult) {
    throw new Error(
      `All fallback models hit 429 rate limits. Last error: ${lastError?.message}`
    );
  }

  return analysisResult;
}

router.post("/home/barcode-scanner", async (req, res) => {
  try {

    // -----------------------------------
    // 1. Get barcode
    // -----------------------------------

    const barcode = req.body.barcodeValue;

    if (!barcode) {
      return res.status(400).json({
        message: "Invalid barcode"
      });
    }

    // -----------------------------------
    // 2. Fetch Open Food Facts
    // -----------------------------------

    const offResponse = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`
    );

    if (!offResponse.ok) {
      return res.status(502).json({
        message: "Open Food Facts request failed"
      });
    }

    const offData = await offResponse.json();

    // -----------------------------------
    // 3. Product doesn't exist
    // -----------------------------------

    if (offData.status !== 1 || !offData.product) {
      return res.status(404).json({
        barcode,
        message: "Product not found in Open Food Facts"
      });
    }

    const product = offData.product;

    // -----------------------------------
    // 4. Normalize OFF data
    // -----------------------------------

    const foodData = {
      barcode,

      product: {
        name: product.product_name || null,
        brand: product.brands || null,
        generic_name: product.generic_name || null,
        quantity: product.quantity || null,
        serving_size: product.serving_size || null,

        categories: product.categories_tags || [],
        countries: product.countries_tags || [],

        images: {
          front: product.selected_images?.front?.display?.en || null,
          ingredients:
            product.selected_images?.ingredients?.display?.en || null,
          nutrition:
            product.selected_images?.nutrition?.display?.en || null,
          packaging:
            product.selected_images?.packaging?.display?.en || null
        }
      },

      ingredients: {
        status: product.ingredients_text ? "available" : "unknown",
        raw_text: product.ingredients_text || null,
        parsed: product.ingredients || [],
        analysis: product.ingredients_analysis || {},
        analysis_tags: product.ingredients_analysis_tags || []
      },

      allergens: {
        raw: product.allergens || null,
        tags: product.allergens_tags || [],
        hierarchy: product.allergens_hierarchy || [],
        from_user: product.allergens_from_user || null,
        from_ingredients: product.allergens_from_ingredients || null
      },

      additives: {
        count: product.additives_n ?? null,
        tags: product.additives_tags || [],
        original_tags: product.additives_original_tags || []
      },

      nutrition: {
        status:
          product.nutriments && Object.keys(product.nutriments).length > 0
            ? "available"
            : "unknown",
        data_per: product.nutrition_data_per || null,
        serving_size: product.serving_size || null,
        nutriments: product.nutriments || {}
      },

      processing: {
        nova_group: product.nova_group ?? null,
        nova_tags: product.nova_groups_tags || [],
        nova_markers: product.nova_groups_markers || {}
      },

      scores: {
        nutriscore: {
          grade: product.nutriscore_grade || null,
          score: product.nutriscore_score ?? null,
          version: product.nutriscore_version || null
        },
        ecoscore: {
          grade: product.ecoscore_grade || null,
          score: product.ecoscore_score ?? null
        }
      },

      dietary: {
        labels: product.labels_tags || [],
        vegan_analysis:
          product.ingredients_analysis?.["en:non-vegan"] || [],
        vegetarian_analysis:
          product.ingredients_analysis?.[
            "en:vegetarian-status-unknown"
          ] || []
      },

      sustainability: {
        palm_oil:
          product.ingredients_analysis?.["en:palm-oil"] || [],
        ecoscore_data:
          product.ecoscore_data || null
      },

      data_quality: {
        completeness: product.completeness ?? null,
        dimensions: product.data_quality_dimensions || null,
        warnings: product.data_quality_warnings_tags || [],
        info: product.data_quality_info_tags || [],
        states: product.states_tags || []
      }
    };

    // -----------------------------------
    // 5. Prompt
    // -----------------------------------

    const prompt = `
You are a food product analysis engine.
Analyze the supplied Open Food Facts product data and produce useful, human-readable information for an ordinary consumer.
You are NOT returning the source data. The supplied Open Food Facts JSON is INPUT ONLY.
Your output must contain ONLY the information requested by the response schema.
Do NOT copy, reproduce, echo, summarize, or expose:
- Open Food Facts internal fields
- taxonomy IDs
- *_tags fields
- country-code score maps
- internal analysis arrays
- states
- data quality tag IDs
- internal database identifiers
- raw Eco-Score calculation structures
- raw ingredient parser structures
Instead, INTERPRET those values and express the useful meaning in clear, human-readable language.
The final response is intended to be sent directly to a frontend.
Every field must be useful to a consumer or to a frontend component.

Clean OCR errors and remove obvious non-ingredient text such as storage instructions, preparation instructions, warnings, and other packaging text from the interpreted ingredient list.
Do not invent missing information.
Missing information must be represented as "unknown", null, or an empty collection as appropriate.
Do not treat an empty source field as proof that something is absent.
The output must be useful directly to a consumer-facing frontend.

SUITABILITY RULES:
good_for: People for whom this product appears reasonably suitable based on the available nutritional, ingredient and dietary information.
potentially_good_for: People who could reasonably consider it, but where the evidence is less strong.
caution_for: People who may want to limit or think carefully about the product because of known ingredients, allergens, nutrition or processing characteristics.
avoid_for: Only use when there is a strong factual reason such as a known allergen or explicit incompatible dietary characteristic.

IMPORTANT RULES:
1. NEVER invent facts.
2. NEVER invent nutrition values.
3. NEVER assume a missing nutrient is zero.
4. NEVER assume missing allergen information means allergen-free.
5. NEVER assume an empty additives array means "no additives" unless the supplied data explicitly supports that conclusion.
6. Use the supplied Open Food Facts data as the factual source.
7. When information is unavailable, use "unknown" in the appropriate field and explain that information is unavailable.
8. You may interpret and explain the supplied facts.
9. Do not make medical diagnoses.
10. Do not claim a food is medically safe or unsafe for a disease.
11. Use cautious language for "who is it for" recommendations.
12. Make explanations understandable to normal consumers.
13. Do not blindly label an ingredient as dangerous.
14. Distinguish between confirmed information and uncertain information.
15. If the data is extremely incomplete, say so clearly instead of making assumptions.

IMPORTANT:
Do not invent medical conditions or medical advice.

Now analyze this product:

${JSON.stringify(foodData)}
`;

    // -----------------------------------
    // 6. Call Gemini (Awaited execution)
    // -----------------------------------

    const geminiResponse = await runAnalysis({
      prompt: prompt,
      schema: foodAnalysisSchema
    });

    // -----------------------------------
    // 7. Return API Response
    // -----------------------------------

    return res.status(200).json({
      meta: {
        barcode,
        data_source: "openfoodfacts",
        data_completeness: product.completeness ?? null,
        analysis_status:
          product.completeness === undefined
            ? "partial"
            : product.completeness < 0.4
              ? "insufficient_data"
              : product.completeness < 0.8
                ? "partial"
                : "complete"
      },
      analysis: geminiResponse
    });

  } catch (error) {
    console.error("Barcode scanner error:", error);

    return res.status(500).json({
      message: "Failed to analyze product",
      error: error.message
    });
  }
});

module.exports = router;