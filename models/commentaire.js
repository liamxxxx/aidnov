const mongoose = require('mongoose');
const Donateur = require('./donateur');
const Campagne = require('./campagne');

const commentShemas = mongoose.Schema({
  donateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation'
  },
  message: String,
  Date: {
    type: Date,
    default: Date.now(),
  },
  campagne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campagne'
  }
});

// Afficher les informations du donateur
commentShemas.pre(/^find/, function(next) {
  this.populate({
    path: 'donateur',
    select: 'nom prenoms'
  });
  next();
});

commentShemas.pre(/^find/, function(next) {
  this.populate({
    path: 'campagne',
    select: 'nom prenoms'
  });
  next();
});

const Comment = mongoose.model('Comment', commentShemas);

module.exports = Comment;