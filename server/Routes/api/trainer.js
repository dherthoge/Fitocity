const express = require('express');
const path = require("path");
const router = express.Router();
const TrainerApproval = require('../../models/TrainerApproval');
const Multer = require("multer");
const gcsMiddlewares = require('../../middleware/google-cloud-helper');
const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Maximum file size is 10MB
  },
});
const WorkoutVideo = require('../../models/WorkoutVideo');
const e = require('connect-flash');
const UserProfile = require('../../models/UserProfile')
var mongoose = require('mongoose')


router.post('/approval', (req, res) => {
  TrainerApproval.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newApproval = new TrainerApproval({
        email: req.body.email,
        description: req.body.description
      })

      newApproval.save()
        .then(user => { return res.json(user) })
        .catch(err => console.log(err));
    }
  })
})

router.get('/approvals', (req, res) => {
  const { email } = req.query;
  TrainerApproval.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ data: "Email not found" });
    }
    return res.status(200).json({ status: user.status })
  });
})

router.post('/upload', multer.single('file'), gcsMiddlewares.sendUploadToGCS, (req, res, next) => {
  let { email, title, category, tags } = req.body;
  tags = tags.split(','); // The tags are concatenated when sending a requst with FormData

  if (req.file && req.file.gcsUrl) {
    UserProfile.findOne({ email: email }).then( user => {
      console.log({
        url: req.file.gcsUrl,
        title: title,
        postedBy: user._id,
        category: category,
        tags: tags
      });
      const video = new WorkoutVideo({
        url: req.file.gcsUrl,
        title: title,
        postedBy: user._id,
        category: category,
        tags: tags
      })
      video.save().then(vid => {res.status(200).json(vid)}).catch(err => console.log(err))
    })
  }
  else {
    return res.status(400).json({ email: "Something went wrong" });
  }
});

router.get('/videos', (req,res) => {
  const {email} = req.query;
  UserProfile.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ data: "Email not found" });
    }
    else {
      WorkoutVideo.find({postedBy: user._id}).then(video => {
        if(!video)
        {
          return res.status(404).json({data: 'No videos found'});
        }
        else
        {
          return res.status(200).json({data: video});
        }
      })
    }
  });
})

router.get('/videosbyid', (req,res) => {
  const { id } = req.query
  var hex = /[0-9A-Fa-f]{6}/g;
  userid = (hex.test(id))? mongoose.Types.ObjectId(id) : id;
  UserProfile.findOne({'_id': id }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ data: "No user not found" });
    }
    else {
      WorkoutVideo.find({postedBy: user._id}).then(video => {
        if(!video)
        {
          return res.status(404).json({data: 'No videos found'})
        }
        else
        {
          return res.status(200).json({data: video})
        }
      })
    }
  });
})

module.exports = router;