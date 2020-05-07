const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userShemas = mongoose.Schema({
  nom: {
    type: String,
    trim: true,
    required: [true, 'Nom est obligatoire']
  },
  prenoms: {
    type: String,
    trim: true,
    required: [true, 'Prenoms est obligatoire']
  },
  email: {
    type: String,
    required: [true, 'Email est obligatoire'],
    validate: [validator.isEmail, 'Entrez un email valide'],
    trim: true,
    // lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Mot de passe est obligatoire']
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirmation du mot de passe est obligatoire'],
    validate: {
      validator: function(el) {
        return el === this.password
      }, message : 'Mots de passe non identiques'
      }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailConfirmToken: String,
  emailConfirmExpires: Date,
  passwordChangedAt: Date,
  role: {
    type: String,
    default: 'User',
    // required: [true, 'Role est obligatoire'],
    enum: ['User', 'Admin']
  }
});

userShemas.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
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

userShemas.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};


const User = mongoose.model('User', userShemas);

module.exports = User;