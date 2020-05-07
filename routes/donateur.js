const express = require('express');
const router = express.Router();
const donateurController = require('../controllers/donateurController');

router
  .route('/')
  .get(donateurController.getAllDonateur)
  .post(donateurController.createDonateur)


router
  .route('/:id')
  .get(donateurController.getDonateur)
  .put(donateurController.updateDonateur)
  .delete(donateurController.deleteDonateur)

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