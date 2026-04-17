const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, getBookingById, cancelBooking } = require('../controller/BookingController');
const { auth } = require('../middleware/auth'); // Assuming you have auth middleware


router.post('/create', auth, createBooking);

router.get('/my-bookings', auth, getUserBookings);

router.get('/:id', auth, getBookingById);

router.put('/cancel/:id', auth, cancelBooking);

module.exports = router;
