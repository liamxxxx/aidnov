const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const authController = require('../controllers/authController');

router
  .route('/:id')
  .get(userController.getUser)

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

router.use(authController.protect)

router
  .route('/:id  ')
  .delete(authController.restrictTo('Admin'), userController.deleteUser)

router
  .route('/updateMe')
  .patch(authController.restrictTo('User'), userController.updateMe)

router
  .route('/')
  .get(authController.restrictTo('Admin'), userController.getAllUsers)
    
router
  .route('/deleteMe')
  .delete(authController.restrictTo('User'), userController.deleteMe);

router
  .route('/deleteUser')
  .delete(authController.restrictTo('Admin'), userController.deleteUser);

router
  .route('/updatepassword')
  .patch(authController.updatePassword)
  
module.exports = router;