const express = require('express');
const router = express.Router();
const Company = require('../models/Company'); 


router.get('/', async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 }); 
    res.json(companies); 
  } catch (err) {
    res.status(500).json({ message: 'Error fetching companies', error: err });
  }
});


router.post('/', async (req, res) => {
  const newCompany = new Company({
    name: req.body.name,
    website: req.body.website,
    industry: req.body.industry,
    description: req.body.description,
    location: req.body.location,
    placementDate: req.body.placementDate,
    placementStatus: req.body.placementStatus,
    jobRoles: req.body.jobRoles,
    packageOffered: req.body.packageOffered,
    eligibilityCriteria: req.body.eligibilityCriteria,
    placementType: req.body.placementType,
    contactPerson: req.body.contactPerson,
    contactEmail: req.body.contactEmail,
    contactPhone: req.body.contactPhone
  });

  try {
    const savedCompany = await newCompany.save();
    res.status(201).json(savedCompany); 
  } catch (err) {
    if (err.code === 11000) {
        return res.status(400).json({ message: `Error: Company name '${req.body.name}' already exists.` });
    }
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation Error', errors: err.errors });
    }
    res.status(400).json({ message: 'Error creating company', error: err });
  }
});

router.get('/:id', async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json(company);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching company', error: err });
    }
});
router.get('/:id/placed-students', async (req, res) => {
    try {
        const companyId = req.params.id;
        
        
        const Student = require('../models/Student'); 

        const placedStudents = await Student.find({ 
            placedInCompany: companyId,
            status: 'Placed' 
        }).select('name branch studentId packageOffered');

        res.json(placedStudents);
    } catch (err) {
        console.error("Error fetching placed students:", err);
        res.status(500).json({ message: 'Error fetching placed students' });
    }
});


router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedCompany = await Company.findByIdAndUpdate(
            req.params.id,
            { placementStatus: status },
            { new: true, runValidators: true }
        );

        if (!updatedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json({ success: true, message: 'Status updated', data: updatedCompany });
    } catch (err) {
        res.status(400).json({ message: 'Error updating status', error: err });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const updatedCompany = await Company.findByIdAndUpdate(
            req.params.id, 
            req.body,      
            { new: true, runValidators: true } 
        );

        if (!updatedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json(updatedCompany); 
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: `Error: Company name already exists.` });
        }
        res.status(400).json({ message: 'Error updating company', error: err });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const deletedCompany = await Company.findByIdAndDelete(req.params.id);
        if (!deletedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json({ message: 'Company deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting company', error: err });
    }
});

module.exports = router;