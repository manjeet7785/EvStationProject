import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const AdminPanel = () => {
  const { isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [stations, setStations] = useState([]);
  const [stationStats, setStationStats] = useState(null);
  const [stationGraph, setStationGraph] = useState(null);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [deletingId, setDeletingId] = useState(null);
  const [verifyingId, setVerifyingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const API_BASE = API_BASE_URL;

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Unauthorized access');
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // dashboard 
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
    }
  }, [activeTab]);

  // Fetch stations
  useEffect(() => {
    if (activeTab === 'stations') {
      fetchStations();
    }
  }, [activeTab]);

  // Fetch users
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  // Fetch bookings
  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/admin/stats`, {
        headers: getAuthHeaders()
      });
      setStats(response.data.stats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch statistics');
      setLoading(false);
    }
  };

  const fetchStations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/admin/stations`, {
        headers: getAuthHeaders()
      });
      setStations(response.data.stations);
      setStationStats(response.data.stationStats || null);
      setStationGraph(response.data.graph || null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stations:', error);
      toast.error('Failed to fetch stations');
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/admin/users`, {
        headers: getAuthHeaders()
      });
      setUsers(response.data.users);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/admin/bookings`, {
        headers: getAuthHeaders()
      });
      setBookings(response.data.bookings);
      setStats(prev => ({ ...prev, ...response.data.stats }));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
      setLoading(false);
    }
  };

  const deleteStation = async (stationId) => {
    if (!window.confirm('Are you sure you want to delete this station?')) {
      return;
    }

    try {
      setDeletingId(stationId);
      await axios.delete(`${API_BASE}/stations/${stationId}`, {
        headers: getAuthHeaders()
      });
      toast.success('Station deleted successfully');
      setStations(stations.filter(s => s._id !== stationId));
      setDeletingId(null);
    } catch (error) {
      console.error('Error deleting station:', error);
      toast.error('Failed to delete station');
      setDeletingId(null);
    }
  };

  const verifyStation = async (stationId, verified = true) => {
    try {
      setVerifyingId(stationId);
      await axios.patch(
        `${API_BASE}/admin/stations/${stationId}/verify`,
        { verified },
        { headers: getAuthHeaders() }
      );
      toast.success(`Station ${verified ? 'verified' : 'unverified'} successfully`);
      await fetchStations();
    } catch (error) {
      console.error('Error verifying station:', error);
      toast.error('Failed to update station verification');
    } finally {
      setVerifyingId(null);
    }
  };

  const makeUserAdmin = async (userId) => {
    try {
      await axios.post(`${API_BASE}/admin/users/${userId}/make-admin`, {}, {
        headers: getAuthHeaders()
      });
      toast.success('User made admin successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error making user admin:', error);
      toast.error('Failed to make user admin');
    }
  };

  const removeUserAdmin = async (userId) => {
    try {
      await axios.post(`${API_BASE}/admin/users/${userId}/remove-admin`, {}, {
        headers: getAuthHeaders()
      });
      toast.success('Admin status removed successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error removing admin:', error);
      toast.error('Failed to remove admin status');
    }
  };

  const filteredStations = stations.filter(station =>
    station.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.district?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.source?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGoHome = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin-login');
  };

  if (loading && activeTab === 'dashboard') {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-32 px-4'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto'></div>
          <p className='mt-4'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-24 pb-12'>
      <div className='max-w-7xl mx-auto px-4'>
        {/* Header */}
        <div className='mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div>
            <h1 className='text-4xl font-bold mb-2'>
              <span className='text-amber-500'>Admin</span> Panel
            </h1>
            <p className='text-gray-400'>Welcome, {user?.FirstName || 'Admin'}</p>
          </div>
          <div className='flex items-center gap-3'>
            <button
              onClick={handleGoHome}
              className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition'
            >
              Home
            </button>
            <button
              onClick={handleLogout}
              className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition'
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className='flex gap-4 mb-8 border-b border-gray-700'>
          {['dashboard', 'stations', 'users', 'bookings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition duration-300 ${activeTab === tab
                ? 'text-amber-500 border-b-2 border-amber-500'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
              <div className='bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-lg shadow-lg'>
                <h3 className='text-gray-200 text-sm font-semibold mb-2'>Total Users</h3>
                <p className='text-4xl font-bold'>{stats?.totalUsers || 0}</p>
              </div>
              <div className='bg-gradient-to-br from-green-600 to-green-800 p-8 rounded-lg shadow-lg'>
                <h3 className='text-gray-200 text-sm font-semibold mb-2'>Total Admins</h3>
                <p className='text-4xl font-bold'>{stats?.totalAdmins || 0}</p>
              </div>
              <div className='bg-gradient-to-br from-amber-600 to-amber-800 p-8 rounded-lg shadow-lg'>
                <h3 className='text-gray-200 text-sm font-semibold mb-2'>Total Stations</h3>
                <p className='text-4xl font-bold'>{stationStats?.totalStations ?? stats?.totalStations ?? 0}</p>
              </div>
              <div className='bg-gradient-to-br from-purple-600 to-purple-800 p-8 rounded-lg shadow-lg'>
                <h3 className='text-gray-200 text-sm font-semibold mb-2'>Total Bookings</h3>
                <p className='text-4xl font-bold'>{stats?.totalBookings || 0}</p>
              </div>
              <div className='bg-gradient-to-br from-pink-600 to-pink-800 p-8 rounded-lg shadow-lg'>
                <h3 className='text-gray-200 text-sm font-semibold mb-2'>Total Revenue</h3>
                <p className='text-4xl font-bold'>₹{stats?.totalRevenue || 0}</p>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='bg-gray-900/60 border border-gray-700 p-5 rounded-lg'>
                <p className='text-sm text-gray-400 mb-2'>Station Source</p>
                <p className='text-xl font-bold text-white'>Static: {stationStats?.staticStations || 0} | User Uploaded: {stationStats?.userUploadedStations || 0}</p>
                <p className='text-sm text-gray-400 mt-2'>Verified: {stationStats?.verifiedStations || 0} | Unverified: {stationStats?.unverifiedStations || 0}</p>
              </div>
              <div className='bg-gray-900/60 border border-gray-700 p-5 rounded-lg'>
                <p className='text-sm text-gray-400 mb-3'>Top Districts (Graph)</p>
                <div className='space-y-2'>
                  {(stationGraph?.districtDistribution || []).slice(0, 6).map((item) => {
                    const maxValue = Math.max(...(stationGraph?.districtDistribution || [{ value: 1 }]).map((i) => i.value));
                    const width = Math.max(8, Math.round((item.value / maxValue) * 100));
                    return (
                      <div key={item.label}>
                        <div className='flex justify-between text-xs text-gray-300 mb-1'>
                          <span>{item.label}</span>
                          <span>{item.value}</span>
                        </div>
                        <div className='w-full h-2 bg-gray-700 rounded'>
                          <div className='h-2 rounded bg-gradient-to-r from-amber-500 to-blue-500' style={{ width: `${width}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stations Tab */}
        {activeTab === 'stations' && (
          <div>
            <div className='mb-6'>
              <input
                type='text'
                placeholder='Search stations by name or district...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500'
              />
            </div>

            {loading ? (
              <div className='text-center py-12'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto'></div>
              </div>
            ) : filteredStations.length === 0 ? (
              <div className='text-center py-12 bg-gray-800/50 rounded-lg'>
                <p className='text-gray-400'>No stations found</p>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-gray-800/50 border-b border-gray-700'>
                    <tr>
                      <th className='px-6 py-3 text-left text-sm font-semibold text-gray-300'>Station Name</th>
                      <th className='px-6 py-3 text-left text-sm font-semibold text-gray-300'>Location</th>
                      <th className='px-6 py-3 text-left text-sm font-semibold text-gray-300'>District</th>
                      <th className='px-6 py-3 text-left text-sm font-semibold text-gray-300'>Type</th>
                      <th className='px-6 py-3 text-left text-sm font-semibold text-gray-300'>Registered By</th>
                      <th className='px-6 py-3 text-left text-sm font-semibold text-gray-300'>Bookings</th>
                      <th className='px-6 py-3 text-left text-sm font-semibold text-gray-300'>Verified</th>
                      <th className='px-6 py-3 text-left text-sm font-semibold text-gray-300'>Contact</th>
                      <th className='px-6 py-3 text-left text-sm font-semibold text-gray-300'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStations.map((station) => (
                      <tr key={station._id} className='border-b border-gray-700 hover:bg-gray-800/30 transition'>
                        <td className='px-6 py-4 text-sm text-white'>{station.name}</td>
                        <td className='px-6 py-4 text-sm text-gray-300 max-w-xs truncate'>{station.location || 'N/A'}</td>
                        <td className='px-6 py-4 text-sm text-gray-300'>{station.district}</td>
                        <td className='px-6 py-4 text-sm'>
                          <span className='px-3 py-1 bg-amber-600/30 text-amber-400 rounded-full text-xs font-semibold'>
                            {station.type}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-300'>
                          <div>{station.registeredBy || 'N/A'}</div>
                          <div className='text-xs text-gray-500'>{station.registeredByEmail || ''}</div>
                        </td>
                        <td className='px-6 py-4 text-sm text-blue-300 font-semibold'>{station.bookingCount || 0}</td>
                        <td className='px-6 py-4 text-sm'>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${station.verified
                            ? 'bg-green-600/30 text-green-400'
                            : 'bg-yellow-600/30 text-yellow-400'
                            }`}>
                            {station.verified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-300'>{station.contact}</td>
                        <td className='px-6 py-4'>
                          <div className='flex gap-2'>
                            {station.canVerify && (
                              <button
                                onClick={() => verifyStation(station._id, !station.verified)}
                                disabled={verifyingId === station._id}
                                className='px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed'
                              >
                                {verifyingId === station._id ? 'Saving...' : station.verified ? 'Unverify' : 'Verify'}
                              </button>
                            )}
                            {station.canDelete ? (
                              <button
                                onClick={() => deleteStation(station._id)}
                                disabled={deletingId === station._id}
                                className='px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed'
                              >
                                {deletingId === station._id ? 'Deleting...' : 'Delete'}
                              </button>
                            ) : (
                              <span className='px-3 py-2 bg-gray-700 text-gray-300 rounded-lg text-xs font-semibold'>Protected</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            {loading ? (
              <div className='text-center py-12'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto'></div>
              </div>
            ) : users.length === 0 ? (
              <div className='text-center py-12 bg-gray-800/50 rounded-lg'>
                <p className='text-gray-400'>No users found</p>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-gray-800/50 border-b border-gray-700'>
                    <tr>
                      <th className='px-6 py-3 text-left text-sm font-semibold text-gray-300'>Name</th>
                      <th className='px-6 py-3 text-left text-sm font-semibold text-gray-300'>Email</th>
                      <th className='px-6 py-3 text-left text-sm font-semibold text-gray-300'>Mobile</th>
                      <th className='px-6 py-3 text-left text-sm font-semibold text-gray-300'>Status</th>
                      <th className='px-6 py-3 text-left text-sm font-semibold text-gray-300'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userItem) => (
                      <tr key={userItem._id} className='border-b border-gray-700 hover:bg-gray-800/30 transition'>
                        <td className='px-6 py-4 text-sm text-white'>
                          {userItem.FirstName} {userItem.LastName}
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-300'>{userItem.email}</td>
                        <td className='px-6 py-4 text-sm text-gray-300'>{userItem.MobileNumber}</td>
                        <td className='px-6 py-4 text-sm'>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${userItem.isAdmin
                            ? 'bg-green-600/30 text-green-400'
                            : 'bg-gray-600/30 text-gray-400'
                            }`}>
                            {userItem.isAdmin ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className='px-6 py-4'>
                          {userItem.isAdmin ? (
                            <button
                              onClick={() => removeUserAdmin(userItem._id)}
                              className='px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-semibold transition'
                            >
                              Remove Admin
                            </button>
                          ) : (
                            <button
                              onClick={() => makeUserAdmin(userItem._id)}
                              className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition'
                            >
                              Make Admin
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <div className='mb-6'>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
                <div className='bg-blue-900/30 border border-blue-600/30 p-4 rounded-lg'>
                  <p className='text-gray-400 text-sm'>Total Bookings</p>
                  <p className='text-3xl font-bold text-blue-400'>{stats?.totalBookings || 0}</p>
                </div>
                <div className='bg-yellow-900/30 border border-yellow-600/30 p-4 rounded-lg'>
                  <p className='text-gray-400 text-sm'>Pending</p>
                  <p className='text-3xl font-bold text-yellow-400'>{stats?.pending || 0}</p>
                </div>
                <div className='bg-green-900/30 border border-green-600/30 p-4 rounded-lg'>
                  <p className='text-gray-400 text-sm'>Confirmed</p>
                  <p className='text-3xl font-bold text-green-400'>{stats?.confirmed || 0}</p>
                </div>
                <div className='bg-purple-900/30 border border-purple-600/30 p-4 rounded-lg'>
                  <p className='text-gray-400 text-sm'>Total Revenue</p>
                  <p className='text-3xl font-bold text-purple-400'>₹{stats?.totalRevenue || 0}</p>
                </div>
              </div>

              <input
                type='text'
                placeholder='Search bookings...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500'
              />
            </div>

            {loading ? (
              <div className='text-center py-12'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto'></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className='text-center py-12 bg-gray-800/50 rounded-lg'>
                <p className='text-gray-400'>No bookings found</p>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-gray-800/50 border-b border-gray-700'>
                    <tr>
                      <th className='px-6 py-3 text-left text-sm font-semibold text-gray-300'>User</th>
                      <th className='px-6 py-3 text-left text-sm font-semibold text-gray-300'>Station</th>
                      <th className='px-6 py-3 text-left text-sm font-semibold text-gray-300'>Date</th>
                      <th className='px-6 py-3 text-left text-sm font-semibold text-gray-300'>Charger</th>
                      <th className='px-6 py-3 text-left text-sm font-semibold text-gray-300'>Amount</th>
                      <th className='px-6 py-3 text-left text-sm font-semibold text-gray-300'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id} className='border-b border-gray-700 hover:bg-gray-800/30 transition'>
                        <td className='px-6 py-4 text-sm text-white'>
                          {booking.user?.FirstName} {booking.user?.LastName}
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-300'>{booking.stationName}</td>
                        <td className='px-6 py-4 text-sm text-gray-300'>
                          {new Date(booking.bookingDate).toLocaleDateString()} {booking.bookingTime}
                        </td>
                        <td className='px-6 py-4 text-sm'>
                          <span className='px-3 py-1 bg-amber-600/30 text-amber-400 rounded-full text-xs font-semibold'>
                            {booking.chargerType}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-sm font-bold text-green-400'>₹{booking.totalAmount}</td>
                        <td className='px-6 py-4 text-sm'>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'completed' ? 'bg-green-600/30 text-green-400' :
                            booking.status === 'confirmed' ? 'bg-blue-600/30 text-blue-400' :
                              booking.status === 'pending' ? 'bg-yellow-600/30 text-yellow-400' :
                                'bg-red-600/30 text-red-400'
                            }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
