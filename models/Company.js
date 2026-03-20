const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const companySchema = new Schema({
  
  
  name: {
    type: String,
    required: true,
    unique: true, 
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  location: {
    type: String, 
    trim: true
  },
  

  placementDate: {
    type: Date
  },
  placementStatus: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed', 'Not Scheduled'], 
    default: 'Not Scheduled'
  },
  
  jobRoles: [{
    type: String, 
    trim: true
  }],
  packageOffered: {
    type: String, 
    trim: true
  },
  eligibilityCriteria: {
    type: String, 
    trim: true
  },
  placementType: {
    type: String,
    enum: ['On-Campus', 'Off-Campus', 'Pool-Campus', 'Internship'],
    default: 'On-Campus'
  },
  
 
  contactPerson: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    trim: true
    
  },
  contactPhone: {
    type: String,
    trim: true
  }
  
}, {
  timestamps: true
});


module.exports = mongoose.model('Company', companySchema);