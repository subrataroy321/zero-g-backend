const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  mass: {
    type: Number,
    // required: true
  },
  height: {
    type: Number,
    // required: true
  },
  age: {
    type: Number,
    // required: true
  },
  boneDensity: {
    type: Number,
    // required: true
  },
  imageId: {
    type: String,
  },
  exercises: [{    
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise'
  }],
  destination: {
    name: {
      type: String,
    },
    totalTripDays: {
      type: Number,
    },
    tripStarted: {
      type: Date,
    }
  }
});

module.exports = User = mongoose.model('User', UserSchema);
