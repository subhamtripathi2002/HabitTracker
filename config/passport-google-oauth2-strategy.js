const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;     // we import the (passport-google-oauth) library here:
const crypto = require('crypto'); 
const User = require('../models/user');


// tell passport to use a new strategy for google login
passport.use(new googleStrategy({  // we create a new instance of the google strategy here
        clientID: '905609452707-ftcgmvrbh32kas8of6a8tjvc0suuqanv.apps.googleusercontent.com',
        clientSecret: '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', 
        callbackURL: "http://localhost:8080/users/auth/google/callback", // this is the callback url which we will use to redirect the user after the authentication is done
    },

    function(accessToken, refreshToken, profile, done){  // this is the callback function which will be called when the authentication is done
        // find a user 
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if (err){console.log('error in google strategy-passport', err); return;}
            console.log(accessToken, refreshToken);
            console.log(profile);

            if (user){
                // if found, set this user as req.user
                return done(null, user);
            }else{
                // if not found, create the user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if (err){console.log('error in creating user google strategy-passport', err); return;}

                    return done(null, user);
                });
            }

        }); 
    }

));


module.exports = passport;
