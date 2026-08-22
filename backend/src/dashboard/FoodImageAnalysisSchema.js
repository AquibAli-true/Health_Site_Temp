const foodImageAnalysisSchema = {
  "type": "object",
  "properties": {
    "meta": {
      "type": "object",
      "properties": {
        "user_input": {
          "type": "object",
          "properties": {
            "food_name": {
              "type": "string",
              "nullable": true
            },
            "weight_g": {
              "type": "number",
              "nullable": true
            }
          },
          "required": [
            "food_name",
            "weight_g"
          ]
        },
        "scan_status": {
          "type": "string",
          "enum": [
            "usable",
            "poor_quality",
            "not_food",
            "ambiguous",
            "unknown"
          ]
        }
      },
      "required": [
        "user_input",
        "scan_status"
      ]
    },
    "analysis": {
      "type": "object",
      "properties": {
        "food": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "cuisine": {
              "type": "string"
            },
            "state": {
              "type": "string",
              "enum": [
                "raw",
                "cooked",
                "partially_cooked",
                "dried",
                "frozen",
                "fermented",
                "processed",
                "unknown"
              ]
            },
            "food_type": {
              "type": "string",
              "enum": [
                "single_ingredient",
                "composite_dish",
                "beverage",
                "snack",
                "dessert",
                "sauce",
                "condiment",
                "other"
              ]
            }
          },
          "required": [
            "name",
            "cuisine",
            "state",
            "food_type"
          ],
          "nullable": true
        },
        "summary": {
          "type": "object",
          "properties": {
            "headline": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "highlights": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "headline",
            "description",
            "highlights"
          ],
          "nullable": true
        },
        "nutrition": {
          "type": "object",
          "properties": {
            "basis": {
              "type": "string",
              "enum": [
                "general_recipe"
              ]
            },
            "per": {
              "type": "string",
              "enum": [
                "100g"
              ]
            },
            "calories_kcal": {
              "type": "number",
              "nullable": true
            },
            "protein_g": {
              "type": "number",
              "nullable": true
            },
            "carbohydrates_g": {
              "type": "number",
              "nullable": true
            },
            "starch_g": {
              "type": "number",
              "nullable": true
            },
            "sugars_g": {
              "type": "number",
              "nullable": true
            },
            "added_sugars_g": {
              "type": "number",
              "nullable": true
            },
            "fat_g": {
              "type": "number",
              "nullable": true
            },
            "saturated_fat_g": {
              "type": "number",
              "nullable": true
            },
            "monounsaturated_fat_g": {
              "type": "number",
              "nullable": true
            },
            "polyunsaturated_fat_g": {
              "type": "number",
              "nullable": true
            },
            "trans_fat_g": {
              "type": "number",
              "nullable": true
            },
            "fiber_g": {
              "type": "number",
              "nullable": true
            },
            "sodium_mg": {
              "type": "number",
              "nullable": true
            },
            "salt_g": {
              "type": "number",
              "nullable": true
            },
            "cholesterol_mg": {
              "type": "number",
              "nullable": true
            },
            "vitamins": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "amount": {
                    "type": "number",
                    "nullable": true
                  },
                  "unit": {
                    "type": "string"
                  }
                },
                "required": [
                  "name",
                  "amount",
                  "unit"
                ]
              }
            },
            "minerals": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "amount": {
                    "type": "number",
                    "nullable": true
                  },
                  "unit": {
                    "type": "string"
                  }
                },
                "required": [
                  "name",
                  "amount",
                  "unit"
                ]
              }
            },
            "other_nutrients": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "amount": {
                    "type": "number",
                    "nullable": true
                  },
                  "unit": {
                    "type": "string"
                  }
                },
                "required": [
                  "name",
                  "amount",
                  "unit"
                ]
              }
            },
            "highlights": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "basis",
            "per",
            "calories_kcal",
            "protein_g",
            "carbohydrates_g",
            "starch_g",
            "sugars_g",
            "added_sugars_g",
            "fat_g",
            "saturated_fat_g",
            "monounsaturated_fat_g",
            "polyunsaturated_fat_g",
            "trans_fat_g",
            "fiber_g",
            "sodium_mg",
            "salt_g",
            "cholesterol_mg",
            "vitamins",
            "minerals",
            "other_nutrients",
            "highlights"
          ],
          "nullable": true
        },
        "recipe": {
          "type": "object",
          "properties": {
            "basis": {
              "type": "string",
              "enum": [
                "general_recipe"
              ]
            },
            "name": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "ingredients": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "role": {
                    "type": "string"
                  }
                },
                "required": [
                  "name",
                  "role"
                ]
              }
            },
            "common_variations": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "basis",
            "name",
            "description",
            "ingredients",
            "common_variations"
          ],
          "nullable": true
        },
        "ingredients": {
          "type": "object",
          "properties": {
            "main_ingredients": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "notable_ingredients": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "why_it_matters": {
                    "type": "string"
                  }
                },
                "required": [
                  "name",
                  "why_it_matters"
                ]
              }
            },
            "concerns": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "main_ingredients",
            "notable_ingredients",
            "concerns"
          ],
          "nullable": true
        },
        "processing": {
          "type": "object",
          "properties": {
           nova_group: {
  type: "number",
  nullable: true,
  enum: ["1", "2", "3", "4"]
},
            "label": {
              "type": "string"
            },
            "explanation": {
              "type": "string"
            }
          },
          "required": [
            "nova_group",
            "label",
            "explanation"
          ],
          "nullable": true
        },
        "dietary": {
          "type": "object",
          "properties": {
            "vegan": {
              "type": "object",
              "properties": {
                "status": {
                  "type": "string",
                  "enum": [
                    "yes",
                    "no",
                    "maybe",
                    "unknown"
                  ]
                },
                "explanation": {
                  "type": "string"
                }
              },
              "required": [
                "status",
                "explanation"
              ]
            },
            "vegetarian": {
              "type": "object",
              "properties": {
                "status": {
                  "type": "string",
                  "enum": [
                    "yes",
                    "no",
                    "maybe",
                    "unknown"
                  ]
                },
                "explanation": {
                  "type": "string"
                }
              },
              "required": [
                "status",
                "explanation"
              ]
            },
            "gluten_free": {
              "type": "object",
              "properties": {
                "status": {
                  "type": "string",
                  "enum": [
                    "yes",
                    "no",
                    "maybe",
                    "unknown"
                  ]
                },
                "explanation": {
                  "type": "string"
                }
              },
              "required": [
                "status",
                "explanation"
              ]
            },
            "dairy_free": {
              "type": "object",
              "properties": {
                "status": {
                  "type": "string",
                  "enum": [
                    "yes",
                    "no",
                    "maybe",
                    "unknown"
                  ]
                },
                "explanation": {
                  "type": "string"
                }
              },
              "required": [
                "status",
                "explanation"
              ]
            },
            "soy_free": {
              "type": "object",
              "properties": {
                "status": {
                  "type": "string",
                  "enum": [
                    "yes",
                    "no",
                    "maybe",
                    "unknown"
                  ]
                },
                "explanation": {
                  "type": "string"
                }
              },
              "required": [
                "status",
                "explanation"
              ]
            },
            "egg_free": {
              "type": "object",
              "properties": {
                "status": {
                  "type": "string",
                  "enum": [
                    "yes",
                    "no",
                    "maybe",
                    "unknown"
                  ]
                },
                "explanation": {
                  "type": "string"
                }
              },
              "required": [
                "status",
                "explanation"
              ]
            },
            "nut_free": {
              "type": "object",
              "properties": {
                "status": {
                  "type": "string",
                  "enum": [
                    "yes",
                    "no",
                    "maybe",
                    "unknown"
                  ]
                },
                "explanation": {
                  "type": "string"
                }
              },
              "required": [
                "status",
                "explanation"
              ]
            },
            "peanut_free": {
              "type": "object",
              "properties": {
                "status": {
                  "type": "string",
                  "enum": [
                    "yes",
                    "no",
                    "maybe",
                    "unknown"
                  ]
                },
                "explanation": {
                  "type": "string"
                }
              },
              "required": [
                "status",
                "explanation"
              ]
            }
          },
          "required": [
            "vegan",
            "vegetarian",
            "gluten_free",
            "dairy_free",
            "soy_free",
            "egg_free",
            "nut_free",
            "peanut_free"
          ],
          "nullable": true
        },
        "allergens": {
          "type": "object",
          "properties": {
            "likely_contains": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "potential_allergens": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "likely_contains",
            "potential_allergens"
          ],
          "nullable": true
        },
        "condition": {
          "type": "object",
          "properties": {
            "visible_indicators": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "visible_indicators"
          ],
          "nullable": true
        },
        "suitability": {
          "type": "object",
          "properties": {
            "overall": {
              "type": "string"
            },
            "good_for": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "potentially_good_for": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "caution_for": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "avoid_for": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "overall",
            "good_for",
            "potentially_good_for",
            "caution_for",
            "avoid_for"
          ],
          "nullable": true
        },
        "confidence": {
          "type": "object",
          "properties": {
            "overall": {
              "type": "number"
            },
            "food_identification": {
              "type": "number"
            },
            "ingredient_identification": {
              "type": "number"
            },
            "nutrition_estimation": {
              "type": "number"
            },
            "reason": {
              "type": "string"
            }
          },
          "required": [
            "overall",
            "food_identification",
            "ingredient_identification",
            "nutrition_estimation",
            "reason"
          ],
          "nullable": true
        }
      },
      "required": [
        "food",
        "summary",
        "nutrition",
        "recipe",
        "ingredients",
        "processing",
        "dietary",
        "allergens",
        "condition",
        "suitability",
        "confidence"
      ]
    }
  },
  "required": [
    "meta",
    "analysis"
  ]
};

module.exports = foodImageAnalysisSchema;