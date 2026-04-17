import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaChargingStation, FaClock, FaBolt, FaCalendar, FaRupeeSign, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';

const History = () => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('accessToken');

        if (!token) {
          setError('Please login to view booking history');
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:4000/api/bookings/my-bookings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setBookings(data.bookings || []);
        } else {
          setError(data.message || 'Failed to fetch booking history');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to load booking history. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchBookings();
    }
  }, [isLoggedIn, navigate]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`http://localhost:4000/api/bookings/cancel/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setBookings(prevBookings =>
          prevBookings.map(booking =>
            booking._id === bookingId
              ? { ...booking, status: 'cancelled' }
              : booking
          )
        );
        alert('Booking cancelled successfully');
      } else {
        alert(data.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };
  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter(booking => booking.status === filter);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <FaCheckCircle className="text-green-500" />;
      case 'completed':
        return <FaCheckCircle className="text-blue-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      case 'pending':
        return <FaHourglassHalf className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your booking history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Booking History
          </h1>
          <p className="text-gray-600">View all your charging session bookings</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 border border-red-400 rounded-lg">
            {error}
          </div>
        )}
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === status
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaChargingStation className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Bookings Found
            </h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all'
                ? "You haven't made any bookings yet."
                : `No ${filter} bookings found.`}
            </p>
            <button
              onClick={() => navigate('/map/googlemap/evstation/booking')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Book Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className={`px-4 py-2 flex items-center justify-between border-b ${getStatusColor(booking.status)}`}>
                  <span className="font-semibold uppercase text-sm flex items-center gap-2">
                    {getStatusIcon(booking.status)}
                    {booking.status}
                  </span>
                  <span className="text-xs">#{booking._id.slice(-6)}</span>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                      <FaChargingStation className="text-green-500" />
                      {booking.stationName}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      <FaMapMarkerAlt className="text-red-500" />
                      {booking.stationLocation}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FaCalendar className="text-blue-500" />
                    <span>{formatDate(booking.bookingDate)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FaClock className="text-purple-500" />
                    <span>{booking.bookingTime} ({booking.duration} hour{booking.duration > 1 ? 's' : ''})</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaBolt className="text-yellow-500" />
                    <span className="bg-gray-100 px-2 py-1 rounded text-gray-700 font-medium">
                      {booking.chargerType} Charger
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="font-semibold text-gray-700">Total Amount:</span>
                    <span className="text-xl font-bold text-green-600 flex items-center">
                      <FaRupeeSign />
                      {booking.totalAmount}
                    </span>
                  </div>
                  {booking.notes && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600 italic">
                        Note: {booking.notes}
                      </p>
                    </div>
                  )}
                  <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
                    Booked on: {new Date(booking.createdAt).toLocaleString('en-IN')}
                  </div>
                  {(booking.status === 'confirmed' || booking.status === 'pending') && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="w-full mt-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all active:scale-95"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {bookings.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Booking Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">{bookings.length}</p>
                <p className="text-sm text-gray-600">Total Bookings</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
                <p className="text-sm text-gray-600">Confirmed</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">
                  {bookings.filter(b => b.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-3xl font-bold text-yellow-600">
                  <FaRupeeSign className="inline" />
                  {bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">Total Spent</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
