import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import qrImage from '../../assets/Qr.jpeg';

const Booking = () => {
  const { isLoggedIn, selectedStation: contextStation } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const stationId = searchParams.get('stationId');

  const [mainStation, setMainStation] = useState(null);
  const [nearbyStations, setNearbyStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [bookingData, setBookingData] = useState({
    bookingDate: '',
    bookingTime: '',
    duration: 1,
    chargerType: 'AC'
  });
  const [loading, setLoading] = useState(false);
  const [fetchingStations, setFetchingStations] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('qr');
  const [timeConflict, setTimeConflict] = useState(false);
  const [suggestedTimes, setSuggestedTimes] = useState([]);
  const [qrDetails, setQrDetails] = useState({
    payerName: '',
    transactionId: ''
  });
  const [showQrPopup, setShowQrPopup] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: location } });
    }
  }, [isLoggedIn, navigate, location]);


  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };


  useEffect(() => {
    const fetchStationData = async () => {
      try {
        setFetchingStations(true);

        let main = contextStation;

        if (!main && stationId) {
          const res = await fetch(`http://localhost:4000/api/stations/${stationId}`);
          if (!res.ok) {
            throw new Error(`Failed to fetch station: ${res.status}`);
          }
          const data = await res.json();
          main = data;
        }

        if (!main) {
          const res = await fetch('http://localhost:4000/api/stations');
          if (!res.ok) {
            throw new Error(`Failed to fetch stations: ${res.status}`);
          }
          const allStations = await res.json();
          main = allStations?.[0];
        }

        setMainStation(main);
        setSelectedStation(main);

        const allRes = await fetch('http://localhost:4000/api/stations');
        if (!allRes.ok) {
          throw new Error(`Failed to fetch all stations: ${allRes.status}`);
        }
        const allStations = await allRes.json();

        if (main && main.latitude && main.longitude) {
          const nearby = allStations
            .filter(s => s._id !== main._id)
            .map(s => ({
              ...s,
              distance: calculateDistance(main.latitude, main.longitude, s.latitude, s.longitude)
            }))
            .filter(s => s.distance <= 10)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5);

          setNearbyStations(nearby);
        }
      } catch (err) {
        console.error('Error fetching stations:', err);
        toast.error('Failed to load stations');
      } finally {
        setFetchingStations(false);
      }
    };

    fetchStationData();
  }, [stationId, contextStation]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleQrChange = (e) => {
    const { name, value } = e.target;
    setQrDetails(prev => ({ ...prev, [name]: value }));
  };

  const calculateAmount = () => {
    const ratePerHour = bookingData.chargerType === 'DC' ? 200 : 150;
    return ratePerHour * bookingData.duration;
  };

  const bookedTimes = useMemo(() => {
    if (!bookingData.bookingDate) return [];
    return ['10:00', '11:30', '15:00', '18:30'];
  }, [bookingData.bookingDate]);

  const timeToMinutes = (timeStr) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(':').map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
  };

  const formatMinutes = (mins) => {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const getSuggestions = (timeStr) => {
    const base = timeToMinutes(timeStr);
    if (base === null) return [];
    const blocked = new Set(bookedTimes);
    const suggestions = [];
    let cursor = base + 30;
    while (suggestions.length < 3 && cursor < 24 * 60) {
      const next = formatMinutes(cursor);
      if (!blocked.has(next)) suggestions.push(next);
      cursor += 30;
    }
    return suggestions;
  };

  useEffect(() => {
    if (!bookingData.bookingTime) {
      setTimeConflict(false);
      setSuggestedTimes([]);
      return;
    }

    const isBooked = bookedTimes.includes(bookingData.bookingTime);
    setTimeConflict(isBooked);
    setSuggestedTimes(isBooked ? getSuggestions(bookingData.bookingTime) : []);
  }, [bookingData.bookingTime, bookedTimes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStation) {
      toast.error("Please select a station first");
      return;
    }

    if (bookedTimes.includes(bookingData.bookingTime)) {
      toast.error("Selected time is already booked. Please choose another time.");
      return;
    }

    if (paymentMethod === 'qr') {
      if (!qrDetails.payerName.trim() || !qrDetails.transactionId.trim()) {
        toast.error("Please enter payer name and transaction ID for QR payment.");
        return;
      }
    }

    setLoading(true);

    try {
      let token = localStorage.getItem('accessToken') || localStorage.getItem('token');

      if (!token) {
        toast.error("Please login first");
        return navigate('/login');
      }

      let response = await fetch('http://localhost:4000/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          stationId: selectedStation?._id || selectedStation?.id,
          stationName: selectedStation?.name,
          stationLocation: selectedStation?.location || selectedStation?.district,
          ...bookingData,
          totalAmount: calculateAmount(),
          paymentMethod,
          paymentDetails: paymentMethod === 'qr' ? qrDetails : null
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        if (paymentMethod === 'qr') {
          setShowQrPopup(true);
        } else {
          toast.success("Booking Confirmed! Redirecting...");
          setTimeout(() => navigate('/dashboard'), 1200);
        }
      } else {
        toast.error(data.message || "Booking failed");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Backend server is not running!");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Complete Your Booking</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="space-y-6">

            {fetchingStations ? (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-center h-40">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-gray-500">Loading stations...</p>
                  </div>
                </div>
              </div>
            ) : mainStation ? (
              <div className="bg-white p-6 rounded-xl shadow-md border-2 border-green-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Selected Station</h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Primary</span>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <p className="font-bold text-green-900 text-lg">{mainStation.name}</p>
                  <p className="text-sm text-gray-600 mt-1">📍 {mainStation.location || mainStation.district}</p>
                  {mainStation.type && <p className="text-sm text-green-700 mt-2">⚡ {mainStation.type} Charger</p>}
                </div>
              </div>
            ) : null}

            {nearbyStations.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Nearby Suggestions</h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {nearbyStations.map((station, idx) => {
                    const isSelected = selectedStation?._id === station._id;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedStation(station)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition ${isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-100 hover:border-blue-300'
                          }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-bold text-gray-800">{station.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{station.location || station.district}</p>
                          </div>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                            {station.distance.toFixed(1)} km
                          </span>
                        </div>
                        {station.type && (
                          <p className="text-xs text-blue-600 mt-2">⚡ {station.type} Charger</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            {selectedStation ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-4">
                  <p className="text-sm text-gray-600">Booking for:</p>
                  <p className="font-bold text-blue-600">{selectedStation.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Booking Date</label>
                  <input
                    type="date"
                    name="bookingDate"
                    min={today}
                    value={bookingData.bookingDate}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-blue-300 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700">
                    Book Your Time
                  </label>
                  <input
                    type="time"
                    name="bookingTime"
                    value={bookingData.bookingTime}
                    onChange={handleInputChange}
                    required
                    className={`w-full border p-3 rounded-lg shadow-sm outline-none transition ${timeConflict
                      ? 'border-red-300 bg-red-50/70 text-red-900 hover:border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                      : 'border-slate-300 bg-slate-50 text-slate-800 hover:border-blue-300 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10'
                      }`}
                  />
                  {timeConflict && (
                    <div className="mt-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded p-2">
                      This time is already booked. Try one of these:
                    </div>
                  )}
                  {timeConflict && suggestedTimes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {suggestedTimes.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setBookingData(prev => ({ ...prev, bookingTime: t }))}
                          className="px-3 py-1.5 text-xs rounded-full border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Charger Type</label>
                  <select
                    name="chargerType"
                    value={bookingData.chargerType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="AC">AC (Slow) - ₹150/hour</option>
                    <option value="DC">DC (Fast) - ₹200/hour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Duration (Hours)</label>
                  <input
                    type="number"
                    name="duration"
                    min="1"
                    max="24"
                    value={bookingData.duration}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between font-bold text-lg mb-4">
                    <span className="text-gray-800">Total Amount:</span>
                    <span className="text-green-600">₹{calculateAmount()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-800 mb-3">Payment Method</p>
                  <div className="flex items-center gap-6 mb-4">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="qr"
                        checked={paymentMethod === 'qr'}
                        onChange={() => setPaymentMethod('qr')}
                      />
                      QR
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={() => setPaymentMethod('cash')}
                      />
                      Cash
                    </label>
                  </div>
                  {paymentMethod === 'qr' && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center">
                      <img
                        src={qrImage}
                        alt="QR payment"
                        className="w-40 h-40 object-contain"
                      />
                      <p className="text-xs text-gray-500 mt-2">Scan to pay</p>
                      <div className="w-full mt-4 space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Payer Name</label>
                          <input
                            type="text"
                            name="payerName"
                            value={qrDetails.payerName}
                            onChange={handleQrChange}
                            required={paymentMethod === 'qr'}
                            placeholder="Enter your name"
                            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Transaction ID</label>
                          <input
                            type="text"
                            name="transactionId"
                            value={qrDetails.transactionId}
                            onChange={handleQrChange}
                            required={paymentMethod === 'qr'}
                            placeholder="Enter transaction ID"
                            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                          />
                        </div>
                        <p className="text-[11px] text-gray-500">
                          Please provide name and transaction ID after QR payment.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 transition"
                >
                  {loading ? 'Processing...' : 'Confirm & Pay'}
                </button>
              </form>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <div className="text-4xl mb-3">⚡</div>
                <p className="text-center">Select a station from the list to complete your booking</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showQrPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Thank you for booking!</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We have received your booking request. I will now verify your payment status
              and send you a confirmation message. If you have completed the payment,
              please visit at your booked time and bring a payment screenshot.
            </p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowQrPopup(false);
                  navigate('/dashboard');
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
