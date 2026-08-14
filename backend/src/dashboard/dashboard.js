const express = require("express");
const router = express.Router();
const {
  userModel,
  pendingUserModel,
  otpModel,
} = require("../models/userModel.js");
const DailyLog = require("../models/dashboardModel.js");
const jwt = require("jsonwebtoken");
const cookie_parser = require("cookie-parser");

const calculateTotals = (meals) => {
  let totalCalories = 0;
  let totalProtein = 0;

  if (!meals) return { totalCalories, totalProtein };

  const allFoods = [
    ...(meals.breakfast || []),
    ...(meals.lunch || []),
    ...(meals.dinner || []),
    ...(meals.snacks || []),
  ];
  allFoods.forEach((food) => {
    totalCalories += food.calories;
    totalProtein += food.protein;
  });

  return { totalCalories, totalProtein };
};

router
  .get("/dashboard", async (req, res) => {
    try {
      const token = req.cookies.user_session;
      if (!token) return res.status(401).json({ message: "Not authenticated" });
      const user = await userModel.findOne({ token: token });
      if (!user) return res.status(401).json({ message: "Invalid session" });
      const requestedDate =
        req.query.date || new Date().toISOString().split("T")[0];
      let bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age;
      bmr += user.sex === "male" ? 5 : -161;
      const maintenanceCalories = Math.round(bmr * 1.2);
      const maintenanceProtein = Math.round((maintenanceCalories * 0.3) / 4);
      let dailyLog = await DailyLog.findOne({
        user: user._id,
        date: requestedDate,
      });
      if (!dailyLog) {
        dailyLog = await DailyLog.create({
          user: user._id,
          date: requestedDate,
          targetCalories: maintenanceCalories,
          targetProtein: maintenanceProtein,
          meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
        });
      }
      const { totalCalories, totalProtein } = calculateTotals(dailyLog.meals);
      res.status(200).json({
        date: dailyLog.date,
        targetCalories: dailyLog.targetCalories,
        consumedCalories: totalCalories,
        targetProtein: dailyLog.targetProtein,
        consumedProtein: totalProtein,
        meals: dailyLog.meals,
      });
    } catch (error) {
      console.error("Dashboard Error:", error);
      res.status(500).json({ message: error.message });
    }
  })
  .put("/dashboard/targets", async (req, res) => {
    try {
      const token = req.cookies.user_session;
      if (!token) return res.status(401).json({ message: "Not authenticated" });

      const user = await userModel.findOne({ token: token });
      if (!user) return res.status(401).json({ message: "Invalid session" });

      const { date, targetCalories, targetProtein } = req.body;

      if (!date || !targetCalories || !targetProtein) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const updatedLog = await DailyLog.findOneAndUpdate(
        { user: user._id, date: date },
        {
          targetCalories: Number(targetCalories),
          targetProtein: Number(targetProtein),
        },
        { new: true },
      );

      if (!updatedLog) {
        return res.status(404).json({ message: "Log not found for this date" });
      }

      res.status(200).json({
        message: "Targets updated",
        targetCalories: updatedLog.targetCalories,
        targetProtein: updatedLog.targetProtein,
      });
    } catch (error) {
      console.error("Update Targets Error:", error);
      res.status(500).json({ message: error.message });
    }
  })
  .post("/dashboard/food", async (req, res) => {
    try {
      const token = req.cookies.user_session;
      if (!token) return res.status(401).json({ message: "Not authenticated" });

      const user = await userModel.findOne({ token: token });
      if (!user) return res.status(401).json({ message: "Invalid session" });

      const {
        date,
        name,
        fdcId,
        servingAmount,
        servingUnit,
        calories,
        protein,
        fat,
        carbs,
        mealType,
      } = req.body;

      const validMealTypes = ["breakfast", "lunch", "dinner", "snacks"];
      if (!mealType || !validMealTypes.includes(mealType)) {
        return res
          .status(400)
          .json({
            message:
              "Valid mealType (breakfast, lunch, dinner, snacks) is required",
          });
      }

      const foodItem = {
        name,
        fdcId: String(fdcId || "custom"),
        servingAmount: Number(servingAmount) || 100,
        servingUnit: servingUnit || "g",
        calories: Number(calories) || 0,
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
      };
      const updatedLog = await DailyLog.findOneAndUpdate(
        { user: user._id, date: date },
        { $push: { [`meals.${mealType}`]: foodItem } },
        { new: true },
      );

      if (!updatedLog) {
        return res.status(404).json({ message: "Log not found" });
      }

      res.status(200).json(updatedLog);
    } catch (error) {
      console.error("Log Food Error:", error);
      res.status(500).json({ message: error.message });
    }
  })
  .patch("/dashboard/weight", async (req, res) => {
    try {
      const token = req.cookies.user_session;
      if (!token) return res.status(401).json({ message: "Not authenticated" });

      const user = await userModel.findOne({ token: token });
      if (!user) return res.status(401).json({ message: "Invalid session" });

      const { date, weight } = req.body;

      if (!date || weight === undefined) {
        return res
          .status(400)
          .json({ message: "date and weight are required" });
      }

      const weightNum = Number(weight);
      if (isNaN(weightNum) || weightNum <= 0) {
        return res
          .status(400)
          .json({ message: "weight must be a positive number" });
      }
      let dailyLog = await DailyLog.findOne({ user: user._id, date: date });

      if (!dailyLog) {
        let bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age;
        bmr += user.sex === "male" ? 5 : -161;
        const maintenanceCalories = Math.round(bmr * 1.2);
        const maintenanceProtein = Math.round((maintenanceCalories * 0.3) / 4);

        dailyLog = await DailyLog.create({
          user: user._id,
          date: date,
          targetCalories: maintenanceCalories,
          targetProtein: maintenanceProtein,
          loggedWeight: weightNum,
          meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
        });
      } else {
        dailyLog.loggedWeight = weightNum;
        await dailyLog.save();
      }

      const mostRecentLog = await DailyLog.findOne({
        user: user._id,
        loggedWeight: { $exists: true, $ne: null },
      }).sort({ date: -1 });

      if (mostRecentLog) {
        await userModel.findByIdAndUpdate(user._id, {
          weight: mostRecentLog.loggedWeight,
        });
      }

      res
        .status(200)
        .json({ date: dailyLog.date, loggedWeight: dailyLog.loggedWeight });
    } catch (error) {
      console.error("Log Weight Error:", error);
      res.status(500).json({ message: error.message });
    }
  })


  .post("/dashboard/food-entry/search", async (req, res) => {
    try {
      if (!req.query.q)
        return res.status(400).json({ message: "Please enter a valid item." });
      if(req.body.meal==='') return res.status(400).json({message: 'Please enter a meal type.'})
      const query = req.query.q.trim();
      const token = req.cookies.user_session;
      if (!token)
        return res.status(401).json({ message: "user_session not found" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const foodDataResponse = [];
      
      if (req.body.entryType === 'generic') {
        const response = await fetch(
          `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.USDA_API_KEY}&query=${query}&dataType=Foundation&dataType=SR Legacy&pageSize=15`,
        );
        const responseData = await response.json();
        const foodData = responseData.foods;

        foodData.forEach((food) =>
          foodDataResponse.push({
            itemId: food.fdcId,
            itemSource: req.body.entryType,
            userId: decoded.id,
            itemName: food.description,
            meal: req.body.meal,
            itemProtein: food.foodNutrients.find((n) => n.nutrientId === 1003)?.value,
            itemCalories: food.foodNutrients.find((n) => n.nutrientId === 1008)?.value,
            itemCarbs: food.foodNutrients.find((n) => n.nutrientId === 1005)?.value,
            itemFats: food.foodNutrients.find((n) => n.nutrientId === 1004)?.value,
          }),
        );
      } else {
        const response = await fetch(
          `https://in.openfoodfacts.org/cgi/search.pl?search_terms=${query}&json=1&fields=code,product_name,brands,nutriments&page_size=15`,
        );
        if (!response.ok) {
    console.log("External API:", response.status, response.statusText);
    console.log(response)

    return res.status(502).json({
        message: "Food database temporarily unavailable"
    });
}
        const responseData = await response.json();
        const productData = responseData.products;
        productData.forEach((product) =>
          foodDataResponse.push({
            itemId: product.code,
            itemSource: req.body.entryType,
            userId: decoded.id,
            itemName: product.product_name,
            meal: req.body.meal,
            itemProtein:
              product.nutriments?.proteins ??
              product.nutriments?.proteins_100g ??
              product.nutriments?.proteins_prepared ??
              product.nutriments?.proteins_prepared_100g,
            itemCalories:
              product.nutriments?.["energy-kcal"] ??
              product.nutriments?.["energy-kcal_100g"] ??
              product.nutriments?.["energy-kcal_value"] ??
              product.nutriments?.["energy-kcal_prepared"] ??
              product.nutriments?.["energy-kcal_prepared_100g"] ??
              product.nutriments?.["energy-kcal_prepared_value"],
            itemCarbs:
              product.nutriments?.carbohydrates ??
              product.nutriments?.carbohydrates_100g ??
              product.nutriments?.carbohydrates_value ??
              product.nutriments?.carbohydrates_prepared ??
              product.nutriments?.carbohydrates_prepared_100g ??
              product.nutriments?.carbohydrates_prepared_value,
            itemFats:
              product.nutriments?.fat ??
              product.nutriments?.fat_100g ??
              product.nutriments?.fat_value ??
              product.nutriments?.fat_prepared ??
              product.nutriments?.fat_prepared_100g ??
              product.nutriments?.fat_prepared_value,
          }),
        );
      }
      console.log(foodDataResponse)
      
      return res.status(200).json(foodDataResponse);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: "Internal Server Error" });
    }
  }).post('/dashboard/food-entry/save-item', async (req,res)=>{
    try{
      if(!req.body || !req.body.weight) return res.status(400).json({message:'invalid entry'});
      await DailyLog.foodEntryModel.create({
        itemId:req.body.field.itemId,
        itemSource: req.body.field.itemSource,
        userId: req.body.field.userId,
        itemName: req.body.field.itemName,
        meal: req.body.field.meal,
        nutrition:{
          itemCalories:req.body.field.itemCalories,
          itemProtein:req.body.field.itemProtein,
          itemCarbs: req.body.field.itemCarbs,
          itemFats: req.body.field.itemFats,
        },
        itemWeight: req.body.weight,
        meal: req.body.field.meal,
        date: new Date(),
      })
      const entryObject= await DailyLog.foodEntryModel.findOne({userId:req.body.field.userId, itemId:req.body.field.itemId});
      console.log(entryObject);
      return res.status(200).json(entryObject);
    }
    catch(e){
      console.log(e)
      return res.status(409).json({message:'something went wrong'})
    }
  });

module.exports = router;
