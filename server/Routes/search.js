const express = require("express");
const router = express.Router();
const WorkoutVideo = require('../models/WorkoutVideo');
const User = require("../models/User");

router.get('/videos', (req, res) => {
    const { query } = req.query;
    WorkoutVideo.find({ title: { "$regex": query, "$options": "i" } }).populate('postedBy').then(video => {
        if (!video) {
            return res.status(404).json({ data: 'No videos found for your search query' })
        }
        else {
            return res.status(200).json({ data: video })
        }
    })
});

router.get('/all', (req, res) => {
    WorkoutVideo.find({}).populate('postedBy').then(video => {
        if (!video) {
            return res.status(404).json({ data: 'No videos found for your search query' })
        }
        else {
            return res.status(200).json({ data: video })
        }
    })
});

router.get('/users', (req, res) => {
    const { query } = req.query;
    const userProfiles = []
    User.find({ name: { "$regex": query, "$options": "i" }, role: "trainer" }).populate("profile").then(user => {
        if (!user) {
            res.status(404).json({ data: 'No users found for your search query' })
        }
        else {
            user.forEach(profile => {
                userProfiles.push(profile.profile)
            })
            return res.status(200).json({ data: userProfiles })
        }
    })
});


module.exports = router