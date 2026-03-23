const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ChantingLog = require('../models/ChantingLog');
const User = require('../models/User');

const getTodayDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD
};

// @route   GET /api/chanting/today
// @desc    Get today's chanting for logged-in user
// @access  Private
router.get('/today', protect, async (req, res) => {
  try {
    const today = getTodayDate();
    const log = await ChantingLog.findOne({ user: req.user._id, date: today });
    res.json({
      success: true,
      rounds: log ? log.rounds : 0,
      date: today
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching today\'s chanting' });
  }
});

// @route   POST /api/chanting/update
// @desc    ADD new rounds to today's total for logged-in user
// @access  Private
router.post('/update', protect, async (req, res) => {
  try {
    const { roundsToAdd } = req.body;

    if (roundsToAdd === undefined || roundsToAdd === null) {
      return res.status(400).json({ success: false, message: 'Rounds value is required' });
    }

    const parsed = parseInt(roundsToAdd, 10);
    if (isNaN(parsed) || parsed <= 0) {
      return res.status(400).json({ success: false, message: 'Please enter a valid number greater than 0' });
    }

    const today = getTodayDate();
    const existingLog = await ChantingLog.findOne({ user: req.user._id, date: today });

    let log;
    if (existingLog) {
      existingLog.rounds = existingLog.rounds + parsed;
      log = await existingLog.save();
    } else {
      log = await ChantingLog.create({
        user: req.user._id,
        date: today,
        rounds: parsed
      });
    }

    // Increment user's all-time total by the new rounds added
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { totalRoundsByMe: parsed } },
      { new: true }
    );

    res.json({
      success: true,
      message: `🙏 +${parsed} rounds added! Total today: ${log.rounds}`,
      rounds: log.rounds,
      totalRoundsByMe: updatedUser.totalRoundsByMe,
      date: today
    });
  } catch (err) {
    console.error('Chanting update error:', err);
    res.status(500).json({ success: false, message: 'Error updating chanting' });
  }
});

// @route   GET /api/chanting/history
// @desc    Get chanting history for logged-in user
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const logs = await ChantingLog.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(30);

    res.json({ success: true, history: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching history' });
  }
});

module.exports = router;
