const passport = require('passport');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');




const showLogin = (req, res) => {
  const errors = req.flash('error');
  const success = req.flash('success_msg');
  const error_msg = req.flash('error_msg');
  res.render('login', { errors, success_msg: success, error_msg });
};


const showRegister = (req, res) => {
  const errors = req.flash('error');
  const success_msg = req.flash('success_msg');
  const error_msg = req.flash('error_msg');
  res.render('register', { errors, success_msg, error_msg });
};


const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, password2 } = req.body;
    let errors = [];


    if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Please fill in all fields.' });
    }
    if (password !== password2) {
      errors.push({ msg: 'Passwords do not match.' });
    }
    if (password && password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters.' });
    }


    if (errors.length > 0) {
      return res.render('register', { errors, name, email, success_msg: [], error_msg: [] });
    }


    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      errors.push({ msg: 'That email is already registered.' });
      return res.render('register', { errors, name, email, success_msg: [], error_msg: [] });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const newAdmin = new Admin({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await newAdmin.save();
    req.flash('success_msg', 'You are now registered! Please log in.');
    res.redirect('/login');
  } catch (err) {
    console.error('Register Error:', err);
    req.flash('error_msg', 'Something went wrong. Please try again.');
    res.redirect('/register');
  }
};


const loginAdmin = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
};


const logoutAdmin = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash('success_msg', 'You have been logged out.');
    res.redirect('/login');
  });
};




const showDashboard = async (req, res) => {
  try {

    const totalAdmins = await Admin.countDocuments();

    const recentAdmins = await Admin.find().sort({ createdAt: -1 }).limit(5);

    res.render('dashboard', {
      admin: req.user,
      totalAdmins,
      recentAdmins,
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg'),
    });
  } catch (err) {
    console.error('Dashboard Error:', err);
    res.redirect('/login');
  }
};


const showProfile = (req, res) => {
  res.render('profile', {
    admin: req.user,
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('error_msg'),
  });
};




const showAddAdmin = (req, res) => {
  res.render('add-admin', {
    admin: req.user,
    errors: [],
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('error_msg'),
  });
};


const addAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let errors = [];


    if (!name || !email || !password) {
      errors.push({ msg: 'Please fill in all required fields.' });
    }
    if (password && password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters.' });
    }

    if (errors.length > 0) {
      return res.render('add-admin', { admin: req.user, errors, success_msg: [], error_msg: [] });
    }


    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      errors.push({ msg: 'An admin with that email already exists.' });
      return res.render('add-admin', { admin: req.user, errors, success_msg: [], error_msg: [] });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const imageName = req.file ? req.file.filename : 'default-avatar.png';


    const newAdmin = new Admin({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      image: imageName,
    });

    await newAdmin.save();
    req.flash('success_msg', 'Admin added successfully!');
    res.redirect('/view-admin');
  } catch (err) {
    console.error('Add Admin Error:', err);
    req.flash('error_msg', 'Error adding admin. Please try again.');
    res.redirect('/add-admin');
  }
};


const showViewAdmin = async (req, res) => {
  try {

    const admins = await Admin.find().sort({ createdAt: -1 });
    res.render('view-admin', {
      admin: req.user,
      admins,
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg'),
    });
  } catch (err) {
    console.error('View Admin Error:', err);
    req.flash('error_msg', 'Error fetching admins.');
    res.redirect('/dashboard');
  }
};


const showEditAdmin = async (req, res) => {
  try {

    const editAdmin = await Admin.findById(req.params.id);
    if (!editAdmin) {
      req.flash('error_msg', 'Admin not found.');
      return res.redirect('/view-admin');
    }
    res.render('edit-admin', {
      admin: req.user,
      editAdmin,
      errors: [],
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg'),
    });
  } catch (err) {
    console.error('Edit Admin Error:', err);
    req.flash('error_msg', 'Error loading admin.');
    res.redirect('/view-admin');
  }
};


const updateAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;


    const adminToUpdate = await Admin.findById(req.params.id);
    if (!adminToUpdate) {
      req.flash('error_msg', 'Admin not found.');
      return res.redirect('/view-admin');
    }

    adminToUpdate.name = name;
    adminToUpdate.email = email.toLowerCase();


    if (req.file) {
      adminToUpdate.image = req.file.filename;
    }


    if (password && password.trim() !== '') {
      if (password.length < 6) {
        req.flash('error_msg', 'Password must be at least 6 characters.');
        return res.redirect(`/edit-admin/${req.params.id}`);
      }
      const salt = await bcrypt.genSalt(10);
      adminToUpdate.password = await bcrypt.hash(password, salt);
    }

    await adminToUpdate.save();
    req.flash('success_msg', 'Admin updated successfully!');
    res.redirect('/view-admin');
  } catch (err) {
    console.error('Update Admin Error:', err);
    req.flash('error_msg', 'Error updating admin. Please try again.');
    res.redirect(`/edit-admin/${req.params.id}`);
  }
};


const deleteAdmin = async (req, res) => {
  try {

    if (req.params.id === req.user._id.toString()) {
      req.flash('error_msg', 'You cannot delete your own account.');
      return res.redirect('/view-admin');
    }

    await Admin.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Admin deleted successfully!');
    res.redirect('/view-admin');
  } catch (err) {
    console.error('Delete Admin Error:', err);
    req.flash('error_msg', 'Error deleting admin. Please try again.');
    res.redirect('/view-admin');
  }
};


module.exports = {
  showLogin, showRegister, registerAdmin, loginAdmin, logoutAdmin,
  showDashboard, showProfile,
  showAddAdmin, addAdmin,
  showViewAdmin,
  showEditAdmin, updateAdmin,
  deleteAdmin,
};