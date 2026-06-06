
// Import required packages
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

// Import our custom modules
const connectDB = require('./config/db');
const initPassport = require('./config/passportLocal');
const adminRoutes = require('./routes/adminRoutes');

// ─── Connect to MongoDB Database ─────────────────────────────
connectDB();

// ─── Initialize Express App ───────────────────────────────────
const app = express();

// ─── Set View Engine (EJS for dynamic HTML pages) ─────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Serve Static Files (CSS, JS, Images) ─────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── Body Parser (to read form data from POST requests) ────────
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ─── Cookie Parser ─────────────────────────────────────────────
app.use(cookieParser());

// ─── Session Configuration (keeps user logged in) ──────────────
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'staradmin_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,        // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // Session lasts 1 day
    },
  })
);

// ─── Passport Authentication Setup ─────────────────────────────
initPassport(passport);          // Set up local strategy
app.use(passport.initialize());  // Initialize passport
app.use(passport.session());     // Use passport with sessions

// ─── Flash Messages (for success/error notifications) ──────────
app.use(flash());

// ─── Global Variables (available in all EJS views) ─────────────
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user || null;
  next();
});

// ─── Application Routes ────────────────────────────────────────
app.use('/', adminRoutes);

// ─── 404 Page Handler ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('404', { admin: req.user || null });
});

// ─── Global Error Handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong! Please try again.');
});

// ─── Start Server ──────────────────────────────────────────────
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});

module.exports = app;
