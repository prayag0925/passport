
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');


const { checkAuth, checkNotAuth } = require('../middleware/auth');

const {
  showLogin, showRegister, registerAdmin, loginAdmin, logoutAdmin,
  showDashboard, showProfile,
  showAddAdmin, addAdmin,
  showViewAdmin,
  showEditAdmin, updateAdmin,
  deleteAdmin,
} = require('../controllers/adminController');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'admin-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed!'));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});


router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard');
  }
  res.redirect('/login');
});


router.get('/login', checkNotAuth, showLogin);
router.post('/login', checkNotAuth, loginAdmin);

router.get('/register', checkNotAuth, showRegister);
router.post('/register', checkNotAuth, registerAdmin);

router.get('/logout', checkAuth, logoutAdmin);


router.get('/dashboard', checkAuth, showDashboard);
router.get('/profile', checkAuth, showProfile);


router.get('/add-admin', checkAuth, showAddAdmin);
router.post('/add-admin', checkAuth, upload.single('image'), addAdmin);

router.get('/view-admin', checkAuth, showViewAdmin);

router.get('/edit-admin/:id', checkAuth, showEditAdmin);
router.post('/edit-admin/:id', checkAuth, upload.single('image'), updateAdmin);

router.post('/delete-admin/:id', checkAuth, deleteAdmin);

module.exports = router;
