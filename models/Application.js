const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const applicationSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company', 
    required: true,
  },
  status: {
    type: String,
    enum: ['Applied', 'Interviewing', 'Offered', 'Rejected'],
    default: 'Applied',
  },
  
  studentCompanyUnique: {
    type: String,
    unique: true,
  }
}, {
  timestamps: true
});


applicationSchema.pre('save', function (next) {
  this.studentCompanyUnique = `${this.student}-${this.company}`;
  next();
});

module.exports = mongoose.model('Application', applicationSchema);

