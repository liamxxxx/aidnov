const mongoose = require('mongoose');
// const hashPassword = require('../utils/hashPassword');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
  passwordConfirm: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailConfirmToken: String,
  emailConfirmExpires: Date,
  numero: String,
  mobileMoney: String
});

userShemas.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordConfirm = undefined;
  next();
});

userShemas.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userShemas.methods.createEmailConfirmToken = function() {
  const emailToken = crypto.randomBytes(32).toString('hex');
  this.emailConfirmToken = crypto
    .createHash('sha256')
    .update(emailToken)
    .digest('hex');

  console.log({ emailToken }, this.emailConfirmToken);

  this.emailConfirmExpires = Date.now() + 10 * 60 * 1000;

  return emailToken;
};

userShemas.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userShemas);

module.exports = User;