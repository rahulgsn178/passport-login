module.exports.checkNotAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        return res.redirect('/dashboard');
    } 
    next();
}


module.exports.ensureAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to go to Dashboard'); 
    res.redirect('/users/login');
}