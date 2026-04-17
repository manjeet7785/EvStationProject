const User = require('../Model/User');
const Station = require('../Model/Station');
const Booking = require('../Model/Booking');

// Get all users with their details
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      count: users.length,
      users: users
    });
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({ error: 'Failed to fetch users', message: error.message });
  }
};

// Get all bookings with details
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'FirstName LastName email MobileNumber')
      .sort({ bookingDate: -1 });

    const bookingStats = {
      totalBookings: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      totalRevenue: bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
    };

    res.status(200).json({
      stats: bookingStats,
      bookings: bookings
    });
  } catch (error) {
    console.error('Get Bookings Error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings', message: error.message });
  }
};

// Get bookings by station
const getStationBookings = async (req, res) => {
  try {
    const { stationId } = req.params;
    const bookings = await Booking.find({ station: stationId })
      .populate('user', 'FirstName LastName email MobileNumber')
      .sort({ bookingDate: -1 });

    res.status(200).json({
      stationId,
      count: bookings.length,
      bookings: bookings
    });
  } catch (error) {
    console.error('Get Station Bookings Error:', error);
    res.status(500).json({ error: 'Failed to fetch station bookings', message: error.message });
  }
};

// Make a user admin
const makeUserAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { isAdmin: true }, { new: true }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User made admin successfully', user });
  } catch (error) {
    console.error('Make Admin Error:', error);
    res.status(500).json({ error: 'Failed to make user admin', message: error.message });
  }
};

// Remove admin from user
const removeUserAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { isAdmin: false }, { new: true }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Admin removed successfully', user });
  } catch (error) {
    console.error('Remove Admin Error:', error);
    res.status(500).json({ error: 'Failed to remove admin', message: error.message });
  }
};

// Get admin dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalAdmins = await User.countDocuments({ isAdmin: true });
    const dbStations = await Station.countDocuments({});
    const verifiedDbStations = await Station.countDocuments({ verified: true });
    const staticStations = require('../API/Station');
    const staticStationsCount = staticStations.length;
    const totalStations = dbStations + staticStationsCount;
    const totalBookings = await Booking.countDocuments({});
    const totalRevenue = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.status(200).json({
      stats: {
        totalUsers,
        totalAdmins,
        totalStations,
        dbStations,
        staticStations: staticStationsCount,
        verifiedStations: verifiedDbStations + staticStationsCount,
        unverifiedStations: dbStations - verifiedDbStations,
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ error: 'Failed to fetch stats', message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getAllBookings,
  getStationBookings,
  makeUserAdmin,
  removeUserAdmin,
  getDashboardStats
};
