const express = require("express");
const multer = require("multer");
const router = express.Router();

require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");
const foodImageAnalysisSchema = require("./FoodImageAnalysisSchema.js");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed."));
    }

    cb(null, true);
  },
});

// ------------------------------------------------------------
// Gemini helper
// ------------------------------------------------------------

async function runAnalysis({ prompt, schema }) {
  const modelChain = [
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3-flash",
    "gemini-3.1-flash-lite",
  ];

  const config = {
    responseMimeType: "application/json",
    responseSchema: schema,

    thinkingConfig: {
      thinkingLevel: "minimal",
    },

    // tools: [
    //   {
    //     googleSearch: {},
    //   },
    // ],
  };

  let analysisResult = null;
  let lastError = null;

  for (const model of modelChain) {
    console.log(model)
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });
      console.log(response)

      analysisResult = JSON.parse(response.text);

      break;
    } catch (error) {
        console.log(error)
      const isRateLimit =
        error?.status === 429 ||
        error?.message?.includes("429") ||
        error?.message?.includes("RESOURCE_EXHAUSTED");

      if (isRateLimit) {
        lastError = error;
        continue;
      }

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

// ------------------------------------------------------------
// Food scanner
// ------------------------------------------------------------

router.post(
  "/home/food-scanner",
  upload.single("image"),
  async (req, res) => {
    try {
      // --------------------------------------------------------
      // 1. Get image + optional user input
      // --------------------------------------------------------

      const imageFile = req.file;

      if (!imageFile) {
        return res.status(400).json({
          message: "Invalid request: image is required.",
        });
      }

      const foodName = req.body.food_name?.trim() || null;

      let weightG = null;

      if (
        req.body.weight_g !== undefined &&
        req.body.weight_g !== null &&
        req.body.weight_g !== ""
      ) {
        const parsedWeight = Number(req.body.weight_g);

        if (!Number.isFinite(parsedWeight) || parsedWeight <= 0) {
          return res.status(400).json({
            message: "Invalid weight_g.",
          });
        }

        weightG = parsedWeight;
      }

      const mimeType = imageFile.mimetype;

      const base64Data = imageFile.buffer.toString("base64");

      // --------------------------------------------------------
      // 2. Prompt
      // --------------------------------------------------------

      const promptText = `
You are an expert food identification and nutritional analysis system.

Analyze the provided food image and return ONLY a JSON object that strictly conforms to the provided response schema.

INPUTS:

- Food image: provided separately
- Optional food name supplied by the user: ${JSON.stringify(foodName)}
- Optional food weight in grams supplied by the user: ${JSON.stringify(weightG)}

IMPORTANT DISTINCTION:

The image represents the food being analyzed, but the nutritional values must represent the GENERAL/TYPICAL RECIPE of the identified food, not an attempt to reconstruct the exact recipe used to prepare the photographed portion.

The user's optional food name should be treated as additional information that can help identify the food. If it conflicts with the visual evidence, use your judgment and reflect the conflict in the confidence values.

The user's optional weight is the weight of the photographed food portion. It must NOT change the nutritional values returned in the nutrition object because ALL nutrition values must be expressed PER 100g.

Do not estimate the portion's volume, weight, or nutritional totals from the image. The application handles weight-based calculations separately.

SCAN QUALITY:

Before performing the food analysis, determine whether the image is actually usable.

Use:

- "usable" when the food can be identified with reasonable confidence.
- "poor_quality" when the image is too blurry, dark, obstructed, distant, low-resolution, or otherwise visually inadequate.
- "not_food" when the image does not contain identifiable food.
- "ambiguous" when food is present but cannot be identified reliably.
- "unknown" only when the scan state genuinely cannot be determined.

If the image is not usable, DO NOT GUESS.

For "poor_quality", "not_food", or "ambiguous":
- set meta.scan_status appropriately
- return null for all analysis sections that cannot be reliably produced
- do not invent a food name
- do not invent nutritional values
- do not invent ingredients
- do not fabricate confidence scores

FOOD IDENTIFICATION:

1. Identify the food shown in the image.
2. Use the user-provided food name when available as supporting information.
3. Identify the cuisine when reasonably possible.
4. Determine the food's physical/preparation state using ONLY the allowed enum values.
5. Determine whether it is a single ingredient or a composite dish, beverage, snack, dessert, sauce, condiment, or other food type.
6. For composite dishes, identify the major ingredients characteristic of the dish.

GENERAL RECIPE:

For the identified food, describe a representative GENERAL RECIPE rather than the exact photographed preparation.

For example, if the image shows chicken biryani:

- describe a general chicken biryani recipe
- identify its common ingredients
- describe common variations
- estimate nutrition based on a representative general recipe
- do NOT claim that the photographed biryani definitely contains exact quantities of every ingredient

Do not invent highly specific ingredient quantities unless they are reasonably established for the general recipe.

NUTRITION:

Provide nutritional values PER 100g only.

The nutritional values should represent the general recipe of the identified food.

Include:

- calories
- protein
- carbohydrates
- starch
- sugars
- added sugars
- total fat
- saturated fat
- monounsaturated fat
- polyunsaturated fat
- trans fat
- fiber
- sodium
- salt
- cholesterol
- relevant vitamins
- relevant minerals
- other nutritionally meaningful compounds when appropriate

Use null when a value cannot be reasonably estimated.

Do not fabricate precision. Nutritional estimates may vary between recipes, so values should represent a reasonable general estimate rather than false precision.

VITAMINS, MINERALS AND OTHER NUTRIENTS:

Include relevant nutrients that are meaningfully present in the identified food.

Do not restrict yourself to a predetermined list of vitamins or minerals.

If the food has a nutritionally relevant compound that does not fit the predefined common nutrient categories, place it in "other_nutrients".

Do not fill these arrays with irrelevant nutrients merely to make the response longer.

SEARCH / EXTERNAL INFORMATION:

You may use Google Search when external information would materially improve the analysis.

Use Search particularly when:

- the food is regional or uncommon
- the food has multiple names
- the cuisine or preparation style is difficult to identify
- the general recipe is important for determining nutritional composition
- reliable nutritional information for the identified food would improve the estimate
- the food is a composite dish for which recipe composition varies substantially

When using Search, prefer reliable nutritional databases, scientific or academic sources, reputable food references, and representative recipes.

Do not blindly copy the nutritional values of a single recipe or database entry when the identified food has substantial recipe variation. Synthesize the available information into a reasonable general-recipe estimate.

If reliable external information is unavailable, use your existing knowledge and clearly reflect uncertainty through the confidence fields.

INGREDIENTS:

Separate:

- main ingredients characteristic of the food
- notable ingredients that materially affect nutritional, dietary, or culinary characteristics
- ingredient concerns relevant to the analysis

Do not claim that an ingredient is definitely present in the photographed food merely because it is common in the general recipe.

PROCESSING:

Assign the appropriate NOVA group when it can reasonably be determined from the food and its general preparation.

Use the allowed enum values only.

DIETARY AND ALLERGEN INFORMATION:

Evaluate vegetarian, vegan, gluten-free, dairy-free, soy-free, egg-free, nut-free, and peanut-free status based on the identified food and its general recipe.

Do not treat an attribute as definitively confirmed when the general recipe commonly varies.

Allergen information should distinguish between ingredients likely characteristic of the food and allergens that are merely possible depending on preparation.

CONDITION:

Inspect the image for visible signs that may indicate the food appears fresh, spoiled, stale, burnt, excessively dried, discolored, moldy, or otherwise abnormal.

Only report visible indicators.

Do NOT make a definitive claim that food is safe or unsafe to eat based solely on an image.

If no concerning visual indicators are present, state that no obvious visual signs of spoilage or deterioration are visible.

CONFIDENCE:

Provide confidence values from 0 to 1.

food_identification = confidence in identifying the food itself.

ingredient_identification = confidence in identifying ingredients characteristic of the food/general recipe and visible ingredients.

nutrition_estimation = confidence in the nutritional estimate for the general recipe.

overall = overall confidence in the analysis.

Confidence values must reflect actual uncertainty and must not be automatically high.

IMPORTANT:

- Do not confuse the photographed portion with the general recipe.
- Do not claim to know hidden ingredients from the image.
- Do not infer exact quantities of ingredients from appearance alone.
- Do not use the optional weight to alter the per-100g nutritional values.
- Do not provide cooking instructions.
- Do not provide text outside the JSON object.
- Follow the response schema exactly.
`;

      // --------------------------------------------------------
      // 3. Multimodal Gemini contents
      // --------------------------------------------------------

      const contents = [
        {
          role: "user",
          parts: [
            {
              text: promptText,
            },
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ];

      // --------------------------------------------------------
      // 4. Gemini
      // --------------------------------------------------------

      const geminiResponse = await runAnalysis({
        prompt: contents,
        schema: foodImageAnalysisSchema,
      });

      // --------------------------------------------------------
      // 5. Normalize response
      // --------------------------------------------------------

      const responseMeta = geminiResponse.meta ?? {};
      console.log(responseMeta)
      const finalResponse = {
        ...geminiResponse,

        meta: {
          ...responseMeta,

          user_input: {
            food_name: foodName,
            weight_g: weightG,
          },

          scan_status:
            responseMeta.scan_status ??
            "unknown",
        },
      };
      console.log(finalResponse)
      return res.status(200).json(finalResponse);
    } catch (error) {
  console.error("Food scanner error - FULL:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
  return res.status(500).json({ message: "Failed to analyze food photo", error: error?.message });
}
  }
);

module.exports = router;