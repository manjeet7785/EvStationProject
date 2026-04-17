import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    stationName: '',
    district: '',
    state: 'Uttar Pradesh',
    location: '',
    latitude: '',
    longitude: '',
    chargerType: 'AC',
    capacity: '',
    timing: '',
    contact: '',
    email: '',
    rating: '4.0',
    facilities: {
      wifi: false,
      parking: false,
      restroom: false,
      food: false,
      shop: false
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFacilityChange = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: {
        ...prev.facilities,
        [facility]: !prev.facilities[facility]
      }
    }));
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          }));
          toast.success("Location captured!");
        },
        () => {
          toast.error("Could not get location. Please enter manually.");
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!formData.stationName || !formData.district || !formData.location ||
      !formData.latitude || !formData.longitude || !formData.contact) {
      toast.error("Please fill all required fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/stations/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          name: formData.stationName,
          district: formData.district,
          state: formData.state,
          location: formData.location,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          type: formData.chargerType,
          capacity: formData.capacity,
          timing: formData.timing,
          contact: formData.contact,
          email: formData.email,
          rating: parseFloat(formData.rating),
          facilities: formData.facilities
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Station uploaded successfully!");
        setFormData({
          stationName: '',
          district: '',
          state: 'Uttar Pradesh',
          location: '',
          latitude: '',
          longitude: '',
          chargerType: 'AC',
          capacity: '',
          timing: '',
          contact: '',
          email: '',
          rating: '4.0',
          facilities: {
            wifi: false,
            parking: false,
            restroom: false,
            food: false,
            shop: false
          }
        });
        setTimeout(() => navigate('/'), 2000);
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("An error occurred during upload");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12 px-4'>
      <div className='max-w-4xl mx-auto'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>Upload Your EV Charging Station</h1>
          <p className='text-gray-600 text-lg'>Share your charging station with the EV community</p>
        </div>
        <div className='bg-white rounded-2xl shadow-2xl p-8 border border-gray-200'>
          <form onSubmit={handleSubmit} className='space-y-8'>
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center'>
                <span className='w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center mr-3'>1</span>
                Basic Information
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Station Name *</label>
                  <input
                    type='text'
                    name='stationName'
                    value={formData.stationName}
                    onChange={handleInputChange}
                    placeholder='e.g., DLF Mall Noida Charger'
                    required
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition'
                  />
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>District *</label>
                  <input
                    type='text'
                    name='district'
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder='e.g., Gautam Buddha Nagar'
                    required
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition'
                  />
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>State</label>
                  <select
                    name='state'
                    value={formData.state}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition'
                  >
                    <option>Uttar Pradesh</option>
                    <option>Delhi</option>
                    <option>Haryana</option>
                    <option>Punjab</option>
                    <option>Others</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Email</label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder='your@email.com'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition'
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center'>
                <span className='w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center mr-3'>2</span>
                Location Details
              </h2>
              <div className='grid grid-cols-1 gap-6'>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Full Address *</label>
                  <input
                    type='text'
                    name='location'
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder='e.g., Plot M-03, Sector 18, Noida'
                    required
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition'
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Latitude *</label>
                    <input
                      type='number'
                      name='latitude'
                      value={formData.latitude}
                      onChange={handleInputChange}
                      placeholder='e.g., 28.5705'
                      step='0.0001'
                      required
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Longitude *</label>
                    <input
                      type='number'
                      name='longitude'
                      value={formData.longitude}
                      onChange={handleInputChange}
                      placeholder='e.g., 77.3230'
                      step='0.0001'
                      required
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition'
                    />
                  </div>
                </div>

                <button
                  type='button'
                  onClick={handleGetLocation}
                  className='w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-300 flex items-center justify-center gap-2'
                >
                  Get My Current Location
                </button>
              </div>
            </div>

            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center'>
                <span className='w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center mr-3'>3</span>
                Charger Details
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Charger Type *</label>
                  <select
                    name='chargerType'
                    value={formData.chargerType}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition'
                  >
                    <option>AC</option>
                    <option>DC</option>
                    <option>AC/DC</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Capacity (e.g., 5 Slots, 60kW)</label>
                  <input
                    type='text'
                    name='capacity'
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder='e.g., 4 Slots, 120kW'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition'
                  />
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Operating Hours *</label>
                  <input
                    type='text'
                    name='timing'
                    value={formData.timing}
                    onChange={handleInputChange}
                    placeholder='e.g., 24/7 or 9 AM - 9 PM'
                    required
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition'
                  />
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Rating (1-5 stars)</label>
                  <input
                    type='number'
                    name='rating'
                    value={formData.rating}
                    onChange={handleInputChange}
                    min='1'
                    max='5'
                    step='0.1'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition'
                  />
                </div>
              </div>
            </div>
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center'>
                <span className='w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center mr-3'>4</span>
                Contact Information
              </h2>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Contact Number *</label>
                <input
                  type='tel'
                  name='contact'
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder='e.g., +91-9876543210'
                  required
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition'
                />
              </div>
            </div>

            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center'>
                <span className='w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center mr-3'>5</span>
                Facilities Available
              </h2>
              <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
                {[
                  { key: 'wifi', label: 'WiFi', icon: '📡' },
                  { key: 'parking', label: 'Parking', icon: '🅿️' },
                  { key: 'restroom', label: 'Restroom', icon: '🚻' },
                  { key: 'food', label: 'Food Court', icon: '🍽️' },
                  { key: 'shop', label: 'Shop', icon: '🛍️' }
                ].map(facility => (
                  <label
                    key={facility.key}
                    className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition ${formData.facilities[facility.key]
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-300 bg-white hover:border-amber-300'
                      }`}
                  >
                    <input
                      type='checkbox'
                      checked={formData.facilities[facility.key]}
                      onChange={() => handleFacilityChange(facility.key)}
                      className='hidden'
                    />
                    <span className='text-center'>
                      <div className='text-2xl mb-1'>{facility.icon}</div>
                      <div className='text-sm font-semibold text-gray-700'>{facility.label}</div>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className='flex gap-4 pt-6'>
              <button
                type='submit'
                disabled={isLoading}
                className={`flex-1 py-3 rounded-lg font-bold text-white text-lg transition duration-300 ${isLoading
                  ? 'bg-amber-400 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700 shadow-lg'
                  }`}
              >
                {isLoading ? '⏳ Uploading...' : '🚀 Upload Station'}
              </button>
              <button
                type='button'
                onClick={() => navigate(-1)}
                className='flex-1 py-3 rounded-lg font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-300'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>


      </div>
    </div>
  );
};

export default Upload;
