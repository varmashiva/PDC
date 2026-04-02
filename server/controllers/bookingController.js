const Booking = require('../models/Booking');
const Workshop = require('../models/Workshop');
const User = require('../models/User');

// @desc    Create new booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
    const { workshopId, paymentId } = req.body;
    try {
        const workshop = await Workshop.findById(workshopId);
        if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
        
        if (workshop.seats <= 0) return res.status(400).json({ message: 'No seats available' });

        const booking = await Booking.create({
            userId: req.user._id,
            workshopId,
            paymentId,
            status: 'completed'
        });

        workshop.seats -= 1;
        await workshop.save();

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings/mybookings
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id }).populate('workshopId');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('userId', 'name email').populate('workshopId', 'title price date');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Manual Booking Customer (Admin)
// @route   POST /api/bookings/manual
const createManualBooking = async (req, res) => {
    const { name, email, workshopId } = req.body;
    try {
        const workshop = await Workshop.findById(workshopId);
        if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
        
        if (workshop.seats <= 0) return res.status(400).json({ message: 'No seats available' });

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ name, email, password: 'ManualBooking!123' });
        }

        const booking = await Booking.create({
            userId: user._id,
            workshopId,
            paymentId: `manual_${Date.now()}`,
            status: 'completed'
        });

        workshop.seats -= 1;
        await workshop.save();

        // Increment Revenue dynamically (tracked by sum of completed bookings)
        // You can get this in the frontend by calculating total prices

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, getMyBookings, getAllBookings, createManualBooking };
