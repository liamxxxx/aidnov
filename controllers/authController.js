const User = require('../models/utilisateur');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const bcrypt = require('bcryptjs');
const ErrorHandler = require('../utils/errorHandler');
const Email = require('../utils/email');
const crypto = require('crypto');
const { promisify } = require('util');

// Sign token function
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Create and send token by cookies
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// Signup
exports.signup = asyncHandler(async (req, res, next) => {
  // Recuperation des donnees envoyer par l'utilisateur
  const {nom, prenoms, email, password, passwordConfirm, role} = req.body;

   // Creation de l'utilisateur
   const newUser = new User({
    nom, prenoms, email, password, passwordConfirm, role
  });

  // 2) Generation du token de confirmation du mail
  const emailToken = newUser.createEmailConfirmToken();

  // 3) Enregistrement des données 
  await newUser.save();

  // 4) Lien de confirmation de l'adresse Email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/emailconfirmation/${emailToken}`;

  try {
    await new Email(newUser, resetURL).sendWelcome();
    createSendToken(newUser, 201, res);
  } catch (err) {
    newUser.emailConfirmToken = undefined;
    newUser.emailConfirmExpires = undefined;
    await newUser.save({ validateBeforeSave: false });

    return next(
      new ErrorHandler('There was an error sending the email. Try again later!'),
      500
    );
  }
});

// Login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new ErrorHandler('Please provide email and password!', 400));
  }
  console.log('Email adresse', email);
  // 2) Check if user exists && password is correct
  const user = await User.findOne({'email': email});

  console.log('User: ',user)
  // Compare password
  const isVerifiedPassword = await bcrypt.compare(password, user.password);
 
  if (!user || !isVerifiedPassword ) {
    return next(new ErrorHandler('Incorrect email or password', 401));
  }
  else if (user.isVerified === false ) {
    return next(new ErrorHandler('Account not verified, Please check your email box !', 401))
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

// Protection 
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new ErrorHandler('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new ErrorHandler(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new ErrorHandler('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

// Reset password 
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new ErrorHandler('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

// Update password
exports.updatePassword = asyncHandler(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if posted current password is correct
  const correctPassword = await bcrypt.compare(req.body.passwordCurrent, user.password);

  if (!correctPassword) {
    return next(new ErrorHandler('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetpassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
   await new Email(user, resetURL).resetPassword();
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new ErrorHandler('There was an error sending the email. Try again later!'),
      500
    );
  }
})


exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expiresIn: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({
    status: 'success'
  });
});

exports.verifiedEmail = asyncHandler(async(req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    emailConfirmToken: hashedToken,
    emailConfirmExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new ErrorHandler('Token is invalid or has expired', 400));
  }
  user.isVerified = true;
  user.emailConfirmToken = undefined;
  user.emailConfirmExpires = undefined;
  await user.save({validateBeforeSave: false});

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler('You do not have permission to perform this action', 403)
      );
      }
    next();
  };
};
