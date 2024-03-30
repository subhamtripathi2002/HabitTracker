const Habit = require('../models/habitModel');
const User = require('../models/user');
module.exports.home = async function(req, res){

    try{
       // populate the user of each post
        let habit = await Habit.find({})
        .populate('user')
        .populate({
            path: 'description',
            populate: {
                path: 'user'
            }
        });
    
        let users = await User.find({});

        return res.render('home', {   // this is home.ejs in views folder of Habit-Tracker folder 
            title: "Habit Tracker",
            all_users: users
        });

    }catch(err){
        console.log('Error', err);
        return;
    }
   
}

