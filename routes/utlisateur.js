const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const authController = require('../controllers/authController');

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser)

router
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .put(userController.updateUser)

router
  .route('/signup')
  .post(authController.signup);

router
  .route('/login')
  .post(authController.login);

router
  .route('/resetpassword/:token')
  .patch(authController.resetPassword)

router
  .route('/forgotpassword')
  .post(authController.forgotPassword)

router
  .route('/emailconfirmation/:token')
  .patch(authController.verifiedEmail)
  
module.exports = router;