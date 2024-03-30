const Habit = require('../models/habitModel');
const Month = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
//controller for habitspage
module.exports.habitsPage = (req, res) => {
  Habit.find({}, (err, habits) => {
    return res.render('../views/habit-tracker/dashboard.ejs', {
      title: 'Habits Dashboard',
      habits: habits,
    });
  });
};
//create new habit.
module.exports.create = (req, res) => {
  let today = new Date();
  let date = today.getDate();
  Habit.create(
    {
      description: req.body.habit,
      creation_date: date,
      days: ['None', 'None', 'None', 'None', 'None', 'None', 'None'],
      completed: 0,
      streak: 0,
    },
    (err, habit) => {
      if (err) {
        console.log('Error while creating Habit', err);
        req.flash('error','error while creating habit');
        return res.redirect('back');
      }
      console.log(habit);
      req.flash('success','Habit created successfully');

      return res.redirect('back');
    }
  );
};

//action for deleting habit
module.exports.delete = (req, res) => {
  let id = req.params.id;
  Habit.findByIdAndDelete(id, function (err, habit) {
    if (err) {
      console.log('error in deleting from database');
      return res.redirect('back');
    }
    console.log('Successfully deleted Habit');
    req.flash('success','Habit deleted successfully');

    return res.redirect('back');
  });
};

//checking update status
module.exports.weeklyview = (req, res) => {
  //send date array
  let date = new Date();
  let days = [];
  for (let i = 0; i < 7; i++) {
    let d =
      date.getDate() + ',' + Month[date.getMonth()] + ' ' + date.getFullYear();
    date.setDate(date.getDate() - 1); //decrease date one by one
    days.push(d);
  }
  //reverse array for desired
  days.reverse();
  Habit.find({}, function (error, habits) {
    updateData(habits);
    if (error) {
      console.log('Error while fetching data from Atlas DB', error);
      return res.redirect('/');
    }
    return res.render('../views/habit-tracker/weeklyview.ejs', {
      title: 'Habits Weekly View',
      habits: habits,
      days,
    });
  });
};

//action for updating status
module.exports.update = (req, res) => {
  let id = req.params.id;
  let day = req.params.day;
  let status = req.params.status;
  Habit.findById(id, (error, habit) => {
    if (error) {
      console.log(error);
    req.flash('error','error while updating habit');

      return res.redirect('back');

    }
    habit.days[day] = status;
    habit.save();
    updateStreakandCompleted(habit);
    req.flash('success','Habit updated successfully');

    return res.redirect('back');
  });
};

//function to update values
let updateData = (habits) => {
  let todaysDate = new Date().getDate();
 //looping through all habits and updating data in database 
 //if habit is created today then no need to update data in database 
 //if habit is created before today then update data in database
 //if habit is created before 7 days then update data in database
  for (let habit of habits) {
    let id = habit.id;
    let diff = todaysDate - habit.creation_date;
//if diff is 0 or 1 then no need to update data in database 
    if (diff > 0 && diff < 8) {
      for (let i = diff, j = 0; i < habit.days.length; i++, j++) {
        habit.days[j] = habit.days[i];
      }
      let remPos = habit.days.length - diff;
      for (let i = remPos; i < habit.days.length; i++) {
        habit.days[i] = 'None';
      }
      //update creation date and streak and completed values in database
      habit.creation_date = todaysDate;
      updateStreakandCompleted(habit);
      habit.save();
    } else if (diff > 7) {
      for (let i = 0; i < 7; i++) {
        habit.days[i] = 'None';
        habit.creation_date = todaysDate;
        updateStreakandCompleted(habit);
        habit.save();
      }
    }
  }
};
//function to update streak and completed values in database for a habit 
let updateStreakandCompleted = async (habit) => {
  try {
    let curr_completed = 0;
    let maxStreak = 0; 
    let curr_streak = 0;
    for (let i = 0; i < habit.days.length; i++) {
      if (habit.days[i] == 'Done') {
        curr_completed++;
        curr_streak++;
      } else {
        if (curr_streak > maxStreak) {
          maxStreak = curr_streak;
          curr_streak = 0;
        } else {
          streak = 0;
        }
      }
    }
//update values in database for a habit 
    if (curr_streak > maxStreak) {
      maxStreak = curr_streak;
    }
    await Habit.findByIdAndUpdate(habit.id, {
      streak: maxStreak,
      completed: curr_completed,
    });
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
};
