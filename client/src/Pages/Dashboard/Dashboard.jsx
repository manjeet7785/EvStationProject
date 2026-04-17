import React, { useEffect, useState } from 'react';
import { FaChargingStation, FaCheckCircle, FaTimesCircle, FaHistory, FaRupeeSign, FaUser, FaPhone, FaCar, FaEnvelope, FaMapPin } from 'react-icons/fa';
import { useAuth } from '../../Context/AuthContext';
import { apiUrl } from '../../config/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      let token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No access token');

      let res = await fetch(apiUrl('/bookings/my-bookings'), {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      if (res.status === 401) {
        const refresh = await fetch(apiUrl('/auth/refresh-token'), {
          method: 'GET',
          credentials: 'include'
        });
        if (refresh.ok) {
          const r = await refresh.json();
          if (r?.accessToken) {
            localStorage.setItem('accessToken', r.accessToken);
            token = r.accessToken;
            res = await fetch(apiUrl('/bookings/my-bookings'), {
              headers: { 'Authorization': `Bearer ${token}` },
              credentials: 'include'
            });
          }
        }
      }

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setBookings(data.bookings || []);
      } else {
        console.warn('Bookings load failed:', data?.message || res.statusText);
        setBookings([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel?")) return;
    const token = localStorage.getItem('accessToken');
    const res = await fetch(apiUrl(`/bookings/cancel/${id}`), {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchHistory();
  };

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="h-32 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 -mt-16 mb-8">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-4 border-white shadow-lg flex items-center justify-center">
                <FaUser className="text-5xl text-white opacity-80" />
              </div>
              <div className="flex-1">
                <h2 className="text-4xl font-black text-gray-800 mb-2">
                  {`${user?.FirstName || ''} ${user?.LastName || ''}`.trim() || user?.name || 'User'}
                </h2>
                <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold">EV Charging Member</p>
                <div className="mt-3 flex gap-2 flex-wrap">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">✓ Verified</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">Active Member</span>
                </div>
              </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-600 p-3 rounded-full text-white">
                    <FaEnvelope className="text-lg" />
                  </div>
                  <p className="text-xs text-gray-600 uppercase font-bold tracking-wider">Email Address</p>
                </div>
                <p className="text-lg font-bold text-gray-800 break-all">{user?.email || '—'}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-600 p-3 rounded-full text-white">
                    <FaPhone className="text-lg" />
                  </div>
                  <p className="text-xs text-gray-600 uppercase font-bold tracking-wider">Phone Number</p>
                </div>
                <p className="text-lg font-bold text-gray-800">{user?.MobileNumber || '—'}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-purple-600 p-3 rounded-full text-white">
                    <FaCar className="text-lg" />
                  </div>
                  <p className="text-xs text-gray-600 uppercase font-bold tracking-wider">Vehicle Number</p>
                </div>
                <p className="text-lg font-bold text-gray-800 uppercase">{user?.vehicleNumber || '—'}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-orange-600 p-3 rounded-full text-white">
                    <FaUser className="text-lg" />
                  </div>
                  <p className="text-xs text-gray-600 uppercase font-bold tracking-wider">User ID</p>
                </div>
                <p className="text-lg font-bold text-gray-800 break-all font-mono text-sm">{user?._id?.slice(0, 16) || '—'}...</p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-red-600 p-3 rounded-full text-white">
                    <FaChargingStation className="text-lg" />
                  </div>
                  <p className="text-xs text-gray-600 uppercase font-bold tracking-wider">Account Type</p>
                </div>
                <p className="text-lg font-bold text-gray-800">Premium Member</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl border border-indigo-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-indigo-600 p-3 rounded-full text-white">
                    <FaHistory className="text-lg" />
                  </div>
                  <p className="text-xs text-gray-600 uppercase font-bold tracking-wider">Member Since</p>
                </div>
                <p className="text-lg font-bold text-gray-800">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Recently'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-black text-gray-800 mb-8 uppercase flex items-center gap-3">
          <FaHistory className="text-blue-600" /> My Booking Dashboard
        </h1>

        {/*============================== STATS CARDS=============================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow-sm border-b-4 border-blue-500">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Sessions</p>
            <h2 className="text-4xl font-black text-gray-800">{stats.total}</h2>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border-b-4 border-green-500">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Confirmed</p>
            <h2 className="text-4xl font-black text-green-600">{stats.confirmed}</h2>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border-b-4 border-red-500">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Cancelled</p>
            <h2 className="text-4xl font-black text-red-600">{stats.cancelled}</h2>
          </div>
        </div>

        {/*============================== BOOKING TABLE=============================== */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-5 text-xs uppercase tracking-widest">Station Details</th>
                <th className="p-5 text-xs uppercase tracking-widest">Date & Time</th>
                <th className="p-5 text-xs uppercase tracking-widest">Amount</th>
                <th className="p-5 text-xs uppercase tracking-widest">Status</th>
                <th className="p-5 text-xs uppercase tracking-widest">Payment</th>
                <th className="p-5 text-xs uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b last:border-0 hover:bg-blue-50/30 transition">
                  <td className="p-5">
                    <p className="font-black text-gray-800 uppercase text-sm">{b.stationName}</p>
                    <p className="text-xs text-gray-500">{b.stationLocation}</p>
                  </td>
                  <td className="p-5">
                    <p className="font-bold text-gray-700">{new Date(b.bookingDate).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-400">{b.bookingTime}</p>
                  </td>
                  <td className="p-5 font-black text-blue-600"><FaRupeeSign className="inline" />{b.totalAmount}</td>
                  <td className="p-5">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${b.paymentMethod === 'cash' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                      {b.paymentMethod === 'cash' ? 'cash' : b.paymentMethod ? 'online' : '—'}
                    </span>
                  </td>
                  <td className="p-5">
                    {b.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancel(b._id)}
                        className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2"
                      >
                        <FaTimesCircle /> CANCEL
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && <p className="p-20 text-center text-gray-400 font-bold">No bookings found yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;