const express = require("express");
const router = express.Router();
const Multer = require("multer");
const gcsMiddlewares = require('../../middleware/google-cloud-helper');
const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Maximum file size is 10MB
  },
});
const mongoose = require('mongoose')

const UserProfile = require('../../models/UserProfile');

router.get('/getdetails', async (req, res) => {
  const { email } = req.query;
  const user = await User.findOne({ email: email });
  // Check if user exists
  if (!user) {
      let err = 'Could not find the given email!';
      res.status(401).send(err);
      return;
  }

  UserProfile.findOne({ email }).then(userProfile => {
    // Check if userProfile exists
    if (!userProfile) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    return res.status(200).json({ userProfile, role: user.role});
  });
});

router.get('/getdetailsbyid', (req, res) => {
  const { id } = req.query
  var hex = /[0-9A-Fa-f]{6}/g;
  userid = (hex.test(id))? mongoose.Types.ObjectId(id) : id;
  UserProfile.findOne({'_id': id }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    return res.status(200).json({ data: user });
  });
});

router.post('/updatedetails', (req, res) => {
  const { email, fullName, phone, city } = req.body;
  UserProfile.findOneAndUpdate({ email: email }, { $set: { fullName: fullName, phone: phone, city: city } }, { new: true }, (err, doc) => {
    if (err) {
      console.log("Something wrong when updating data!");
    }
    return res.status(200).json({ data: doc });
  })
});

// @route POST /api/users/profile/updatewellnessinfo
// @desc update a user's wellness information in the database
// @access Public
router.post('/updatewellnessinfo', async (req, res) => {
  // Get the access token from the header
  const { authorization } = req.headers;
  const accessToken = authorization.split(' ')[1];

  let session = await Session.findOne({ accessToken: accessToken });
  // Check if a session with this user exists
  if (!session) {
      let err = 'Could not find the given accessToken!';
      res.status(401).json(err);
      return;
  }

  const { age, gender, heightFeet, heightInches, weight, sleepHours, sleepMinutes, weightGoal, muscleMassGoal } = req.body;
  console.log(req.body)
  UserProfile.findOneAndUpdate(
    { email: session.email }, 
    { $set: { 
      age: age,
      gender: gender,
      heightFeet: heightFeet, 
      heightInches: heightInches, 
      weight: weight,
      sleepHours: sleepHours,
      sleepMinutes: sleepMinutes,
      weightGoal: weightGoal,
      muscleMassGoal: muscleMassGoal
    }}, 
    { new: true }, 
    (err, doc) => {
    if (err) {
      console.log("Something wrong when updating data!");
    }
    return res.status(200).json({ data: doc });
  })
});

router.post('/upload', multer.single('image'), gcsMiddlewares.sendUploadToGCS, (req, res, next) => {
  const { email } = req.body;
  if (req.file && req.file.gcsUrl) {
    UserProfile.findOneAndUpdate({ email: email }, { $set: { profileImage: req.file.gcsUrl } }, { new: true }, (err, doc) => {
      if (err) {
        return res.status(500).send('Unable to upload');
      }
      else
        return res.status(200).json({ data: req.file.gcsUrl });
    })
  }
});

module.exports = router;