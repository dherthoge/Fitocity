const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    accessToken: {
        type: String,
        unique: true,
        required: true
    },
    refreshToken: {
        type: String,
        unique: true,
        required: true
    },
    mfaRequired: {
        type: Boolean,
        required: true
    },
    mfaVerified: {
        type: Boolean,
        default: 'false'
    }
});

module.exports = Session = mongoose.model("sessions", SessionSchema);
