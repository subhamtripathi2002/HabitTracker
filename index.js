const express = require('express');
// we Import (cookie-parser) library to create (cookies):
// so that we can do the manual-authentication on our application:
const cookieParser = require('cookie-parser');
const app = express();
const port = 8080;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

// here we import the (express-session) library:which we used with the (passport-local) library:for establishing the (user) authentication through the (passport-local) library:
// and (express-session) library:Is used to create the (session-cookie) for that (authentication):
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

const passportGoogle = require('./config/passport-google-oauth2-strategy');

// here we import the (connect-mongo) library:through which we will (store) the (session-cookie) of the (authentication) in the (database):
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customMware = require('./config/middleware');



app.use(express.urlencoded());

// here we connect our application with the (cookie-parser) library:
app.use(cookieParser());

app.use(express.static('./assets'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);




// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');
// here we use (express-session) library:To create a (session-cookie):
// for the user authentication with the (passport-local) library:
// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'Habit Tracker',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            mongoUrl:'mongodb+srv://amminabhavip13:cdRDp5ZQdkKcE2zZ @cluster0.4jtt2lt.mongodb.net/' ,
            autoRemove: 'disabled'
        
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));

// here we connect:our app with the (passport):
app.use(passport.initialize());
// here we connect:our app with the (passport's) session function:
// because  passport also maintains the (session-cookies):
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use('/', require('./routes'));


app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
