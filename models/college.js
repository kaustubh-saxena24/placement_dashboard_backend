const mongoose = require('mongoose');


const collegeSchema = new mongoose.Schema(
  {
    collegeName: {
      type: String,
      required: [true, 'College name is required'],
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'College email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, 
    },
    tpoName: {
      type: String,
      required: [true, "TPO (Training and Placement Officer) name is required"],
      trim: true,
    },
    tpoEmail: {
      type: String,
      required: [true, 'TPO contact email is required'],
      trim: true,
    },
    tpoPhone: {
      type: String,
      required: [true, 'TPO contact phone is required'],
      trim: true,
    },
    jobPostings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
    ],
  },
  { timestamps: true }
);



module.exports = mongoose.model('College', collegeSchema);
