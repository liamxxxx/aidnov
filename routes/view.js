const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');

router
  .route('/')
  .get(viewController.viewMail)


module.exports = router;