const Station = require('../Model/Station');
const Booking = require('../Model/Booking');

// Get all stations
const getAllStations = async (req, res) => {
  try {
    // Get static stations from file
    const staticStations = require('../API/Station');

    // Get user-uploaded stations from database
    const dbStations = await Station.find({});

    // Merge both arrays (database stations + static stations)
    const allStations = [...dbStations, ...staticStations];

    res.status(200).json(allStations);
  } catch (error) {
    console.error('Get Stations Error:', error);
    res.status(500).json({ error: 'Failed to fetch stations' });
  }
};

// Search location (Nominatim API के लिए)
const searchLocation = async (req, res) => {
  const searchQuery = req.query.q;

  if (!searchQuery) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'EVChargingApp/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed', message: error.message });
  }
};

// Add/Upload new station
const addStation = async (req, res) => {
  try {
    const { name, district, state, location, latitude, longitude, type, capacity, timing, contact, email, rating, facilities } = req.body;

    // Validation
    if (!name || !district || !location || !latitude || !longitude || !timing || !contact) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Check if station already exists at same location
    const existingStation = await Station.findOne({
      latitude: { $gte: latitude - 0.001, $lte: latitude + 0.001 },
      longitude: { $gte: longitude - 0.001, $lte: longitude + 0.001 }
    });

    if (existingStation) {
      return res.status(400).json({ message: 'Station already exists at this location' });
    }

    const newStation = new Station({
      name,
      district,
      state: state || 'Uttar Pradesh',
      location,
      latitude,
      longitude,
      type: type || 'AC',
      capacity: capacity || 'Not specified',
      timing,
      contact,
      email: email || '',
      rating: rating || 4.0,
      facilities: facilities || {},
      uploadedBy: req.user?._id,
      source: 'User Upload'
    });

    await newStation.save();
    res.status(201).json({
      message: 'Station uploaded successfully! It will be verified soon.',
      station: newStation
    });
  } catch (error) {
    console.error('Add Station Error:', error);
    res.status(500).json({ message: 'Failed to upload station', error: error.message });
  }
};

// Update station
const updateStation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const station = await Station.findByIdAndUpdate(id, updates, { new: true });
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }

    res.status(200).json({ message: 'Station updated successfully', station });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update station', error: error.message });
  }
};

// Delete station
const deleteStation = async (req, res) => {
  try {
    const { id } = req.params;
    const station = await Station.findByIdAndDelete(id);

    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }

    res.status(200).json({ message: 'Station deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete station', error: error.message });
  }
};

// Get all stations (Admin only) - with detailed info
const getAllStationsAdmin = async (req, res) => {
  try {
    const staticStations = require('../API/Station');
    const dbStations = await Station.find({})
      .populate('uploadedBy', 'FirstName LastName email')
      .sort({ createdAt: -1 });

    const bookingByStationId = await Booking.aggregate([
      { $group: { _id: '$station', total: { $sum: 1 } } }
    ]);
    const bookingByStationName = await Booking.aggregate([
      { $group: { _id: '$stationName', total: { $sum: 1 } } }
    ]);

    const bookingIdMap = new Map(
      bookingByStationId.map((item) => [String(item._id || ''), item.total])
    );
    const bookingNameMap = new Map(
      bookingByStationName.map((item) => [String(item._id || '').toLowerCase(), item.total])
    );

    const dbRecords = dbStations.map((station) => {
      const bookingCount = bookingIdMap.get(String(station._id)) || bookingNameMap.get(String(station.name || '').toLowerCase()) || 0;
      const uploaderName = station.uploadedBy
        ? `${station.uploadedBy.FirstName || ''} ${station.uploadedBy.LastName || ''}`.trim()
        : '';

      return {
        _id: station._id,
        stationId: String(station._id),
        name: station.name,
        district: station.district,
        location: station.location,
        state: station.state,
        type: station.type,
        capacity: station.capacity,
        contact: station.contact,
        rating: station.rating,
        verified: !!station.verified,
        isStatic: false,
        canDelete: true,
        canVerify: true,
        bookingCount,
        registeredBy: uploaderName || 'Unknown User',
        registeredByEmail: station.uploadedBy?.email || 'N/A',
        source: station.source || 'User Upload',
        createdAt: station.createdAt
      };
    });

    const staticRecords = staticStations.map((station) => {
      const stationKey = String(station.id || station._id || '');
      const bookingCount = bookingIdMap.get(stationKey) || bookingNameMap.get(String(station.name || '').toLowerCase()) || 0;

      return {
        _id: stationKey,
        stationId: stationKey,
        name: station.name,
        district: station.district,
        location: station.location,
        state: station.state,
        type: station.type,
        capacity: station.capacity,
        contact: station.contact,
        rating: station.rating,
        verified: true,
        isStatic: true,
        canDelete: false,
        canVerify: false,
        bookingCount,
        registeredBy: 'System Seed',
        registeredByEmail: 'N/A',
        source: station.source || 'Static Data',
        createdAt: null
      };
    });

    const allStations = [...dbRecords, ...staticRecords];

    const districtCounter = {};
    allStations.forEach((s) => {
      const key = s.district || 'Unknown';
      districtCounter[key] = (districtCounter[key] || 0) + 1;
    });

    const districtDistribution = Object.entries(districtCounter)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([label, value]) => ({ label, value }));

    const verifiedCount = allStations.filter((s) => s.verified).length;
    const unverifiedCount = allStations.length - verifiedCount;

    const sourceDistribution = [
      { label: 'Static', value: staticRecords.length },
      { label: 'User Upload', value: dbRecords.length }
    ];

    res.status(200).json({
      count: allStations.length,
      stations: allStations,
      stationStats: {
        totalStations: allStations.length,
        staticStations: staticRecords.length,
        userUploadedStations: dbRecords.length,
        verifiedStations: verifiedCount,
        unverifiedStations: unverifiedCount
      },
      graph: {
        districtDistribution,
        verificationDistribution: [
          { label: 'Verified', value: verifiedCount },
          { label: 'Unverified', value: unverifiedCount }
        ],
        sourceDistribution
      }
    });
  } catch (error) {
    console.error('Get Stations Admin Error:', error);
    res.status(500).json({ error: 'Failed to fetch stations' });
  }
};

// Verify or unverify uploaded station (Admin only)
const verifyStationAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body || {};

    const station = await Station.findByIdAndUpdate(
      id,
      { verified: verified !== false },
      { new: true }
    );

    if (!station) {
      return res.status(404).json({ message: 'Station not found or static station cannot be verified from admin action.' });
    }

    return res.status(200).json({
      message: `Station ${station.verified ? 'verified' : 'unverified'} successfully`,
      station
    });
  } catch (error) {
    console.error('Verify Station Error:', error);
    return res.status(500).json({ message: 'Failed to verify station', error: error.message });
  }
};

// Get single station by ID
const getStation = async (req, res) => {
  try {
    const { id } = req.params;

    const station = await Station.findById(id);
    if (station) {
      return res.status(200).json(station);
    }

    const staticStations = require('../API/Station');
    const staticStation = staticStations.find(s => s._id === id || s.id === id);

    if (staticStation) {
      return res.status(200).json(staticStation);
    }

    res.status(404).json({ message: 'Station not found' });
  } catch (error) {
    console.error('Get Station Error:', error);
    res.status(500).json({ error: 'Failed to fetch station', message: error.message });
  }
};

module.exports = {
  getAllStations,
  searchLocation,
  addStation,
  updateStation,
  deleteStation,
  getAllStationsAdmin,
  getStation,
  verifyStationAdmin
};