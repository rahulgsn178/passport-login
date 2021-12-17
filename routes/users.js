const express = require('express');
const passport = require('passport');
const router = express.Router();
const usersController = require('../controllers/users_controller');
const auth = require('../config/auth');


// Get Login Page
router.get('/login', auth.checkNotAuthenticated, (req, res) => res.render('login'));

// Get Register Page
router.get('/register', auth.checkNotAuthenticated, (req, res) => res.render('register'));

// Register New User
router.post('/register', auth.checkNotAuthenticated, usersController.registerUser);

// Login
router.post('/login', auth.checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
}));

// Logout
router.get('/logout', usersController.logout);

module.exports = router;