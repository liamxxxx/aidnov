const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donateController');

router
  .route('/')
  .get(donationController.getAllDonates)
  .post(donationController.createDonate)


router
  .route('/:id')
  .get(donationController.getDonate)
  .put(donationController.updateDonate)
  .delete(donationController.deleteDonate)


module.exports = router;