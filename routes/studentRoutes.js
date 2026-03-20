const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

router.get('/admin/pending-updates', async (req, res) => {
    try {
        const students = await Student.find({ hasPendingUpdate: true }).select('-password');
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.put('/:id/request-update', async (req, res) => {
    try {
        const updates = req.body;

        
        delete updates._id;
        delete updates.password; 
        delete updates.role;
        

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            {
                hasPendingUpdate: true,
                pendingUpdates: updates
            },
            { new: true }
        );

        if (!student) return res.status(404).json({ message: 'Student not found' });

        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/:id/update-decision', async (req, res) => {
    try {
        const { decision } = req.body; // 'approve' or 'decline'
        const student = await Student.findById(req.params.id);

        if (!student) return res.status(404).json({ message: "Student not found" });

        if (decision === 'approve') {
            
            await Student.findByIdAndUpdate(req.params.id, {
                $set: student.pendingUpdates,
                hasPendingUpdate: false,
                pendingUpdates: null
            });
            return res.json({ success: true, message: "Update Approved" });
        } 
        
        if (decision === 'decline') {
          
            await Student.findByIdAndUpdate(req.params.id, {
                hasPendingUpdate: false,
                pendingUpdates: null
            });
            return res.json({ success: true, message: "Update Declined" });
        }

        res.status(400).json({ message: "Invalid decision" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
  if (!req.body.password) {
    return res.status(400).json({ message: 'Password is required to create a student.' });
  }
  
  const newStudent = new Student({
    studentId: req.body.studentId,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password, 
    phone: req.body.phone,
    college: req.body.college,
    branch: req.body.branch,
    currentYear: req.body.currentYear,
    semester: req.body.semester,
    cgpa: req.body.cgpa,
    activeBacklogs: req.body.activeBacklogs,
    tenthGradePercentage: req.body.tenthGradePercentage,
    twelfthGradePercentage: req.body.twelfthGradePercentage,
    address: req.body.address,
    profilePicUrl: req.body.profilePicUrl,
    status: req.body.status,
    isEligibleForPlacement: req.body.isEligibleForPlacement,
    resumeUrl: req.body.resumeUrl,
    placedInCompany: req.body.placedInCompany,
    packageOffered: req.body.packageOffered,
    role: req.body.role
  });

  try {
    const salt = await bcrypt.genSalt(10);
    newStudent.password = await bcrypt.hash(newStudent.password, salt);

    const savedStudent = await newStudent.save();
    savedStudent.password = undefined; 
    res.status(201).json(savedStudent);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ message: `Error: A student with this ${field} already exists.` });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: err.errors });
    }
    res.status(400).json({ message: 'Error creating student', error: err });
  }
});

router.get('/', async (req, res) => {
  try {
    const students = await Student.find().select('-password').sort({ studentId: 1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching students', error: err });
  }
});

router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).select('-password');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching student', error: err });
    }
});

router.put('/:id', async (req, res) => {
    try {
      const updateData = req.body;
  
      if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
      } else {
        delete updateData.password; 
      }

      const updatedStudent = await Student.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true, runValidators: true } 
      ).select('-password');

      if (!updatedStudent) {
          return res.status(404).json({ message: 'Student not found' });
      }

      res.json(updatedStudent);
    } catch (err) {
      if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({ message: `Error: A student with this ${field} already exists.` });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation Error', errors: err.errors });
      }
      res.status(400).json({ message: 'Error updating student', error: err });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        
        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting student', error: err });
    }
});

module.exports = router;