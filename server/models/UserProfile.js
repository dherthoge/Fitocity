const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserProfileSchema = new Schema({
    fullName: {
      type: String
    },
    email: {
        type: String
    },
    phone: {
      type: String
    },
    city: {
      type: String
    },
    image: {
      type: String
    },
    profileImage: {
      type: String,
      default: "https://ui-avatars.com/api/?name=ME&size=256"
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users"
    },
    age: {
      type: Number
    },
    gender: {
      type: String,
      enum: [ 'Male', 'Female']
    },
    heightFeet: {
      type: Number
    },
    heightInches: {
      type: Number
    },
    weight: {
      type: Number
    },
    sleepHours: {
      type: Number
    },
    sleepMinutes: {
      type: Number
    },
    weightGoal: {
      type: String,
      enum: [ 'Loose', 'Maintain', 'Gain']
    },
    muscleMassGoal: {
      type: String,
      enum: [ 'Loose', 'Maintain', 'Gain']
    }
})
  
module.exports = UserProfile = mongoose.model("userProfile", UserProfileSchema)