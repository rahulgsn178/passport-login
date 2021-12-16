const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/user');


// Get Login Page
router.get('/login', checkNotAuthenticated, (req, res) => res.render('login'));


// Get Sign up Page
router.get('/register', checkNotAuthenticated, (req, res) => res.render('register'));


router.post('/register', async (req, res) => {
    const { name, email, password, password2 } = req.body;
    const errors = [];
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "Please enter all the fields" });
    }

    if (password !== password2) {
        errors.push({ msg: "Password Incorrect" });
    }

    if (password.length < 6) {
        errors.push({ msg: "Password must be of atleast 6 characters" });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        try {
            let user = await User.findOne({ email: email });
            if (user) {
                errors.push({ msg: "Email already exists" });
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });  
            } else {

                // to make password hashed
                let salt = await bcrypt.genSalt();
                let hashedPassword = await bcrypt.hash(password, salt);

                const newUser = new User({
                    name,
                    email, 
                    password: hashedPassword
                });
                // saving the user
                await newUser.save();
                req.flash('success_msg', 'You are now registered and can login')
                res.redirect('/users/login');
            }
        } catch (err) {
            if (err) {
                console.log(err);
            }
        }
    }

});


// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });
  
  // Logout
  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });


function checkNotAuthenticated (req, res, next) {
    if(req.isAuthenticated()) {
        console.log('logged in');
        return res.redirect('/dashboard');
    } 
    console.log('not authenticated');
    next();
}
  
  module.exports = router;