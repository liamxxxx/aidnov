const mongoose = require('mongoose');
const Donateur = require('../models/donate');
const Campagne = require('../models/campagne');

const commentShemas = mongoose.Schema({
  donateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Donateur
  },
  message: String,
  Date: {
    type: Date,
    default: Date.now(),
  },
  campagne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Campagne
  }
});

const Comment = mongoose.model('Comment', commentShemas);

module.exports = Comment;