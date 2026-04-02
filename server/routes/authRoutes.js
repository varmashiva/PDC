const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, getTotalUsers, updateProfile, getAllUsers } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const passport = require('passport');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Google OAuth
router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account consent' 
}));
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    // Successfully authenticated, generate token and redirect
    const token = require('../controllers/authController').generateToken(req.user._id);
    res.redirect(`${process.env.CLIENT_URL}/login?token=${token}`);
});

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/users/count', protect, admin, getTotalUsers);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;
