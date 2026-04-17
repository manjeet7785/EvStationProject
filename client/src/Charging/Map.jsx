import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { apiUrl } from '../config/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// -------------------------------------- Icons Setup ----------------------------------
const UserLocationIcon = L.divIcon({
  html: `<div style="background-color: #3b82f6; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 0 15px rgba(59, 130, 246, 0.5)">📍</div>`,
  iconSize: [30, 30], className: 'transparent-icon'
});

const EVChargingIcon = () => L.divIcon({
  html: `<div style="background-color: #065f46; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; color: white; border: 2px solid white;">⚡</div>`,
  iconSize: [35, 35], className: 'transparent-icon'
});

// ------------------------------- Helper Functions --------------------------------
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

// -------------------------- Map Recenter Component ----------------------------
function RecenterMap({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location?.lat) map.flyTo([location.lat, location.lng], 12, { animate: true });
  }, [location, map]);
  return null;
}

const Map = () => {
  const navigate = useNavigate();
  const { setSelectedStation } = useAuth();
  const [userLocation, setUserLocation] = useState(null);
  const [stations, setStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStations, setFilteredStations] = useState([]);
  const [routeCoords, setRouteCoords] = useState([]);
  const [selectedRouteInfo, setSelectedRouteInfo] = useState(null);
  const [routeError, setRouteError] = useState(null);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (lat && lng && userLocation) {
      const targetStation = { latitude: parseFloat(lat), longitude: parseFloat(lng) };
      buildRoute(targetStation);
    }
  }, [userLocation, searchParams]);

  //  ---------------------- Get User Location (Browser) ----------------------
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation({ lat: 26.8467, lng: 80.9462 })
    );
  }, []);

  //  ---------------------- Fetch Stations from Backend ----------------------
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await fetch(apiUrl('/stations'));
        const data = await res.json();
        setStations(data || []);
      } catch (err) { console.error("Error fetching stations:", err); }
    };
    fetchStations();
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    const processed = stations
      .map(s => {
        const dist = calculateDistance(userLocation.lat, userLocation.lng, s.latitude, s.longitude);
        const estTime = Math.round((dist * 1.4 / 40) * 60);
        return { ...s, dist: dist.toFixed(1), time: estTime };
      })
      .filter(s => s.dist <= 100 && (s.name?.toLowerCase().includes(searchTerm.toLowerCase())))
      .sort((a, b) => a.dist - b.dist);

    setFilteredStations(processed);
  }, [userLocation, stations, searchTerm]);

  //  ---------------------- Build Real Route on Map ----------------------
  const buildRoute = async (station) => {
    if (!userLocation) return;
    if (!Number.isFinite(station?.latitude) || !Number.isFinite(station?.longitude)) {
      setRouteError('Station coordinates are missing.');
      return;
    }
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${station.longitude},${station.latitude}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.routes && data.routes[0]) {
        const route = data.routes[0];
        setRouteCoords(route.geometry.coordinates.map(([lon, lat]) => [lat, lon]));
        setSelectedRouteInfo({
          distance: (route.distance / 1000).toFixed(1),
          duration: Math.round(route.duration / 60),
          name: station.name
        });
        setRouteError(null);
      } else {
        setRouteError('No route found for this station.');
      }
    } catch (err) {
      console.error("Routing error:", err);
      setRouteError('Failed to fetch route. Please retry.');
    }
  };

  if (!userLocation) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-bold text-gray-600 italic">Finding your location & nearby stations...</p>
    </div>
  );

  return (
    <div className='flex h-screen w-full bg-gray-100 overflow-hidden font-sans'>

      <div className='w-[400px] bg-white shadow-2xl flex flex-col z-[1000] border-r border-gray-200'>
        <div className='p-6 bg-green-800 text-white'>
          <h2 className='text-2xl font-black tracking-tighter uppercase'>EV Station</h2>
          <p className='text-xs opacity-75'>Radius: 100km | Found: {filteredStations.length}</p>
        </div>

        <div className='p-4 bg-gray-50'>
          <div className="relative">
            <input
              type="text"
              placeholder="Search station name..."
              className="w-full pl-10 pr-4 py-3 border-none rounded-xl shadow-inner bg-white focus:ring-2 focus:ring-green-500 outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-3 top-3.5 opacity-30">🔍</span>
          </div>
        </div>

        {/*----------------------- List -------------------------------- */}
        <div className='flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50'>
          {filteredStations.map((station, idx) => (
            <div key={idx} className='bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all'>
              <div className="flex justify-between items-start">
                <h4 className='font-bold text-gray-800 text-sm w-3/4 leading-tight uppercase'>{station.name}</h4>
                <div className="text-right">
                  <p className="text-green-600 font-black text-sm">{station.dist} km</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{station.time} mins</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500 font-semibold italic">
                <span>⚡ {station.type || 'Fast'}</span>
                <span>•</span>
                <span>⭐ {station.rating || '4.2'}</span>
              </div>

              <div className='flex gap-2 mt-4'>
                <button
                  onClick={() => buildRoute(station)}
                  className='flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black py-3 rounded-xl transition uppercase tracking-wider shadow-lg shadow-blue-100'
                >
                  Direction
                </button>
                <button
                  onClick={() => {
                    setSelectedStation(station);
                    navigate(`/map/googlemap/evstation/booking?stationId=${station._id}`);
                  }}
                  className='flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-black py-3 rounded-xl transition uppercase tracking-wider shadow-lg shadow-green-100'
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*----------------------- MAP AREA -------------------------------- */}
      <div className='flex-1 relative'>

        {selectedRouteInfo && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1001] bg-white/90 backdrop-blur-md px-8 py-4 rounded-3xl shadow-2xl border border-green-200 flex items-center gap-8">
            <div className="text-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Selected Station</p>
              <p className="font-black text-gray-800 text-sm truncate max-w-[150px]">{selectedRouteInfo.name}</p>
            </div>
            <div className="h-8 w-[1px] bg-gray-200"></div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Travel Distance</p>
              <p className="font-black text-green-700">{selectedRouteInfo.distance} KM</p>
            </div>
            <div className="h-8 w-[1px] bg-gray-200"></div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Est. Time</p>
              <p className="font-black text-blue-700">{selectedRouteInfo.duration} MIN</p>
            </div>
            <button onClick={() => { setRouteCoords([]); setSelectedRouteInfo(null) }} className="ml-4 text-gray-400 hover:text-red-500 font-bold">✕</button>
          </div>
        )}

        {routeError && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[1001] bg-red-100 text-red-800 px-6 py-3 rounded-xl shadow-lg border border-red-200 text-sm flex items-center gap-3">
            <span>⚠</span>
            <span>{routeError}</span>
            <button onClick={() => setRouteError(null)} className="text-red-500 font-bold ml-2">✕</button>
          </div>
        )}

        <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
          <RecenterMap location={userLocation} />

          {/*----------------------- User Marker-------------------------------- */}
          <Marker position={[userLocation.lat, userLocation.lng]} icon={UserLocationIcon}>
            <Popup><span className="font-bold">Your Location</span></Popup>
          </Marker>

          {/*----------------------- Station Markers-------------------------------- */}
          {filteredStations.map((station, idx) => (
            station.latitude && (
              <Marker key={idx} position={[station.latitude, station.longitude]} icon={EVChargingIcon()}>
                <Popup>
                  <div className="text-center font-sans">
                    <p className="font-black text-gray-800 uppercase border-b mb-1">{station.name}</p>
                    <p className="text-green-600 font-bold">{station.dist} KM Door</p>
                    <div className="flex justify-center gap-2 mt-3">
                      <button
                        onClick={() => buildRoute(station)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] mt-2 font-bold uppercase ml-2"
                      >
                        Show Path
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStation(station);
                          navigate(`/map/googlemap/evstation/booking?stationId=${station._id}`);
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded-full text-[10px] mt-2 font-bold uppercase"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          ))}

          {/*----------------------- Polyline Path-------------------------------- */}
          {routeCoords.length > 0 && (
            <Polyline
              positions={routeCoords}
              pathOptions={{ color: '#2563eb', weight: 7, opacity: 0.8, lineCap: 'round' }}
            />
          )}
        </MapContainer>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #065f46; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Map;


