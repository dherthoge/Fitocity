const express = require("express");
const router = express.Router();

// Util functions
const scoreCalculator = require("../../utils/scoreCalculator");
const dietaryRecommendationEngine = require("../../utils/dietaryRecommendationEngine");

// Load User model
const User = require("../../models/User");
const UserProfile = require("../../models/UserProfile");
const { type } = require("os");

router.get('/getrole', (req, res) => {
    const {email} = req.query;
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
          return res.status(404).json({ emailnotfound: "Email not found" });
        }
        return res.status(200).json({role: user.role})
    });
});

// @route GET /api/users/calculateWellnessScore
// @desc Returns the user's wellness score.
// @access Public
router.get('/calculateWellnessScore', async (req, res) => {
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

    let email = session.email;
    let user = await User.findOne({ email: email });
    // Check if the user exists
    if (!user) {
        let err = 'Could not find a user with the given email!';
        res.status(401).json(err);
        return;
    }

    let userProfile = await UserProfile.findOne({ email: email });
    // Check if the userProfile exists
    if (!userProfile) {
        let err = 'Could not find a user profile with the given email!';
        res.status(401).json(err);
        return;
    }
    
    const wellnessScore = await scoreCalculator.calculateWellnessScore(userProfile);
    if (wellnessScore === -1) {
        let err = 'User must have at least 3 meals logged!';
        res.status(401).json(err);
        return;
    }
    if (wellnessScore === -2) {
        let err = 'User must have at least 3 sleeps logged!';
        res.status(401).json(err);
        return;
    }
    if (wellnessScore === -3) {
        let err = 'User must have at least 3 workouts logged in the past week!';
        res.status(400).json(err);
        return;
    }
    
    res.status(200).json({ wellnessScore });
});

// @route GET /api/users/dietRecommendations
// @desc Returns dietary recommendations for the user.
// @access Public
router.get('/dietRecommendations', async (req, res) => {
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

    let email = session.email;
    let user = await User.findOne({ email: email });
    // Check if the user exists
    if (!user) {
        let err = 'Could not find a user with the given email!';
        res.status(401).json(err);
        return;
    }

    let userProfile = await UserProfile.findOne({ email: email });
    // Check if the userProfile exists
    if (!userProfile) {
        let err = 'Could not find a user profile with the given email!';
        res.status(401).json(err);
        return;
    }
    
    const recommendations = await dietaryRecommendationEngine.provideRecommendations(userProfile);
    if (recommendations === -1) {
        let err = 'User must have at least 3 meals logged and their profile page filled out!';
        res.status(400).json(err);
        return;
    }
    
    res.status(200).json({ recommendations });
});

module.exports = router;
