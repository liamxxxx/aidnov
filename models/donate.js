const mongoose = require('mongoose');
const Campagne = require('../models/campagne');

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


const Donation = mongoose.model('Donation', donationShemas);

module.exports = Donation;
