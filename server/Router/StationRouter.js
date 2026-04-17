const mongoose = require('mongoose');
const router = require('express').Router();
const { auth, adminAuth } = require('../middleware/auth');
const { getAllStations,
  searchLocation,
  addStation,
  updateStation,
  deleteStation,
  getAllStationsAdmin,
  getStation,
  verifyStationAdmin } = require('../controller/StationController');

router.get('/stations', getAllStations);
router.get('/search-location', searchLocation);
router.get('/stations/:id', getStation);
router.post('/stations', addStation);
router.post('/stations/upload', addStation);
router.put('/stations/:id', updateStation);
router.delete('/stations/:id', adminAuth, deleteStation);

// Admin routes
router.get('/admin/stations', adminAuth, getAllStationsAdmin);
router.patch('/admin/stations/:id/verify', adminAuth, verifyStationAdmin);

module.exports = router;