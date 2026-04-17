import React, { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaFilter, FaMapMarkerAlt, FaBolt, FaClock, FaStar } from 'react-icons/fa';
import { CgHashtag } from 'react-icons/cg';

const LIBRARIES = ['places'];

const FilterStationsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [searchText, setSearchText] = useState(initialQuery);
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [radiusKm] = useState(50);
  const [selectedStation, setSelectedStation] = useState(null);

  const stationSuggestions = [
    { id: 1, text: 'Near Me' }, { id: 2, text: 'AC' },
    { id: 3, text: 'DC' }, { id: 4, text: 'Fast' }, { id: 5, text: '24/7' }
  ];

  const distanceKm = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/stations');
        const data = await res.json();
        setStations(Array.isArray(data) ? data : []);
      } catch (err) { console.error('Failed to load stations', err); }
    };
    fetchStations();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation({ lat: 26.8467, lng: 80.9462 })
    );
  }, []);

  const handleFilter = (query) => {
    setSearchText(query);
    setSearchParams(query ? { query } : {});

    if (!userLocation) return;

    const lower = (query || '').toLowerCase();
    const filtered = stations.filter((s) => {
      const dist = distanceKm(userLocation.lat, userLocation.lng, s.latitude, s.longitude);
      const inRadius = Number.isFinite(dist) && dist <= radiusKm;
      if (!inRadius) return false;
      if (!lower) return true;
      return (
        s.name?.toLowerCase().includes(lower) ||
        s.type?.toLowerCase().includes(lower) ||
        s.district?.toLowerCase().includes(lower)
      );
    }).map((s) => {
      const d = distanceKm(userLocation.lat, userLocation.lng, s.latitude, s.longitude);
      return {
        ...s,
        _distance: d,
        _time: Number.isFinite(d) ? Math.round((d * 1.5 / 40) * 60) : null
      };
    });

    setFilteredStations(filtered.sort((a, b) => a._distance - b._distance));
  };

  useEffect(() => {
    handleFilter(initialQuery);
  }, [initialQuery, stations, userLocation]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSelectedStation(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className='p-6 bg-gray-900 min-h-screen text-white font-sans'>
      <h1 className='text-3xl font-bold mb-6 text-blue-400 flex items-center gap-3'>
        <FaFilter /> All {filteredStations.length} EV Charging Stations
      </h1>

      <div className='flex flex-col mb-8 gap-4'>
        <div className='flex gap-3'>
          <input
            type="text"
            placeholder={`🔍 Search in ${stations.length} stations...`}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFilter(searchText)}
            className="flex-grow p-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button onClick={() => handleFilter(searchText)} className='px-6 bg-blue-600 rounded-xl hover:bg-blue-700 transition font-bold'>
            Search
          </button>
        </div>

        <div className='flex flex-wrap gap-2'>
          {stationSuggestions.map((s) => (
            <button
              key={s.id}
              onClick={() => handleFilter(s.text)}
              className={`px-4 py-1.5 rounded-full text-sm border transition ${searchText === s.text ? 'bg-blue-600 border-blue-600' : 'border-gray-600 hover:bg-gray-800'}`}
            >
              {s.text}
            </button>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredStations.map((location) => {
          const hasDistance = Number.isFinite(location._distance);
          const distanceLabel = hasDistance ? `${location._distance.toFixed(1)} km` : '—';
          const timeLabel = Number.isFinite(location._time) ? `~${location._time} mins` : '—';

          return (
            <button
              key={location._id}
              type='button'
              onClick={() => setSelectedStation(location)}
              className='group text-left'
            >
              <div className='p-6 rounded-2xl bg-gray-800 border-2 border-transparent group-hover:border-blue-500 transition-all shadow-xl h-full'>
                <div className='flex justify-between items-start mb-4'>
                  <h2 className='text-lg font-bold truncate pr-2 uppercase'><CgHashtag className='inline text-blue-400' /> {location.name}</h2>
                  <span className='bg-green-600 text-[10px] px-2 py-1 rounded-lg font-bold whitespace-nowrap'>{location.type}</span>
                </div>

                <div className='space-y-3 text-sm text-gray-400'>
                  <p className='flex items-center justify-between'>
                    <span className='flex items-center'><FaMapMarkerAlt className='mr-2 text-red-500' /> Distance</span>
                    <span className='text-white font-bold'>{distanceLabel}</span>
                  </p>
                  <p className='flex items-center justify-between'>
                    <span className='flex items-center'><FaClock className='mr-2 text-cyan-400' /> Travel Time</span>
                    <span className='text-white font-bold'>{timeLabel}</span>
                  </p>
                  <p className='flex items-center justify-between'>
                    <span className='flex items-center'><FaStar className='mr-2 text-yellow-500' /> Rating</span>
                    <span className='text-white font-bold'>{location.rating || '4.5'}/5</span>
                  </p>
                </div>

                <div className='mt-5 pt-4 border-t border-gray-700 flex justify-between items-center'>
                  <span className='text-[10px] text-gray-500 uppercase tracking-widest'>{location.district}</span>
                  <span className='text-blue-400 text-xs font-bold'>View Details →</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filteredStations.length === 0 && (
        <div className='text-center py-20'>
          <p className='text-gray-500 text-xl'>No stations found in {radiusKm}km range.</p>
        </div>
      )}

      {selectedStation && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-gray-900 text-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 border border-gray-700 relative'>
            <button
              onClick={() => setSelectedStation(null)}
              className='absolute top-4 right-4 text-gray-300 hover:text-white text-xl'
              aria-label='Close'
            >
              ✕
            </button>

            <div className='flex flex-col gap-4'>
              <div className='flex justify-between items-start gap-3'>
                <div>
                  <h2 className='text-2xl font-bold flex items-center gap-2'>
                    <CgHashtag className='text-blue-400' /> {selectedStation.name}
                  </h2>
                  <p className='text-sm text-gray-300 mt-1'>
                    {selectedStation.location || selectedStation.district || selectedStation.state || ''}
                  </p>
                </div>
                <span className='px-3 py-1 rounded-full bg-green-600 text-sm font-semibold'>
                  {selectedStation.type || 'AC'}
                </span>
              </div>

              <div className='grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-200'>
                <div className='bg-gray-800 rounded-lg p-3 border border-gray-700'>
                  <p className='text-gray-400 text-xs'>Timing</p>
                  <p className='font-semibold'>{selectedStation.timing || 'N/A'}</p>
                </div>
                <div className='bg-gray-800 rounded-lg p-3 border border-gray-700'>
                  <p className='text-gray-400 text-xs'>Rating</p>
                  <p className='font-semibold'>{selectedStation.rating || '—'}/5</p>
                </div>
                <div className='bg-gray-800 rounded-lg p-3 border border-gray-700'>
                  <p className='text-gray-400 text-xs'>Distance</p>
                  <p className='font-semibold'>{Number.isFinite(selectedStation._distance) ? `${selectedStation._distance.toFixed(1)} km` : '—'}</p>
                </div>
                <div className='bg-gray-800 rounded-lg p-3 border border-gray-700'>
                  <p className='text-gray-400 text-xs'>Contact</p>
                  <p className='font-semibold'>{selectedStation.contact || 'N/A'}</p>
                </div>
                <div className='bg-gray-800 rounded-lg p-3 border border-gray-700'>
                  <p className='text-gray-400 text-xs'>Email</p>
                  <p className='font-semibold break-all'>{selectedStation.email || 'N/A'}</p>
                </div>
                <div className='bg-gray-800 rounded-lg p-3 border border-gray-700'>
                  <p className='text-gray-400 text-xs'>Capacity</p>
                  <p className='font-semibold'>{selectedStation.capacity || 'N/A'}</p>
                </div>
              </div>

              {selectedStation.facilities && (
                <div className='bg-gray-800 rounded-lg p-3 border border-gray-700'>
                  <p className='text-gray-400 text-xs mb-2'>Facilities</p>
                  <div className='flex flex-wrap gap-2 text-xs'>
                    {Object.entries(selectedStation.facilities)
                      .filter(([, val]) => val)
                      .map(([key]) => (
                        <span key={key} className='px-3 py-1 rounded-full bg-blue-700 text-white'>
                          {key}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              <div className='flex flex-wrap gap-3 mt-2'>
                <Link
                  to={`/map/googlemap/evstation/booking?stationId=${selectedStation._id || ''}&lat=${selectedStation.latitude}&lng=${selectedStation.longitude}`}
                  className='px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold'
                >
                  Book Session
                </Link>
                <Link
                  to={`/map/GoogleMapp?stationId=${selectedStation._id || ''}&lat=${selectedStation.latitude}&lng=${selectedStation.longitude}`}
                  className='px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold'
                >
                  Direction
                </Link>
                <button
                  onClick={() => setSelectedStation(null)}
                  className='px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterStationsPage;