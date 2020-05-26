const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

router
  .route('/')
  .get(authController.isLoggedIn, viewController.home)

router
  .route('/testmail')
  .get(viewController.viewMail)

router
  .route('/contact')
  .get(authController.isLoggedIn, viewController.contacts)

router
  .route('/about')
  .get(authController.isLoggedIn, viewController.about)

router
  .route('/login')
  .get(authController.isLoggedIn, viewController.login)

router
  .route('/register')
  .get(authController.isLoggedIn, viewController.register)

router
  .route('/forgot_password')
  .get(authController.isLoggedIn, viewController.forgotpassword);


router
  .route('/start_campagne')
  .get(authController.isLoggedIn, viewController.startcampagne);

router  
  .route('/create_campagne')
  .post(authController.isLoggedIn, viewController.uploadCampagnePhoto, viewController.create_campagne)

router
  .route('/donation')
  .get(authController.isLoggedIn, viewController.donation);

router
  .route('/email_verified/:token')
  .get(viewController.emailValidate);

router
  .route('/logout')
  .get(authController.isLoggedIn, viewController.logout)  

module.exports = router;