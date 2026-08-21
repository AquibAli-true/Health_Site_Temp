const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    fdcId: { type: String, required: true },
    servingAmount: { type: Number, required: true },
    servingUnit: { type: String, default: 'g' },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true }
});

const dailyLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String,
        required: true,
        match: /^\d{4}-\d{2}-\d{2}$/
    },
    targetCalories: {
        type: Number,
        required: true
    },
    targetProtein: {
        type: Number,
        required: true
    },
    loggedWeight: {
        type: Number
    },
    meals: {
        breakfast: [foodItemSchema],
        lunch: [foodItemSchema],
        dinner: [foodItemSchema],
        snacks: [foodItemSchema]
    }
}, {
    timestamps: true
});

const foodEntrySchema = new mongoose.Schema({
    itemId: {
        type: String,
        required: true,
    },
    itemSource: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    itemName: {
        type: String,
        required: true,
    },
    nutrition: {
        itemCalories: {
            type: Number,
        },
        itemProtein: {
            type: Number,
        },
        itemCarbs: {
            type: Number,
        },
        itemFats: {
            type: Number,
        }
    },
    itemWeight: {
        type: Number,
        required: true
    },
    defaultItemWeight: {
        type: Number
    },
    meal: {
        type: String,
        required: true,
        enum: ["breakfast", "lunch", "dinner", "snacks"],
    },
    date: {
        type: "String",
        required: true
    }

},
    {
        timestamps: true
    })

const dailyTargetSchema = new mongoose.Schema({
    dailyTargetCalories: {
        type: Number,
        required: true
    },
    dailyTargetProteins: {
        type: Number,
        required: true
    },
    dailyTargetCarbs: {
        type: Number,
        required: true
    },
    dailyTargetFats: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    date: {
        type: String,
        required: true
    }

})

dailyLogSchema.index({ user: 1, date: 1 }, { unique: true });
const foodEntryModel = mongoose.model('foodEntryModel', foodEntrySchema);
const dailyTargetModel = mongoose.model('dailyTargetModel', dailyTargetSchema);

const DailyLog = mongoose.model('DailyLog', dailyLogSchema);
module.exports = {
    DailyLog,
    foodEntryModel,
    dailyTargetModel
}