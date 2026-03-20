const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  studentId: { 
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true 
  },
  name: { 
    type: String,
    required: true,
    trim: true
  },
  email: { 
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String,
    required: true,
    select: false 
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  college: { 
    type: String,
    required: true,
    trim: true
  },
  branch: { 
    type: String,
    required: true,
    trim: true
  },
  currentYear: { 
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  semester: { 
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  cgpa: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  activeBacklogs: { 
    type: Number,
    default: 0
  },
  tenthGradePercentage: { 
    type: Number
  },
  twelfthGradePercentage: { 
    type: Number
  },
  address: { 
    type: Object, 
    default: {}
  },
  profilePicUrl: { 
    type: String,
    trim: true
  },
  status: { 
    type: String,
    enum: ['Not Placed', 'Placed', 'Interviewing', 'Internship'], 
    default: 'Not Placed'
  },
  isEligibleForPlacement: { 
    type: Boolean,
    default: true 
  },
  resumeUrl: { 
    type: String,
    trim: true
  },
  placedInCompany: { 
    type: Schema.Types.ObjectId,
    ref: 'Company' 
  },
  packageOffered: { 
    type: String, 
    trim: true
  },
  role: { 
    type: String,
    enum: ['Student', 'Admin'],
    default: 'Student'
  },

 
  hasPendingUpdate: {
    type: Boolean,
    default: false
  },
  pendingUpdates: {
    type: Object,
    default: null
  }
 
}, {
  timestamps: true 
});

module.exports = mongoose.model('Student', studentSchema);