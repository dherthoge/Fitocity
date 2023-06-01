const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TrainerApprovalSchema = new Schema({
    email: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: [ 'inprocess', 'pending', 'approved', 'declined' ],
        default: 'inprocess'
    }
})

module.exports = TrainerApproval = mongoose.model("trainerApproval", TrainerApprovalSchema)