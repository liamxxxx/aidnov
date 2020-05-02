const mongoose = require('mongoose');
const User = require('../models/users');
const Donation = require('../models/donate');

const campagneShemas = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  nomCampagne: String,
  typeCampagne: {
    type: String,
    enum: ['Santé', 'Autres'],
  },
  montantDemande: Number,
  raison: String,
  photo: String,
  donateur: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Donation'
    }
  ],
  isVerified:{
    type: Boolean,
    default: false
  },
  montantObtenue: Number,
  isCompleted: {
    type: Boolean,
    default: false
  }
});

campagneShemas.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'nom prenoms'
  });
  next();
}); 

const Campagne = mongoose.model('Campagne', campagneShemas);

module.exports = Campagne;