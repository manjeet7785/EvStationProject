import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaBolt, FaClock, FaStar, FaRoute, FaCalendarCheck, FaUserCircle } from 'react-icons/fa';

const StationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [station, setStation] = useState(null);
  const [comment, setComment] = useState("");
  const [feedbacks, setFeedbacks] = useState([
    { user: "Rahul Sharma", text: "Great charging speed!", rating: 5 },
    { user: "Amit Verma", text: "Wait time was too long.", rating: 3 }
  ]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/stations/${id}`);
        const data = await res.json();
        setStation(data);
      } catch (err) {
        console.error("Error loading station details", err);
      }
    };
    fetchDetails();
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment) return;
    const newFeedback = { user: "You", text: comment, rating: 5 };
    setFeedbacks([newFeedback, ...feedbacks]);
    setComment("");
  };

  const handleDirection = () => {
    navigate(`/map?lat=${station.latitude}&lng=${station.longitude}&name=${station.name}`);
  };

  if (!station) return <div className="h-screen flex items-center justify-center text-white bg-gray-900">Loading Details...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-blue-400">{station.name}</h1>
              <p className="text-gray-400 mt-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" /> {station.district}, {station.location || 'Charging Point'}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDirection}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition shadow-lg shadow-blue-900/20"
              >
                <FaRoute /> DIRECTION
              </button>
              <button
                onClick={() => navigate(`/map/googlemap/evstation/booking?stationId=${station._id}`)}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition shadow-lg shadow-green-900/20"
              >
                <FaCalendarCheck /> BOOKING
              </button>
            </div>
          </div>

          <hr className="my-8 border-gray-700" />

          {/*=============== Station Details================ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 p-5 rounded-2xl border border-gray-700">
              <FaBolt className="text-yellow-400 text-2xl mb-3" />
              <h3 className="text-gray-400 text-xs font-bold uppercase">Charger Type</h3>
              <p className="text-xl font-bold">{station.type || 'Fast AC/DC'}</p>
            </div>
            <div className="bg-gray-900/50 p-5 rounded-2xl border border-gray-700">
              <FaClock className="text-cyan-400 text-2xl mb-3" />
              <h3 className="text-gray-400 text-xs font-bold uppercase">Opening Hours</h3>
              <p className="text-xl font-bold">{station.timing || '24/7 Service'}</p>
            </div>
            <div className="bg-gray-900/50 p-5 rounded-2xl border border-gray-700">
              <FaStar className="text-orange-400 text-2xl mb-3" />
              <h3 className="text-gray-400 text-xs font-bold uppercase">User Rating</h3>
              <p className="text-xl font-bold">{station.rating || '4.8'} / 5.0</p>
            </div>
          </div>
        </div>

        {/* ================Feedback Section================ */}
        <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">💬 Feedback & Comments</h2>

          {/*=============== Comment Form================ */}
          <form onSubmit={handleCommentSubmit} className="mb-10">
            <textarea
              className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Share your experience..."
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <button className="mt-3 bg-blue-600 px-8 py-2 rounded-xl font-bold hover:bg-blue-700 transition">
              POST COMMENT
            </button>
          </form>

          {/*=============== Comments List================ */}
          <div className="space-y-6">
            {feedbacks.map((f, i) => (
              <div key={i} className="flex gap-4 items-start border-b border-gray-700 pb-6 last:border-0">
                <FaUserCircle className="text-4xl text-gray-600" />
                <div>
                  <h4 className="font-bold text-blue-300">{f.user}</h4>
                  <div className="flex text-yellow-500 text-xs mb-1">
                    {[...Array(f.rating)].map((_, i) => <FaStar key={i} />)}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationDetailPage;