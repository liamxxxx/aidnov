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

module.exports = router;