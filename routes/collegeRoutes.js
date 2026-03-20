const express = require('express');
const router = express.Router();

const { 
    registerCollege, 
    loginCollege 
} = require('../controllers/collegeController'); 

/**
 * @route   POST /college/register (Mounted at /api/college)
 * @desc    Register a new college
 * @access  Public
 */
router.post('/register', registerCollege);

/**
 * @route   POST /college/login (Mounted at /api/college)
 * @desc    Authenticate a college
 * @access  Public
 */
router.post('/login', loginCollege);

module.exports = router;