const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 

// --- Route Imports ---
const studentRoutes = require('./routes/studentRoutes');
const companyRoutes = require('./routes/companyRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const collegeRoutes = require('./routes/collegeRoutes');
const authRoutes = require('./routes/authRoutes'); 

const placementRoutes = require('./routes/placementRoutes'); 

const app = express();
const PORT = process.env.PORT || 5000; 


app.use(cors()); 
app.use(express.json()); 


const dbURI = process.env.DB_URI;

if (!dbURI) {
  console.error("MongoDB URI not found in .env file. Please add DB_URI.");
  process.exit(1);
}

mongoose.connect(dbURI)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

// --- API Routes ---
app.use('/api/students', studentRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/college', collegeRoutes);

app.use('/api/placements', placementRoutes);


app.get('/', (req, res) => {
  res.send('Welcome to the Placement Dashboard API!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

module.exports = app;