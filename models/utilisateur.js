const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userShemas = mongoose.Schema({
  nom: {
    type: String,
    trim: true,
    required: [true, 'nom is required !']
  },
  prenoms: {
    type: String,
    trim: true,
    required: [true, 'prenoms is required !']
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    validate: [validator.isEmail, 'valid email is required !'],
    trim: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: [true, 'password is required !'],
    select: false
  },
  password_confirmation: {
    type: String,
    required: [true, 'password confirmation is required !'],
    validate: {
      validator: function(el) {
        return el === this.password
      }, message : 'password not same !'
      }
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: true
  },
  password_reset_token: String,
  password_reset_expires: Date,
  email_confirmation_token: String,
  email_confirmation_expires: Date,
  password_changed_at: Date,
  role: {
    type: String,
    default: 'User',
    enum: ['User', 'Admin']
  }
});


// Hash du mot de passe avant qu'elle soit sauvegardé
userShemas.pre('save', async function (next) {
  // Verifie si le password n'est pas modifier
  if (!this.isModified('password')) return next();
  // Si le password est modifier alors on le hash
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.password_confirm = undefined;
  next();
});

// Methode de creation de token de reinitialisation de password
userShemas.methods.createPasswordResetToken = function() {

  // 1- On genere un token de maniere aléatoire
  const reset_token = crypto.randomBytes(32).toString('hex');

  //2- Ensuite on crée un hash à partir du token généré
  this.password_reset_token = crypto
    .createHash('sha256')
    .update(reset_token)
    .digest('hex');
  
  // 3- On defini le temps d'expiration du reset token
  this.password_reset_expires = Date.now() + 10 * 60 * 1000;

  // 4- On retourne le token
  return reset_token;
};

// Methode de creation de token de confirmation de mail
userShemas.methods.createEmailConfirmToken = function() {
  const email_token = crypto.randomBytes(32).toString('hex');
  this.email_confirmation_token = crypto
    .createHash('sha256')
    .update(email_token)
    .digest('hex');

  this.email_confirmation_expires = Date.now() + 10 * 60 * 1000;

  return email_token;
};

//TODO Methode qui verifie si n'as pas été changer avant le login
userShemas.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.password_changed_at) {
    const changedTimestamp = parseInt(
      this.password_changed_at.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

const User = mongoose.model('User', userShemas);

module.exports = User;