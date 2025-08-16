const express = require('express');
const upload = require('../utils/multer');
const router = express.Router();
const { registerUser, loginUser, logout, getUserProfile, updateProfile } = require('../controllers/user.controller');
const isAuthenticated = require('../middleware/isAuthenticated');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logout);
router.get('/profile', isAuthenticated, getUserProfile);
router.put('/profileupdate', isAuthenticated, upload.single('profilephoto'), updateProfile);

module.exports = router;