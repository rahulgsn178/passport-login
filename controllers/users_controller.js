const User = require('../models/user');
const bcrypt = require('bcryptjs');


module.exports.registerUser = async (req, res) => {
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

}

module.exports.resetPassword = async (req, res) => {
    let user;
    const { password } = req.body;
    const errors = [];
    if (!password) {
        errors.push({ msg: "Please enter all the fields" });
    }

    if (password.length < 6) {
        errors.push({ msg: "Password must be of atleast 6 characters" });
    }

    if (errors.length > 0) {
        try {
            user = await User.findById(req.params.id);
        } catch(err) {
            if (err) {
                console.log(err);
            } 
        }
        res.render('dashboard', {
            errors,
            password,
            user
        });
    } else {
        try {
            user = await User.findById(req.params.id);
            console.log('oldpassword ', user.password);
            // to make password hashed
            let salt = await bcrypt.genSalt();
            let hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
            await user.save();
            console.log('newpassword ', user.password);
            req.flash('success_msg', 'Password successfully changed')
            res.redirect('back');
        } catch (err) {
            if (err) {
                console.log(err);
            }
        }
    }
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
}