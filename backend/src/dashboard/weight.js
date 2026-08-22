const express = require("express");
const router = express.Router();
const { userModel } = require("../models/userModel.js");
const DailyLog = require("../models/weightEntry.js");
const jwt = require("jsonwebtoken");

const MAX_ENTRIES = 30;

router
  .post("/dashboard/weight-history", async (req, res) => {
    try {
      const token = req.cookies.user_session;
      if (!token)
        return res.status(401).json({ message: "user_session not found" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const entries = await DailyLog.weightEntryModel
        .find({ userId: decoded.id })
        .sort({ date: -1 })
        .limit(MAX_ENTRIES);

      entries.reverse(); // oldest first, matching chart order

      return res.status(200).json(entries);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Some error occured" });
    }
  })
  .post("/dashboard/log-weight", async (req, res) => {
    try {
      if (!req.body || !req.body.weight)
        return res.status(400).json({ message: "incomplete data" });

      const weightValue = Number(req.body.weight);
      if (Number.isNaN(weightValue) || weightValue <= 0)
        return res.status(400).json({ message: "invalid weight" });

      const token = req.cookies.user_session;
      if (!token)
        return res.status(401).json({ message: "user_session not found" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Collapse to a date-only string (YYYY-MM-DD), same shape currentDate
      // already takes elsewhere in this app (see Dashboard.jsx's date effect),
      // so this matches dailyTargetModel/foodEntryModel's date convention
      // instead of introducing a second date format just for weight.
      const now = new Date();
      const dateString =
        now.getFullYear() +
        "-" +
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0");

      let entry;
      if (
        !(await DailyLog.weightEntryModel.exists({
          userId: decoded.id,
          date: dateString,
        }))
      ) {
        entry = await DailyLog.weightEntryModel.create({
          userId: decoded.id,
          date: dateString,
          weight: weightValue,
        });
      } else {
        await DailyLog.weightEntryModel.updateOne(
          { userId: decoded.id, date: dateString },
          { $set: { weight: weightValue } }
        );
        entry = await DailyLog.weightEntryModel.findOne({
          userId: decoded.id,
          date: dateString,
        });
      }

      // Keep the user's current weight in sync — initialize-daily-bars
      // reads user.weight directly for the BMR-based target calc, so a
      // stale value there would silently desync targets from the trend.
      user.weight = weightValue;
      await user.save();

      return res.status(200).json(entry);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Some error occured" });
    }
  });

module.exports = router;