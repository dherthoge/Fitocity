const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MealSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: true
    },
    fat: {
        type: Number,
        required: true
    },
    protein: {
        type: Number,
        required: true
    },
    carbs: {
        type: Number,
        required: true
    },
    comments: {
        type: String
    },
    date: {
        type: Number,
        required: true
    }
});

module.exports = Meal = mongoose.model("meals", MealSchema);
