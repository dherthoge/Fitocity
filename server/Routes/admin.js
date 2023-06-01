const express = require('express')
const path = require("path");
const router = express.Router()
const UserProfileSchema = require("../models/UserProfile");
const WorkoutVideoSchema = require('../models/WorkoutVideo');
const UserSchema = require('../models/User');
const TrainerApprovalSchema = require('../models/TrainerApproval');
const User = require("../models/UserProfile");

require ('dotenv').config()
// const express = require('./Routes/admin')
const app = express();
const adminRoutes = require('../Routes/admin')
const cors = require("cors")
app.use(express.json())
app.use(cors())



router.get('/showusers', (req, res) => {

  UserProfileSchema.find({}).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ data: "No User Found" });
    }
    // return res.json(data)
    return res.json(user)
  });
});


router.get('/showtrainers', (req, res) => {

  UserSchema.find({role:"trainer"}).then(trainer => {
    // Check if user exists
    if (!trainer) {
      return res.status(404).json({ data: "No Trainer Found" });
    }
    return res.json(trainer)
  });
});




router.get('/showvideos', (req, res) => {

  WorkoutVideoSchema.find({}).then(video => {
    // Check if user exists
    if (!video) {
      return res.status(404).json({ data: "No Workout Found" });
    }
    return res.json(video)
  });
});

router.get('/showvideos/:id', (req, res) => {

  WorkoutVideoSchema.findByIdAndDelete(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      return res.json(data)
  
    }
  })
  
});


router.get('/approvetrainers', (req, res) => {

  TrainerApprovalSchema.find({}).then(approval => {
    // Check if user exists
    if (!approval) {
      return res.status(404).json({ data: "No requests Found" });
    }
    return res.json(approval)
  });
});

// router.get('/approvetrainers/:id', (req, res) => {

//   TrainerApprovalSchema.findById(req.params.id, (error, data) => {
//     if (error) {
//       return next(error)
//     } else {
//       return res.json(data)
//       // console.log(res.params.id)
//     }
//   })
  
// });

router.get('/traineractions/', (req, res, next) => {
  TrainerApprovalSchema.findByIdAndUpdate(req.query.id, {
    $set: {status: req.query.action} }, { new: true }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data)
      console.log('Updated successfully !')
    }
  })
})






module.exports = router