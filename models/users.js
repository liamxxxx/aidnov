const mongoose = require('mongoose');

const userShemas = mongoose.Schema({
  nom: String,
  prenoms: String,
  email: String,
  password: String,
  confirmPassword: String,
  verified: {
    type: Boolean,
    default: false
  },
  isActive: Boolean,
  numero: String,
  mobileMoney: String
});


const User = mongoose.model('User', userShemas);

module.exports = User;