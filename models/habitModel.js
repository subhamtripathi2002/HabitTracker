// here we create the (model) for our appplication:through which we can store  (habits) in the database:

const mongoose = require('mongoose');

// before creating the (modeL):we have to create the (schema) for that (model): 
const HabitSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Number,
  },
  streak: {
    type: Number,
  },
  creation_date: {
    type: Number,
  },
  user: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  days: [],
});

const Habit = mongoose.model('Habit', HabitSchema);

module.exports = Habit;
