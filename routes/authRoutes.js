const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

 
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
   
    const student = await Student.findOne({ email: email.toLowerCase() })
                                 .select('+password'); 

    if (!student) {
      
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    
    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        studentId: student.studentId
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

