const mongoose = require('mongoose');

const userShemas = mongoose.Schema({
  nom: {
    type: String,
    trim: true,
    required: true
  },
  prenoms: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  confirmPassword: String,
  verified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  },
  numero: String,
  mobileMoney: String
});


const User = mongoose.model('User', userShemas);

module.exports = User;