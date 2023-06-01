const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const url = require('url');
const User = require('../models/User');
const Session = require('../models/Session');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const authenticator = require('otplib').authenticator;
const util = require('util');

// Makes a new Session for the user if there isn't
// one in the database already
const getSession = async (user, done) => {
    console.log(JSON.stringify(user));
    // Store the user's id and email
    const _id = user._id;
    const email = user.email;
    const mfaRequired = user.enrolled_in_mfa;

    let session = undefined;
    // If the user already has a refresh token in the db
    // return their current access token 
    await Session.findOne({ email: email })
        .exec()
        .then((doc) => {
            session = doc;
            // console.log(`found doc: ${JSON.stringify(doc)}`);
        })
        .catch((err) => {
            console.error(`getSession err: ${err}`);
            done('Could not use the given email to search for a refresh token!');
        }
    );

    if (session) {
        done(null, session);
        return;
    }

    // User does not have a current session
    // Generate an access token/refresh token
    const body = { _id: _id, email: email };
    const accessToken = jwt.sign(body, process.env.JWT_SECRET_KEY, { expiresIn: '20m'});
    const refreshToken = jwt.sign(body, process.env.JWT_REFRESH_KEY);

    // Save the session and its associated info
    new Session({
        email: email,
        accessToken: accessToken,
        refreshToken: refreshToken,
        mfaRequired: mfaRequired
    }).save()
        .then((doc) => {
            // Return the token
            done(null, doc);
        })
        .catch(err => { 
            console.error(err);
            done('Could not save refresh JWT!');
        }
    );
};

// @desc    Authenticate w/ Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /auth/google/callback
// rediredt user to React dashboard page
router.get('/google/callback',
    async (req, res, next) => {
        passport.authenticate(
            'google', 
            { 
                scope: ['profile', 'email'], 
                failureRedirect:'http://localhost:3000/login' 
            },
            async (err, user) => {
                // console.log(`/google/callback user ${JSON.stringify(user)}`);
                if (err) 
                    res.redirect('http://localhost:3000/login');
                else {
                    // Get the session information for the user
                    getSession(user, (err, session) => {
                        if (err)
                            res.redirect('http://localhost:3000/login');
                        else {
                            const refreshToken = session.refreshToken;
                            const accessToken = session.accessToken;
                            const mfaRequired = session.mfaRequired;
                            const mfaVerified = session.mfaVerified;

                            // Determine where to route the user based on MFA
                            const pathname = mfaRequired ? '/twoFactor' : '/dashboard';

                            // Return the tokens
                            const dashboardUrl = url.format({
                                protocol: 'http',
                                host: 'localhost:3000',
                                pathname: pathname,
                                query: {
                                    authToken: accessToken,
                                    refreshToken: refreshToken,
                                    mfaRequired: mfaRequired,
                                    mfaVerified: mfaVerified
                                }
                            });
                            res.redirect(dashboardUrl);
                        }
                    });
                }
            }
        )(req, res, next);
    }
);

// @route POST /auth/login
// @desc begin passport custom auth process
// @access Public
router.post('/login', 
    async (req, res, next) => {
        // Authenticate the user using passport-local
        passport.authenticate('login', 
            async (err, user) => {
                if (err)
                    res.status(400).json(err);
                    
                try {
                    // If the user isn't found log the error and return it
                    if (err || !user)
                        return next(err);

                    const _id = user._id; // store the user's _id for easy access
                    const email = user.email; // store the user's eamil for easy access

                    // Get the session information for the user
                    getSession(user, (err, session) => {
                        if (err)
                            res.status(500).json(err);
                        else {
                            const refreshToken = session.refreshToken;
                            const accessToken = session.accessToken;
                            const mfaRequired = session.mfaRequired;
                            const mfaVerified = session.mfaVerified;

                            // Return the tokens and mfa info
                            res.status(200).json({
                                accessToken,
                                refreshToken,
                                mfaRequired,
                                mfaVerified
                            });
                        }
                    });
                } catch (err) {
                    res.status(500).json('Could not issue JWT!');
                }
            }
        )(req, res, next);
    }
);

// @route POST /auth/login/mfa
// @desc begin passport custom auth process
// @access Public
router.post('/login/mfa', 
    async (req, res, next) => {

        // Get the access token from the header
        const authHeader = req.headers.authorization;
        const accessToken = authHeader.split(' ')[1];
        const token = req.body.code;

        let session = await Session.findOne({ accessToken: accessToken });
        // Check if a session with this user exists
        if (!session) {
            let err = 'Could not find the given accessToken!';
            res.status(401).json(err);
            return;
        }
        let user = await User.findOne({ email: session.email });
        // Check if user exists
        if (!user) {
            let err = 'Could not find the given email!';
            res.status(401).send(err);
            return;
        }

        // If the token is valid, mark the user as verified in the DB and return the verification
        let isValid = authenticator.check(token, user.mfa_secret);
        if (isValid) {
            const mfaVerified = true;
            await session.updateOne({
                mfaVerified: mfaVerified
            });
            res.status(200).json({ mfaVerified });
            return;
        }
        else {
            let err = 'Token invalid!';
            res.status(401).send(err);
        }
    }
);

// @route POST /auth/token
// @desc create a new access token for the user
// @access Public
router.post('/token', 
    async (req, res, next) => {
        // Get the access token from the body
        const refreshValue = req.body.refreshToken;
        const refreshToken = refreshValue.split(' ')[1];

        // If they didn't send a token, send unauthorized response code
        if (!refreshToken) {
            return res.sendStatus(401);
        }

        // Find the refresh token in the db
        await Session.findOne({ refreshToken: refreshToken }).exec()
            .then((session) => {

                if (!session) {
                    res.sendStatus(403);
                    return;
                }
            
                // Verify the refresh token is correct
                try {    
                    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (err, user) => {
                        if (err) res.sendStatus(403);
                
                        // Generate a new access token from the refresh token
                        const accessToken = jwt.sign(
                            { 
                                _id: user._id, 
                                username: user.username 
                            }, 
                            process.env.JWT_SECRET_KEY, 
                            { expiresIn: '20m' }
                        );
                        // Remove the old refresh token entry in the db
                        await Session
                            .findByIdAndRemove({ _id: session._id })
                            .catch(err => { 
                                console.error(err);
                                res.status(500).json('Could not delete old token!');
                            });
        
                        // Make new refresh token entry
                        const newSession = new Session({
                            email: session.email,
                            accessToken: accessToken,
                            refreshToken: refreshToken
                        })
                        // Put new entry in db and error if there is an issue
                        await newSession
                            .save()
                            .then((doc) => {
                                res.status(200).json({
                                    accessToken
                                });
                            })
                            .catch(err => { 
                                console.error(err);
                                res.status(500).json('Could not save refresh JWT!');
                            });
                    });
                } catch (err) {
                    res.sendStatus(500);
                }
            })
            .catch((err) => {
                res.sendStatus(403);
            });
    }
);

// @route   POST /auth/logout
// @desc    Logout user
// removes user's refresh token entry from the db
router.post('/logout', 
    (req, res, next) => {
        // Get the access token from the header
        const authHeader = req.headers.authorization;
        const accessToken = authHeader.split(' ')[1];

        // Remove the refresh token entry from the db
        Session.findOneAndRemove({ accessToken: accessToken }, (err, doc) => {
            if (!doc)
                res.status(500).json(`User was not logged in!`);
            else if (err)
                res.status(500).json(`Could not log out user with access token: ${accessToken}`);
            else
                res.status(200).json('Logout sucessful!');
        });
    }
);

// @route POST /auth/register
// @desc Register user
// @access Public
router.post('/register',
    (req, res, next) => {
        passport.authenticate(
            'register',
            { session: false },
            (err, user) => {
                try {
                    // If the user wasn't created log the error and return it
                    if (err || !user) {
                        res.status(400).json(err);
                        return;
                    }

                    const _id = user._id; // store the user's _id for easy access
                    const email = user.email; // store the user's eamil for easy access

                    // Get a refresh token and access token for the user
                    getSession(user, (err, session) => {
                        if (err)
                            res.status(500).json(err);
                        else {
                            const refreshToken = session.refreshToken;
                            const accessToken = session.accessToken;
                            // Return the tokens
                            res.status(200).json({
                                accessToken,
                                refreshToken
                            });
                        }
                    });
                } catch (err) {
                    console.error(err);
                    res.status(500).json('Could not issue JWT!');
                }
            }
        )(req, res, next);
    }
);

// @route POST /auth/forgotPassword
// @desc Issue a resetPasswordToken if the user is found in the database
// @access Public
router.post('/forgotPassword',
    async (req, res) => {
        // Get the email from the body
        let email = req.body.email;
        if (email === '')
            res.status(400).send('Email required!');

        let user = await User.findOne({ email: email });
        // Check if user exists
        if (!user) {
            // Call passport's callback for error
            res.status(400).send('Could not find the given email!');
            return;
        }

        // Ensure the user is not a google user. If they are,
        // send error stating they need to sign in w/ google
        if (user.googleId) {
            // Call passport's callback for error
            res.status(400).send('Please sign in using your google account!');
            return;
        }

        // Create a resetPasswordToken and store it in the user w/ an expiration of 1 hr
        const resetPasswordToken = crypto.randomBytes(20).toString('hex');
        await user.updateOne({
            resetPasswordToken: resetPasswordToken,
            resetPasswordExpires: Date.now() + 60 * 60 * 1000 // One hour in milliseconds
        });

        // Create a SMTP transporter to send mail to the user
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: `${process.env.FORGOT_PASSWORD_EMAIL_ADDRESS}`,
                pass: `${process.env.FORGOT_PASSWORD_EMAIL_PASSWORD}`
            }
        });

        // Configure the email
        const mailOptions = {
            from: `${process.env.FORGOT_PASSWORD_EMAIL_ADDRESS}`,
            to: email,
            subject: 'Link To Reset Password',
            text:
            'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
            + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
            + `http://localhost:3000/resetPassword?resetPasswordToken=${resetPasswordToken}\n\n`
            + 'If you did not request this, please ignore this email and your password will remain unchanged!\n',
        };

        // Send the eamil
        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.error(err);
                res.status(500).json('Could not send recovery email!');
            } else {
                res.status(200).json('Recovery email sent!');
            }
        });
    }
);

// @route POST /auth/resetPassword
// @desc Consume a reset token as a body parameter and a password 
// @access Public
router.post('/resetPassword',
    async (req, res) => {
        // Get the password and reset token from the body
        let password = req.body.password;
        let resetPasswordToken = req.body.resetPasswordToken;
        if (password === '')
            res.status(400).send('Password required!');
        if (resetPasswordToken === '')
            res.status(400).send('Password required!');

        // Search for the user by resetPasswordToken (and verify it is with
        // 1 hour of being issued)
        let u = await User.findOne({email:'dylanh.3006@gmail.com'}).then((u) => console.log(u))
        
        let user = await User.findOne({ 
            resetPasswordToken: resetPasswordToken,
            resetPasswordExpires: {
                $gte: Date.now(),
            }
         });
        // Check if user exists
        if (!user) {
            // Call passport's callback for error
            res.status(400).send('Invalid resetPasswordToken!');
            return;
        }

        let hashedPassword = await bcrypt.hash(password, 10);
        // Update the user with the new password
        user.updateOne({
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null
        }).then((user) => {
            res.status(200).json('Password reset!');
        }).catch((err) => {
            console.error(err);
            res.status(500).json('Could not save password!')
        });



    }
);

// @route GET /auth/mfa/google/authenticator/info
// @desc Returns a qr code URL and secret for Google Authenticator for the user
// @access Public
router.get('/mfa/google/authenticator/info',
    async (req, res, next) => {
        // Get the access token from the header
        const authHeader = req.headers.authorization;
        const accessToken = authHeader.split(' ')[1];

        Session.findOne({ accessToken: accessToken }, async (err, session) => {
            if (err) {
                console.error(err);
                res.status(500).send('Could not query the database!');
            }
            
            let email = session.email;
            let user = await User.findOne({ email: email });
            // Check if user exists
            if (!user) {
                res.status(401).send('Could not find the given email!');
                return;
            }

            // Create otpUrl and a qr code for a Google Authenticator account
            let mfa_secret = user.enrolled_in_mfa ? user.mfa_secret : authenticator.generateSecret();
            let otpUrl = `otpauth://totp/${process.env.APP_NAME}:${email}?secret=${mfa_secret}&issuer=${process.env.APP_NAME}`;
            let qrImage = `https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=${encodeURIComponent(otpUrl)}`;
            
            if (user.enrolled_in_mfa) 
                // Return qr code url
                res.status(200).json({ qrImage, mfa_secret });
            else {
                // Update the user to enrolled and store their mfa key
                user.updateOne({
                    enrolled_in_mfa: true,
                    mfa_secret: mfa_secret
                }, (err, doc) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Could not query the database!');
                    }
                    else
                        // Return qr code url
                        res.status(200).json({ qrImage });
                });
            }
        });
        
    }
);

// @route GET /auth/sessionInfo
// @desc Returns the following JSON object containing information pertaining 
// to the user's session
// {
//     authTokenValid: boolean,
//     mfaRequired: boolean,
//     mfaVerified: boolean
// }
// @access Public
router.get('/sessionInfo',
    async (req, res, next) => {
        // Get the access token from the header
        const authHeader = req.headers.authorization;
        const accessToken = authHeader.split(' ')[1];

        Session.findOne({ accessToken: accessToken }, async (err, session) => {
            if (err || !session) {
                console.error(`/sessionInfo err: ${err}`);
                res.status(500).send('Could not query the database!');
                return;
            }

            // The auth token is valid because it was found in the db 
            const authTokenValid = true; 
            const mfaRequired = session.mfaRequired;
            const mfaVerified = session.mfaVerified;
            const email = session.email;
            res.status(200).json({ 
                authTokenValid,
                mfaRequired,
                mfaVerified,
                email
            });
        });
        
    }
);

module.exports = router;

