const express = require('express');
const passport = require('passport');
const router = express.Router();

// Get Home Page
router.get('/', checkNotAuthenticated, (req, res) => res.render('home'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);


function ensureAuthenticated (req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to go to Dashboard'); 
    res.redirect('/users/login');
}


function checkNotAuthenticated (req, res, next) {
    if(req.isAuthenticated()) {
    return res.redirect('/dashboard');
    } 
    next();
}


module.exports = router; 