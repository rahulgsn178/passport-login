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



module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
}