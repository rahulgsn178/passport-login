require('dotenv').config();

const express = require('express');
const db = require('./config/mongoose');
const passport = require('passport');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');



const app = express();


// Passport Config
require('./config/passport-local-strategy')(passport);


// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));


// Express session
app.use(session({
    name: 'user-auth',
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
}));




app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Customise middleware
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});




// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users')); 




const PORT = process.env.PORT || 5000;


app.listen(PORT, console.log(`Server is running on : ${PORT}`));