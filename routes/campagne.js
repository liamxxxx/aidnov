const campagneController = require('../controllers/campagneController');
const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();

router
  .route('/:id')
  .get(campagneController.getCampagne)
  
router
    .route('/')
    .post( authController.protect,
      authController.restrictTo('User', 'Admin'), campagneController.uploadCampagnePhoto,
      campagneController.createCampagne);

router
  .route('/')
  .get(campagneController.getAllCampagne)

router
  .route('/:id')
  .delete(authController.protect, authController.restrictTo('Admin'), campagneController.deleteCampagne)
  .patch(authController.protect, authController.restrictTo('User', 'Admin'))
  .put(authController.protect, authController.restrictTo('User','Admin'), campagneController.updateCampagne)

router
  .route('/remove/:id')
  .patch(authController.protect, authController.restrictTo('User', 'Admin'), campagneController.deactivatedCampagne)

router
  .route('/:id/validate')
  .patch(authController.protect, authController.restrictTo('Admin'), campagneController.verifiedCampagne)
module.exports = router;