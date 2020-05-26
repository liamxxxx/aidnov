const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const authController = require('../controllers/authController');

router
  .route('/:id')
  .get(userController.getUser)

router
  .route('/register')
  .post(authController.signup);

router
  .route('/login')
  .post(authController.login);

router 
  .route('/logout')
  .get(authController.logout);

router
  .route('/reset_password/:token')
  .patch(authController.resetPassword)

router
  .route('/forgot_password')
  .post(authController.forgotPassword)

// router
//   .route('/email_confirmation/:token')
//   .get(authController.verifiedEmail)

router.use(authController.protect)

router
  .route('/:id  ')
  .delete(authController.restrictTo('Admin'), userController.deleteUser)

router
  .route('/update_me')
  .patch(authController.restrictTo('User'), userController.updateMe)

router
  .route('/')
  .get(authController.restrictTo('Admin'), userController.getAllUsers)
    
router
  .route('/delete_me')
  .delete(authController.restrictTo('User'), userController.deleteMe);

router
  .route('/delete_user')
  .delete(authController.restrictTo('Admin'), userController.deleteUser);

router
  .route('/update_password')
  .patch(authController.updatePassword)
  
module.exports = router;