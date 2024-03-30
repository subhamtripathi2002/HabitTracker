const mongoose = require('mongoose');   // we import the (mongoose) library here:
mongoose.set('strictQuery', true);     // we set the (strictQuery) property of the (mongoose) library to (true):

mongoose.connect('mongodb+srv://amminabhavip13:cdRDp5ZQdkKcE2zZ @cluster0.4jtt2lt.mongodb.net/');     // we connect our application with the (mongodb) database through the (mongoose) library:

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB")); // if there is any error in connecting to the database then we print the error on the console:


db.once('open', function(){         // if the connection is successful then we print the message on the console:
    console.log('Connected to Database :: MongoDB');
});


module.exports = db;
