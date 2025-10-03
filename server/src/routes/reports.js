const express = require('express');
const Report = require('../models/Report');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Submit a report
router.post('/', auth, async (req, res) => {
  try {
    const { reportedUser, reportedContent, type, reason, description } = req.body;

    const report = new Report({
      reportedBy: req.user._id,
      reportedUser,
      reportedContent,
      type,
      reason,
      description
    });

    await report.save();

    res.status(201).json({ 
      message: 'Report submitted successfully',
      reportId: report._id 
    });
  } catch (error) {
    console.error('Submit report error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's reports (for tracking)
router.get('/my-reports', auth, async (req, res) => {
  try {
    const reports = await Report.find({ reportedBy: req.user._id })
      .select('type reason status createdAt')
      .sort('-createdAt')
      .limit(20);

    res.json(reports);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
