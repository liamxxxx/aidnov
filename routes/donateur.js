const express = require('express');
const router = express.Router();
const donateurController = require('../controllers/donateurController');
const authController = require('../controllers/authController');

router
  .route('/')
  .get(donateurController.getAllDonateur)
  .post(donateurController.createDonateur)

router.use(authController.protect)  
router
  .route('/:id')
  .get(donateurController.getDonateur)
  .put(authController.restrictTo('Admin'), donateurController.updateDonateur)
  .delete(authController.restrictTo('Admin'), donateurController.deleteDonateur)

router
  .route('/lastdonate/:id')
  .get(donateurController.getLastFiveDonate)

router
  .route('/donatebycampagne/:id')
  .get(donateurController.getCampagneByDonate)

// router
//   .route('/statsdonation')
//   .get(donateurController.statsDonation)

module.exports = router;