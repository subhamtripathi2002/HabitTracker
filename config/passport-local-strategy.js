const passport = require('passport');
const bcrypt=require('bcryptjs');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');


// authentication using passport 
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
},
function(req,email, password, done){
    // find a user and establish the identity
    User.findOne({email: email}, function(err, user)  {
        if (err){
            console.log('Error in finding user --> Passport');
            return done(err);
        }
       // If user not found or password does not match 
        if (!user ){
        console.log('Invalid Username/Password');
        req.flash('error','Invalid Username/Password');
        return done(null, false);
        }
    // compare password entered by user with the password stored in database using bcrypt.compare function 
        bcrypt.compare(password, user.password, (err, result) => {
            if (err){ throw err;}
            if (result) 
            {
                req.flash('success','Logged in successfully');
                return done(null, user);}
            else 
            {
                req.flash('error','Invalid Username/Password');
                return done(null, false, );}
        });
    });
}


));
// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});
// deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err);
        }

        return done(null, user);
    });
});


// check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    // if the user is signed in, then pass on the request to the next function(controller's action)
    if (req.isAuthenticated()){
        console.log("Authenticated");
        return next();
    }

    // if the user is not signed in
    console.log("Not authenticated");
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if (req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }

    next();
}



module.exports = passport;