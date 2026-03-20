const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Student = require('../models/Student'); 

router.post('/', async (req, res) => {
  const { studentId, companyId } = req.body;

  try {
    
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!student.isEligibleForPlacement) {
      return res.status(400).json({ message: 'Student is not eligible for placements' });
    }

    const existingApplication = await Application.findOne({ student: studentId, company: companyId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this company' });
    }

  
    const newApplication = new Application({
      student: studentId,
      company: companyId,
      status: 'Applied', 
    });

    await newApplication.save();
    
    res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        data: newApplication
    });

  } catch (err) {
    console.error("Application Error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


router.get('/student/:studentId', async (req, res) => {
  try {
    const applications = await Application.find({ student: req.params.studentId })
      .populate('company', 'name role') 
      .sort({ createdAt: -1 });

    res.json({
        success: true,
        count: applications.length,
        data: applications
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


router.get('/company/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;


    const applications = await Application.find({ company: companyId })
      .populate('student', 'name email phone branch cgpa resumeUrl studentId') 
      .sort({ createdAt: -1 }); 

    if (!applications) {
        return res.status(200).json({ success: true, data: [] });
    }

    const studentList = applications.map(app => {
        
        if(!app.student) return null; 

        return {
            _id: app.student._id,            
            applicationId: app._id,           
            studentId: app.student.studentId, 
            name: app.student.name,
            email: app.student.email,
            branch: app.student.branch,
            cgpa: app.student.cgpa,
            resume: app.student.resumeUrl,
            status: app.status,               
            appliedAt: app.createdAt
        };
    }).filter(item => item !== null); 

    res.json({
        success: true,
        count: studentList.length,
        data: studentList
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;