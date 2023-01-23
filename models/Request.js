const mongoose = require('mongoose');
const User = require('./Users');
const Team = require('./Teams');

const RequestSchema = new mongoose.Schema({
  teamName:{
    type: String
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  requested_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requested_from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = Request = mongoose.model('request', RequestSchema);