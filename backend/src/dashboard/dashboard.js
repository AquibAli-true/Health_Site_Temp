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

router.post("/dashboard/food-entry/search", async (req, res) => {
    try {
      if (!req.query.q)
        return res.status(400).json({ message: "Please enter a valid item." });
      if (req.body.meal === '') return res.status(400).json({ message: 'Please enter a meal type.' })
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
        if (!response.ok) {
          return res.status(502).json({
            message: "Food database temporarily unavailable"
          });
        }
        const responseData = await response.json();
        const foodData = responseData.foods;

        foodData.forEach((food) =>
          foodDataResponse.push({
            itemId: food.fdcId,
            itemSource: req.body.entryType,
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
          `https://in.openfoodfacts.org/cgi/search.pl?search_terms=${query}&json=1&fields=code,_id,product_name,brands,nutriments,product_quantity,product_quantity_unit&page_size=15`,
        );
        if (!response.ok) {
          return res.status(502).json({
            message: "Food database temporarily unavailable"
          });
        }
        const responseData = await response.json();
        const productData = responseData.products;
        productData.forEach((product) =>
          foodDataResponse.push({
            itemId: product._id,
            itemSource: req.body.entryType,
            itemName: product.product_name,
            meal: req.body.meal,
            defaultItemWeight: product.product_quantity ?? 0,
            itemProtein:
              product.nutriments?.proteins ??
              product.nutriments?.proteins_100g ??
              product.nutriments?.proteins_prepared ??
              product.nutriments?.proteins_prepared_100g ?? 0,
            itemCalories:
              product.nutriments?.["energy-kcal"] ??
              product.nutriments?.["energy-kcal_100g"] ??
              product.nutriments?.["energy-kcal_value"] ??
              product.nutriments?.["energy-kcal_prepared"] ??
              product.nutriments?.["energy-kcal_prepared_100g"] ??
              product.nutriments?.["energy-kcal_prepared_value"] ?? 0,
            itemCarbs:
              product.nutriments?.carbohydrates ??
              product.nutriments?.carbohydrates_100g ??
              product.nutriments?.carbohydrates_value ??
              product.nutriments?.carbohydrates_prepared ??
              product.nutriments?.carbohydrates_prepared_100g ??
              product.nutriments?.carbohydrates_prepared_value ?? 0,
            itemFats:
              product.nutriments?.fat ??
              product.nutriments?.fat_100g ??
              product.nutriments?.fat_value ??
              product.nutriments?.fat_prepared ??
              product.nutriments?.fat_prepared_100g ??
              product.nutriments?.fat_prepared_value ?? 0,
          }),
        );
      }
      console.log(foodDataResponse)

      return res.status(200).json(foodDataResponse);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: "Internal Server Error" });
    }
  })
  .post('/dashboard/food-entry/save-item', async (req, res) => {
    try {
      if (!req.body || !req.body.weight || !req.body?.currentDate || !req.body?.field) return res.status(400).json({ message: 'invalid entry' });
            const token = req.cookies.user_session;
      if (!token)
        return res.status(401).json({ message: "user_session not found" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const dateString = req.body.currentDate;

      const usdaId = req.body.field.itemId;
      let defaultItemWeight = 0;

      if (req.body.field.itemSource === 'generic') {
        try {
          const response = await fetch(`https://api.nal.usda.gov/fdc/v1/food/${usdaId}?api_key=${process.env.USDA_API_KEY}`);
          if (!response.ok) {
            console.log(response);
          }

          const food = await response.json();
          const weight = food.foodPortions?.find(
            p => p.gramWeight != null
          )?.gramWeight ?? null;

          defaultItemWeight = weight;
        }
        catch (e) {
          console.log("USDA request failed:", e);
        }
      }
      else if (req.body.field.itemSource === 'packaged') {
        defaultItemWeight = req.body.field.defaultItemWeight
      }

      if (!defaultItemWeight) defaultItemWeight = req.body.weight;

      const entryObject = await DailyLog.foodEntryModel.create({
        itemId: req.body.field.itemId,
        itemSource: req.body.field.itemSource,
        userId: decoded.id,
        itemName: req.body.field.itemName,
        meal: req.body.field.meal,
        nutrition: {
          itemCalories: req.body.field.itemCalories,
          itemProtein: req.body.field.itemProtein,
          itemCarbs: req.body.field.itemCarbs,
          itemFats: req.body.field.itemFats,
        },
        itemWeight: req.body.weight,
        defaultItemWeight: defaultItemWeight,
        date: dateString,
      })

      return res.status(200).json(entryObject);
      
    }
    catch (e) {
      console.log(e)
      return res.status(409).json({ message: 'something went wrong' })
    }

  }).post('/dashboard/initialize-daily-bars', async (req, res) => {
    try {
      if (!req.body || !req.body.currentDate) return res.status(400).json({ message: 'Incorrect Request' });
      const token = req.cookies.user_session;
      if (!token)
        return res.status(401).json({ message: "user_session not found" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const userEntries = await DailyLog.foodEntryModel.find({ userId: decoded.id, date: req.body.currentDate });
      const currentWeight = user.weight;

      let dailyTargetCalories = 0;
      let dailyTargetProteins = 0;
      let dailyTargetCarbs = 0;
      let dailyTargetFats = 0;


      const dailyTarget = await DailyLog.dailyTargetModel.findOne({ userId: decoded.id, date: req.body.currentDate });
      if (!dailyTarget) {
        dailyTargetCalories = currentWeight * 32;
        dailyTargetProteins = currentWeight * 2;
        dailyTargetFats = currentWeight * 0.8;
        dailyTargetCarbs = currentWeight * 4;
      }
      else {
        dailyTargetCalories = dailyTarget.dailyTargetCalories;
        dailyTargetProteins = dailyTarget.dailyTargetProteins;
        dailyTargetCarbs = dailyTarget.dailyTargetCarbs;
        dailyTargetFats = dailyTarget.dailyTargetFats;
      }
      let totalDailyCalories = 0;
      let totalDailyCarbs = 0;
      let totalDailyFats = 0;
      let totalDailyProteins = 0;

      userEntries.forEach((item) => {
        totalDailyCalories += (item.itemWeight / 100) * item.nutrition.itemCalories;
        totalDailyProteins += (item.itemWeight / 100) * item.nutrition.itemProtein;
        totalDailyCarbs += (item.itemWeight / 100) * item.nutrition.itemCarbs;
        totalDailyFats += (item.itemWeight / 100) * item.nutrition.itemFats;
      });
      console.log(userEntries)


      return res.status(200).json({
        totalDailyCalories,
        totalDailyCarbs,
        totalDailyFats,
        totalDailyProteins,
        dailyTargetCalories,
        dailyTargetProteins,
        dailyTargetCarbs,
        dailyTargetFats,

      })

    }
    catch (e) {
      return res.status(404).json({});
    }
  }).post('/dashboard/get_item_submissions', async (req, res)=>{
    try{
      if(!req.body || !req.body.currentDate) return res.status(400).json({message:'incomplete data'});
      const token = req.cookies.user_session;
      if (!token)
        return res.status(401).json({ message: "user_session not found" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const userEntries = await DailyLog.foodEntryModel.find({ userId: decoded.id, date: req.body.currentDate });
      if(!userEntries) res.status(404).json({message:'entries not found'});
      return res.status(200).json(userEntries);
    }
    catch(e){
      console.log(e)
    }

  }).post('/dashboard/set-target', async (req,res)=>{
    try{
      if(!req.body || !req.body.currentDate) return res.status(400).json({message:'incomplete data'});
      const token = req.cookies.user_session;
      if (!token)
        return res.status(401).json({ message: "user_session not found" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if(!(await DailyLog.dailyTargetModel.exists({userId:decoded.id, date: req.body.currentDate}))){
        const newDailyTargetModel= await DailyLog.dailyTargetModel.create({
          dailyTargetCalories:req.body.calories,
          dailyTargetProteins: req.body.proteins,
          dailyTargetFats: req.body.fats,
          dailyTargetCarbs: req.body.carbs,
          userId: decoded.id,
          date:req.body.currentDate
        })
        console.log(newDailyTargetModel)
        if(newDailyTargetModel) return res.status(200).json({message:'model created'})
      }
      else{
        const updatedData= await DailyLog.dailyTargetModel.updateOne({userId:decoded.id,date:req.body.currentDate},{
          $set:{
          dailyTargetCalories:req.body.calories,
          dailyTargetProteins: req.body.proteins,
          dailyTargetFats: req.body.fats,
          dailyTargetCarbs: req.body.carbs
          }
        })
        console.log(updatedData)
        if(updatedData.matchedCount > 0) return res.status(200).json({message:'targets updated'})
      }
    }
    catch(e){
      console.log(e);
      return res.status(500).json({message:'Some error occured'});
      
    }
  })

module.exports = router;
