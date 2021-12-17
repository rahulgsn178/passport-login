const express = require('express');
const router = express.Router();
const auth = require('../config/auth');

// Get Home Page
router.get('/', auth.checkNotAuthenticated, (req, res) => res.render('home'));

// Get Dashboard
router.get('/dashboard', auth.ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

module.exports = router; 