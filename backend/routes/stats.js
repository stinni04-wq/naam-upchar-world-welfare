const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ChantingLog = require('../models/ChantingLog');
const User = require('../models/User');

const getTodayDate = () => new Date().toISOString().split('T')[0];

// @route   GET /api/stats/global
// @desc    Get global stats - total rounds today by all, total rounds ever for world welfare
// @access  Private
router.get('/global', protect, async (req, res) => {
  try {
    const today = getTodayDate();

    // Total rounds chanted today by ALL users
    const todayResult = await ChantingLog.aggregate([
      { $match: { date: today } },
      { $group: { _id: null, total: { $sum: '$rounds' } } }
    ]);

    // Total rounds chanted ever by ALL users (world welfare)
    const allTimeResult = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$totalRoundsByMe' } } }
    ]);

    // Total number of registered devotees
    const devoteeCount = await User.countDocuments();

    res.json({
      success: true,
      stats: {
        roundsChantedToday: todayResult[0]?.total || 0,
        totalRoundsWorldWelfare: allTimeResult[0]?.total || 0,
        totalDevotees: devoteeCount
      }
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ success: false, message: 'Error fetching global stats' });
  }
});

module.exports = router;
