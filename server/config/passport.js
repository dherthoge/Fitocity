const passportCustom = require('passport-custom');
const CustomStrategy = passportCustom.Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const util = require('util');
const UserProfile = require('../models/UserProfile');

module.exports = (passport) => {
    // Passport custom login strategy
    passport.use('login', new CustomStrategy(
        async (req, done) => {
            const email = req.body.email;
            const password = req.body.password;

            // Find user by email
            const user = await User.findOne({ email: email });

            // Check if user exists
            if (!user) {
                // Call passport's callback for error
                done('Could not find the given email!');
                return;
            }

            // Ensure the user is not a google user. If they are,
            // send error stating they need to sign in w/ google
            if (user.googleId) {
                // Call passport's callback for error
                done('Please sign in using your google account!');
                return;
            }

            // Check the user's password
            user.isValidPassword(password)
                .then((isValid) => {
                    // if the password is valid, return the user
                    if (isValid)
                        done(null, user);
                    else {
                        // Otherwise return an error
                        done('Invaild password!');
                    }
                })
                .catch((err) => {
                    console.error(err);
                    done(err);
                })
        }
    ));

    // Passport custom register strategy
    passport.use(
        'register',
        new CustomStrategy(
            async (req, done) => {
                const email = req.body.email;
                const user = await User.findOne({ email: email });
                if (user) {
                    done('Email already exists!');
                    return;
                }

                console.log(JSON.stringify(req.body));
                let role = 'user';
                if (req.body.isTrainer === "true")
                    role = 'trainer'
                let newUser = new User({
                    username: req.body.username,
                    name: req.body.name,
                    email: email,
                    password: req.body.password,
                    role: role
                });

                let newUserProfile = new UserProfile({
                    email: email,
                    user: newUser._id
                });

                newUserProfile.save().catch(err => {
                    console.error(err);
                    done(err);
                })
                newUser.profile = newUserProfile._id;
                newUser.save()
                    .then(user => {
                        done(null, user);
                    })
                    .catch(err => {
                    console.error(err);
                    done(err);
                })
            }
        )
    );

    // Passport Google auth strategy
    passport.use('google',
        new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:5000/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            // console.log(`passport-google profile ${JSON.stringify(profile)}`);
            let googleId = profile.id;
            try {
                // Try to find a user in the DB by their googleID
                await User.findOne({ googleId: googleId }).exec()
                    .then(async (user) => {
                        // console.log(`passport-google User ${JSON.stringify(user)}`);
                        // If a User was found return it 
                        if (user) {
                            done(null, user);
                        }
                        else {
                            // Create a User 
                            let newUser = new User({
                                name: `${profile.name.givenName} ${profile.name.familyName}`,
                                email: profile.emails[0].value,
                                password: googleId, // required but will never be used
                                googleId: googleId,
                                googleDisplayName: profile.displayName,
                            });

                            // Save the new User then return it
                            await newUser
                                .save()
                                .then((userDoc) => {
                                    done(null, userDoc);
                                })
                                .catch(err => { 
                                    done(err);
                                }
                            );
                        }
                    });
            } catch (err) {
                console.error(err);
            }
        })
    );

    // Returns the email associated with a user's authToken
    passport.use('jwt',
        new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_KEY,
        },
        async (token, done) => {
            console.log('here');
            try {
                console.log(`jwt-strategy-token: ${token.email}`);
                return done(null, token.email);
            } catch (error) {
                done(error);
            }
        }
    ));
}