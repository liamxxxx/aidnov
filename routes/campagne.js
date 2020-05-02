const campagneController = require('../controllers/campagneController');
const express = require('express');
const router = express.Router();

router
  .route('/')
  .get(campagneController.getAllCampagne)
  .post(campagneController.createCampagne);

router
  .route('/:id')
  .get(campagneController.getCampagne)
  .delete(campagneController.deleteCampagne)
  .put(campagneController.updateCampagne)

module.exports = router;