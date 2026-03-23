const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '365d' });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, city, state, country, mobile } = req.body;

    if (!name || !city || !state || !country || !mobile) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'This mobile number is already registered. Please login instead.',
        alreadyExists: true
      });
    }

    const user = await User.create({ name, city, state, country, mobile });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Jai Shri Ram 🙏',
      token,
      user: {
        id: user._id,
        name: user.name,
        city: user.city,
        state: user.state,
        country: user.country,
        mobile: user.mobile,
        totalRoundsByMe: user.totalRoundsByMe
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login by mobile number
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ success: false, message: 'Mobile number is required' });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this mobile number. Please register first.',
        notFound: true
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: `Welcome back, ${user.name}! 🙏`,
      token,
      user: {
        id: user._id,
        name: user.name,
        city: user.city,
        state: user.state,
        country: user.country,
        mobile: user.mobile,
        totalRoundsByMe: user.totalRoundsByMe
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user (for auto-login on app load)
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      city: req.user.city,
      state: req.user.state,
      country: req.user.country,
      mobile: req.user.mobile,
      totalRoundsByMe: req.user.totalRoundsByMe
    }
  });
});

module.exports = router;
