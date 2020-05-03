const mongoose = require('mongoose');

const donationShemas = mongoose.Schema({
  nom: String,
  prenoms: String,
  email: String,
  montant: Number,
  campagne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campagne'
  }
});

donationShemas.pre(/^find/, function(next) {
  this.populate({
    path: 'campagne',
    select: 'nomCampagne typeCampagne montantDemande'
  });
  next();
});

const Donation = mongoose.model('Donation', donationShemas);

module.exports = Donation;
