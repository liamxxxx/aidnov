const mongoose = require('mongoose');

const campagneShemas = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Utilisateur est obligatoire']
  },
  nomCampagne: {
    type: String,
    required: [true, 'Campagne est obligatoire']
  },
  typeCampagne: {
    type: String,
    required: [true, 'Type de campagne est obligatoire'],
    enum: ['Santé', 'Social'],
  },
  montantDemande: {
    type: Number,
    required: [true, 'Montant demandé est obligatoire']
  },
  raison: {
    type: String,
    required: [true, 'Raison est obligatoire']
  },
  photo: {
    type: String,
  },
  isVerified:{
    type: Boolean,
    default: false,
    select: false
  },
  isActived: {
    type: Boolean,
    default: true,
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
// campagneShemas.pre(/^find/, function(next) {
//   this.find({ isActived: { $ne: false }})
//   next();
// });

const Campagne = mongoose.model('Campagne', campagneShemas);

module.exports = Campagne;