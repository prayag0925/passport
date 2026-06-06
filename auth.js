


const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  req.flash('error_msg', 'Please log in to access this page.');
  res.redirect('/login');
};


const checkNotAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard');
  }
  next();
};

module.exports = { checkAuth, checkNotAuth };
