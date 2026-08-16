const foodAnalysisSchema = {
  type: "object",
  properties: {

    product: {
      type: "object",
      properties: {
        name: { type: "string" },
        brand: { type: "string" },
        quantity: { type: ["string", "null"] },
        serving_size: { type: ["string", "null"] },
        image_url: { type: ["string", "null"] }
      },
      required: [
        "name",
        "brand",
        "quantity",
        "serving_size",
        "image_url"
      ]
    },

    summary: {
      type: "object",
      properties: {
        headline: { type: "string" },
        description: { type: "string" },

        overall_rating: {
          type: "string",
          enum: [
            "excellent",
            "good",
            "average",
            "poor",
            "unknown"
          ]
        },

        highlights: {
          type: "array",
          items: {
            type: "string"
          }
        }
      },
      required: [
        "headline",
        "description",
        "overall_rating",
        "highlights"
      ]
    },

    nutrition: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: [
            "available",
            "partial",
            "unknown"
          ]
        },

        per: {
          type: ["string", "null"]
        },

        serving_size: {
          type: ["string", "null"]
        },

        calories: {
          type: ["number", "null"]
        },

        protein_g: {
          type: ["number", "null"]
        },

        carbohydrates_g: {
          type: ["number", "null"]
        },

        sugars_g: {
          type: ["number", "null"]
        },

        added_sugars_g: {
          type: ["number", "null"]
        },

        fat_g: {
          type: ["number", "null"]
        },

        saturated_fat_g: {
          type: ["number", "null"]
        },

        trans_fat_g: {
          type: ["number", "null"]
        },

        fiber_g: {
          type: ["number", "null"]
        },

        salt_g: {
          type: ["number", "null"]
        },

        highlights: {
          type: "array",
          items: {
            type: "string"
          }
        }
      },

      required: [
        "status",
        "per",
        "serving_size",
        "calories",
        "protein_g",
        "carbohydrates_g",
        "sugars_g",
        "added_sugars_g",
        "fat_g",
        "saturated_fat_g",
        "trans_fat_g",
        "fiber_g",
        "salt_g",
        "highlights"
      ]
    },

    ingredients: {
      type: "object",
      properties: {

        status: {
          type: "string",
          enum: [
            "available",
            "partial",
            "unknown"
          ]
        },

        main_ingredients: {
          type: "array",
          items: {
            type: "string"
          }
        },

        notable_ingredients: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              why_it_matters: { type: "string" }
            },
            required: [
              "name",
              "why_it_matters"
            ]
          }
        },

        concerns: {
          type: "array",
          items: {
            type: "string"
          }
        },

        cleaned_ingredient_text: {
          type: ["string", "null"]
        }
      },

      required: [
        "status",
        "main_ingredients",
        "notable_ingredients",
        "concerns",
        "cleaned_ingredient_text"
      ]
    },

    allergens: {
      type: "object",
      properties: {

        status: {
          type: "string",
          enum: [
            "known",
            "partial",
            "unknown"
          ]
        },

        contains: {
          type: "array",
          items: {
            type: "string"
          }
        },

        may_contain: {
          type: "array",
          items: {
            type: "string"
          }
        },

        traces: {
          type: "array",
          items: {
            type: "string"
          }
        }
      },

      required: [
        "status",
        "contains",
        "may_contain",
        "traces"
      ]
    },

    additives: {
      type: "object",
      properties: {

        status: {
          type: "string",
          enum: [
            "known",
            "unknown"
          ]
        },

        count: {
          type: "number"
        },

        items: {
          type: "array",
          items: {
            type: "object",
            properties: {

              code: {
                type: "string"
              },

              name: {
                type: "string"
              },

              type: {
                type: "string"
              },

              purpose: {
                type: "string"
              },

              summary: {
                type: "string"
              },

              concern_level: {
                type: "string",
                enum: [
                  "low",
                  "moderate",
                  "high",
                  "unknown"
                ]
              }
            },

            required: [
              "code",
              "name",
              "type",
              "purpose",
              "summary",
              "concern_level"
            ]
          }
        }
      },

      required: [
        "status",
        "count",
        "items"
      ]
    },

    dietary: {
      type: "object",
      properties: {

        vegan: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: [
                "yes",
                "no",
                "maybe",
                "unknown"
              ]
            },
            explanation: {
              type: "string"
            }
          },
          required: [
            "status",
            "explanation"
          ]
        },

        vegetarian: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: [
                "yes",
                "no",
                "maybe",
                "unknown"
              ]
            },
            explanation: {
              type: "string"
            }
          },
          required: [
            "status",
            "explanation"
          ]
        },

        gluten_free: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: [
                "yes",
                "no",
                "maybe",
                "unknown"
              ]
            },
            explanation: {
              type: "string"
            }
          },
          required: [
            "status",
            "explanation"
          ]
        },

        dairy_free: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: [
                "yes",
                "no",
                "maybe",
                "unknown"
              ]
            },
            explanation: {
              type: "string"
            }
          },
          required: [
            "status",
            "explanation"
          ]
        },

        soy_free: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: [
                "yes",
                "no",
                "maybe",
                "unknown"
              ]
            },
            explanation: {
              type: "string"
            }
          },
          required: [
            "status",
            "explanation"
          ]
        },

        halal: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: [
                "yes",
                "no",
                "maybe",
                "unknown"
              ]
            },
            explanation: {
              type: "string"
            }
          },
          required: [
            "status",
            "explanation"
          ]
        },

        kosher: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: [
                "yes",
                "no",
                "maybe",
                "unknown"
              ]
            },
            explanation: {
              type: "string"
            }
          },
          required: [
            "status",
            "explanation"
          ]
        }
      },

      required: [
        "vegan",
        "vegetarian",
        "gluten_free",
        "dairy_free",
        "soy_free",
        "halal",
        "kosher"
      ]
    },

    processing: {
      type: "object",
      properties: {
        nova_group: {
          type: ["number", "null"]
        },

        label: {
          type: "string"
        },

        explanation: {
          type: "string"
        }
      },

      required: [
        "nova_group",
        "label",
        "explanation"
      ]
    },

    scores: {
      type: "object",
      properties: {

        nutriscore: {
          type: "object",
          properties: {
            grade: {
              type: ["string", "null"]
            },

            score: {
              type: ["number", "null"]
            },

            explanation: {
              type: "string"
            }
          },
          required: [
            "grade",
            "score",
            "explanation"
          ]
        },

        ecoscore: {
          type: "object",
          properties: {
            grade: {
              type: ["string", "null"]
            },

            score: {
              type: ["number", "null"]
            },

            explanation: {
              type: "string"
            }
          },
          required: [
            "grade",
            "score",
            "explanation"
          ]
        }
      },

      required: [
        "nutriscore",
        "ecoscore"
      ]
    },

    sustainability: {
      type: "object",
      properties: {

        status: {
          type: "string",
          enum: [
            "good",
            "moderate",
            "poor",
            "partial",
            "unknown"
          ]
        },

        palm_oil: {
          type: "string",
          enum: [
            "present",
            "absent",
            "unknown"
          ]
        },

        carbon_footprint: {
          type: ["number", "null"]
        },

        carbon_footprint_unit: {
          type: ["string", "null"]
        },

        summary: {
          type: "string"
        }
      },

      required: [
        "status",
        "palm_oil",
        "carbon_footprint",
        "carbon_footprint_unit",
        "summary"
      ]
    },

    suitability: {
      type: "object",
      properties: {

        overall: {
          type: "string"
        },

        good_for: {
          type: "array",
          items: {
            type: "string"
          }
        },

        potentially_good_for: {
          type: "array",
          items: {
            type: "string"
          }
        },

        caution_for: {
          type: "array",
          items: {
            type: "string"
          }
        },

        avoid_for: {
          type: "array",
          items: {
            type: "string"
          }
        }
      },

      required: [
        "overall",
        "good_for",
        "potentially_good_for",
        "caution_for",
        "avoid_for"
      ]
    },

    data_quality: {
      type: "object",
      properties: {

        status: {
          type: "string",
          enum: [
            "good",
            "partial",
            "poor"
          ]
        },

        issues: {
          type: "array",
          items: {
            type: "string"
          }
        }
      },

      required: [
        "status",
        "issues"
      ]
    }
  },

  required: [
    "product",
    "summary",
    "nutrition",
    "ingredients",
    "allergens",
    "additives",
    "dietary",
    "processing",
    "scores",
    "sustainability",
    "suitability",
    "data_quality"
  ]
};

module.exports = foodAnalysisSchema;