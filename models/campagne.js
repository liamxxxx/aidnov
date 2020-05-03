const mongoose = require('mongoose');
const User = require('./utilisateur');
const Donation = require('./donateur');

const campagneShemas = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  nomCampagne: {
    type: String,
    required: true
  },
  typeCampagne: {
    type: String,
    required: true,
    enum: ['Santé', 'Social'],
  },
  montantDemande: {
    type: Number,
    required: true
  },
  raison: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  donateur: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Donation'
    }
  ],
  isVerified:{
    type: Boolean,
    default: false,
    select: false
  },
  montantObtenue: Number,
  isCompleted: {
    type: Boolean,
    default: false
  },
  isActived: {
    type: Boolean,
    default: false,
    select: false
  },
  createAt: {
    type: Date,
    default: Date.now()
  }
});

// Afficher les informations sur le user
campagneShemas.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'nom prenoms'
  });
  next();
}); 

// On affiche seulement les campagnes actifs
campagneShemas.pre(/^find/, function(next) {
  this.find({ isActived: { $ne: false }})
  next();
});

const Campagne = mongoose.model('Campagne', campagneShemas);

module.exports = Campagne;