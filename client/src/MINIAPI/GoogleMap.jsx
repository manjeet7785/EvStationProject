import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const LIBRARIES = ["places"];
const MAP_STYLE = { width: '100%', height: '100%' };
const CENTER = { lat: 28.6139, lng: 77.2090 };

const GoogleMapp = () => {
  const [stations, setStations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [center, setCenter] = useState(CENTER);
  const [locationPermission, setLocationPermission] = useState('pending');
  const [showPermissionAlert, setShowPermissionAlert] = useState(false);
  const watchId = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDePXBuhUYV8oz5NGAycT27cPZEq3NS_T0",
    libraries: LIBRARIES,
  });

  const fetchStations = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:4000/api/stations');
      if (!response.ok) throw new Error();
      const data = await response.json();
      setStations(data);
    } catch (err) {
      setStations([{ id: 1, name: "Demo", lat: 28.6139, lng: 77.2090 }]);
    }
  }, []);

  const startLiveLocation = useCallback(() => {

    if (!navigator.geolocation) {
      console.log('Geolocation not supported by this browser.');
      setLocationPermission('denied');
      return;
    }


    const isSecureContext = window.isSecureContext;
    if (!isSecureContext) {
      console.error('Geolocation requires HTTPS. Current site is not secure.');
      setLocationPermission('denied');
      setShowPermissionAlert(false);
      alert(' Location access requires HTTPS. Please ensure your site is deployed with HTTPS enabled.');
      return;
    }

    console.log('Requesting live location...');
    setShowPermissionAlert(true);

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        console.log('Location received:', position.coords.latitude, position.coords.longitude);
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(userPos);
        setCenter(userPos);
        setLocationPermission('granted');
        setShowPermissionAlert(false);
      },
      (error) => {
        console.error("Location error:", error.code, error.message);
        setLocationPermission('denied');
        setShowPermissionAlert(false);


        if (error.code === 1) {
          console.log('User denied location permission');
        } else if (error.code === 2) {
          console.log('Location unavailable');
        } else if (error.code === 3) {
          console.log('Location request timeout');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000,
      }
    );
  }, []);

  useEffect(() => {
    if (isLoaded) {
      console.log('Map loaded, starting live location tracking...');
      startLiveLocation();
    }
  }, [isLoaded, startLiveLocation]);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  useEffect(() => {
    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  if (loadError) return <div className="p-4 bg-red-900 text-white">Error loading map</div>;

  return isLoaded ? (
    <div className="relative w-full h-full">
      {showPermissionAlert && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-amber-500 text-black px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
          <span className="text-2xl">📍</span>
          <span className="font-semibold">Please allow location access to see your live position</span>
        </div>
      )}

      {!showPermissionAlert && locationPermission === 'granted' && (
        <div className="absolute top-4 left-4 z-10 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <span className="text-lg">📍</span>
          <span className="text-sm font-medium">Live Location Active</span>
        </div>
      )}

      {!showPermissionAlert && locationPermission === 'denied' && (
        <div className="absolute top-4 left-4 z-10 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <span className="text-lg">❌</span>
          <span className="text-sm font-medium">
            {!window.isSecureContext ? 'HTTPS Required for Location' : 'Location Disabled'}
          </span>
        </div>
      )}

      <GoogleMap
        mapContainerStyle={MAP_STYLE}
        center={center}
        zoom={14}
        options={{ disableDefaultUI: false, zoomControl: true }}
      >
        {/*------------------------------ User Live Location Blue Marker --------------*/}
        {userLocation && (
          <>
            <Marker
              position={userLocation}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: '#3b82f6',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 4,
                scale: 15,
              }}
              title="Your Live Location"
              zIndex={1000}
            />
            {/*---------------- Pulsing effect circle----------------- */}
            <Marker
              position={userLocation}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: '#3b82f6',
                fillOpacity: 0.2,
                strokeColor: '#3b82f6',
                strokeWeight: 1,
                scale: 25,
              }}
              zIndex={999}
            />
          </>
        )}

        {stations.map((s) => (
          <Marker
            key={s.id}
            position={{ lat: Number(s.lat), lng: Number(s.lng) }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: '#10b981',
              fillOpacity: 1,
              strokeColor: '#e80909ff',
              strokeWeight: 2,
              scale: 8,
            }}
            title={s.name}
          />
        ))}
      </GoogleMap>
    </div>
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-amber-500">
      Loading...
    </div>
  );
};

export default GoogleMapp;
