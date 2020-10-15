const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Exercise Schema
const ExerciseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  time:{
      type: Number,
      required: true,
  }
})


module.exports = Exercise = mongoose.model('Exercise',ExerciseSchema);