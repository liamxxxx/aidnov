const mongoose = require('mongoose');
const validator = require('validator');

const donationShemas = mongoose.Schema({
  nom: {
    type: String,
    default: 'Anonyme'
  },
  prenoms: String,
  email: {
    type: String,
    validate: [validator.isEmail, 'Email valide obligatoire'],
    required: [true, 'Email obligatoire']
  },
  montant: {
    type: Number,
    required: [true, 'Montant obligatoire']
  },
  campagne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campagne'
  },
  createAt: {
    type: Date,
    default: Date.now()
  }
});

// donationShemas.pre(/^find/, function(next) {
//   this.populate({
//     path: 'campagne',
//     select: 'nomCampagne typeCampagne montantDemande'
//   });
//   next();
// });

const Donation = mongoose.model('Donation', donationShemas);

module.exports = Donation;
