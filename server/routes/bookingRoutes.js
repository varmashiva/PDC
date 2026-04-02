const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings, createManualBooking } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/mybookings', protect, getMyBookings);

// Admin routes
router.get('/', protect, admin, getAllBookings);
router.post('/manual', protect, admin, createManualBooking);

module.exports = router;
