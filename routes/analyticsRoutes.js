const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Company = require('../models/Company');
const Application = require('../models/Application');


const getDateRange = (filter) => {
  const now = new Date();
  let currentStartDate = new Date();
  let previousStartDate = new Date();

  switch (filter) {
    case 'Last 3 Months':
      currentStartDate.setMonth(now.getMonth() - 3);
      previousStartDate.setMonth(now.getMonth() - 6);
      break;
    case 'Last 6 Months':
      currentStartDate.setMonth(now.getMonth() - 6);
      previousStartDate.setMonth(now.getMonth() - 12);
      break;
    case 'Last Year':
      currentStartDate.setFullYear(now.getFullYear() - 1);
      previousStartDate.setFullYear(now.getFullYear() - 2);
      break;
    case 'All Time':
      currentStartDate = new Date(0); 
      previousStartDate = new Date(0);
      break;
    case 'Last Month':
    default:
      currentStartDate.setMonth(now.getMonth() - 1);
      previousStartDate.setMonth(now.getMonth() - 2);
      break;
  }
  return [currentStartDate, previousStartDate, now];
};


const calculatePercentChange = (current, previous) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0; 
  }
  const change = ((current - previous) / previous) * 100;
  return parseFloat(change.toFixed(2));
};


router.get('/stats', async (req, res) => {
  try {
    const filter = req.query.filter || 'Last Month';
    const [currentStartDate, previousStartDate, now] = getDateRange(filter);

 
    const currentPlaced = await Student.countDocuments({
      status: 'Placed',
      updatedAt: { $gte: currentStartDate, $lt: now }
    });
    const previousPlaced = await Student.countDocuments({
      status: 'Placed',
      updatedAt: { $gte: previousStartDate, $lt: currentStartDate }
    });

    
    const currentVisits = await Company.countDocuments({
      placementDate: { $gte: currentStartDate, $lt: now }
    });
    const previousVisits = await Company.countDocuments({
      placementDate: { $gte: previousStartDate, $lt: currentStartDate }
    });

   
    const currentApps = await Application.countDocuments({
      createdAt: { $gte: currentStartDate, $lt: now }
    });
    const previousApps = await Application.countDocuments({
      createdAt: { $gte: previousStartDate, $lt: currentStartDate }
    });

    const currentAppPerCompany = currentVisits > 0 ? (currentApps / currentVisits) : currentApps;
    const previousAppPerCompany = previousVisits > 0 ? (previousApps / previousVisits) : previousApps;

   
    const placedChange = calculatePercentChange(currentPlaced, previousPlaced);
    const visitsChange = calculatePercentChange(currentVisits, previousVisits);
    const appPerCompanyChange = calculatePercentChange(currentAppPerCompany, previousAppPerCompany);

    const stats = {
      placedStudents: {
        value: currentPlaced,
        percentage: Math.abs(placedChange),
        isPositive: placedChange >= 0
      },
      companyVisits: {
        value: currentVisits,
        percentage: Math.abs(visitsChange),
        isPositive: visitsChange >= 0
      },
      appPerCompany: {
        value: parseFloat(currentAppPerCompany.toFixed(1)),
        percentage: Math.abs(appPerCompanyChange),
        isPositive: appPerCompanyChange >= 0
      }
    };
    
    
    if (filter === 'All Time') {
        stats.placedStudents.percentage = 0;
        stats.companyVisits.percentage = 0;
        stats.appPerCompany.percentage = 0;
    }

    res.json(stats);

  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
});

module.exports = router;
