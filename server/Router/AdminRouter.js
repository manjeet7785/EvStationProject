const router = require('express').Router();
const { adminAuth } = require('../middleware/auth');
const {
  getAllUsers,
  getAllBookings,
  getStationBookings,
  makeUserAdmin,
  removeUserAdmin,
  getDashboardStats
} = require('../controller/AdminController');

router.get('/users', adminAuth, getAllUsers);
router.post('/users/:userId/make-admin', adminAuth, makeUserAdmin);
router.post('/users/:userId/remove-admin', adminAuth, removeUserAdmin);
router.get('/stats', adminAuth, getDashboardStats);
router.get('/bookings', adminAuth, getAllBookings);
router.get('/bookings/station/:stationId', adminAuth, getStationBookings);

module.exports = router;
