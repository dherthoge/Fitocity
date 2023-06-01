const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SleepSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
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

module.exports = Sleep = mongoose.model("sleeps", SleepSchema);
