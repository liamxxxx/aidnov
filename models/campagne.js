const mongoose = require('mongoose');
const User = require('../models/users');
const Donation = require('../models/donate');

const campagneShemas = mongoose.Schema({
  users: {
    type: mongoose.Schema.ObjectId,
    ref: User
  },
  nomCampagne: String,
  cause: {
    type: String,
    enum: ['Santé', 'Autres'],
  },
  montantDemande: Number,
  raison: String,
  photo: String,
  donateur: [
    {
      type: mongoose.Schema.ObjectId,
      ref: Donation
    }
  ],
  isVerified: {
    type: Boolean,
    default: false
  },
  montantObtenue: Number,
  isCompleted: {
    type: Boolean,
    default: false
  }
});

const Campagne = mongoose.model('Campagne', campagneShemas);

module.exports = Campagne;