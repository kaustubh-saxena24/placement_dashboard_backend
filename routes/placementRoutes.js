const express = require('express');
const router = express.Router();
const placementController = require('../controllers/placementController');


router.post('/mark-placed', placementController.markStudentAsPlaced);

module.exports = router;