import React, { useEffect, useState } from 'react';
import HighlightText from '../TextColor/HighlightText';
import { FaFilter } from "react-icons/fa";
import { FaMapLocationDot, FaBolt, FaClock, FaCircleCheck } from "react-icons/fa6";
import DetailsCard from '../MINIAPI/DetailsCard';
import { Link, useNavigate } from 'react-router-dom';

const FindEv = () => {
  const [evapi, setevapi] = useState([]);
  const navigate = useNavigate();

  const handleInputClick = () => navigate('/filter/Stations');

  const stationSuggestions = [
    { id: 1, text: "Near Me" },
    { id: 2, text: "Popular Locations" },
    { id: 3, text: "Fast Chargers (DC)" },
    { id: 4, text: "AC Chargers" },
  ];

  const features = [
    {
      icon: <FaMapLocationDot className='text-2xl' />,
      title: "Real-time Availability",
      description: "Check live charging station status instantly"
    },
    {
      icon: <FaBolt className='text-2xl' />,
      title: "Fast Charging",
      description: "Find high-speed DC chargers nearby"
    },
    {
      icon: <FaClock className='text-2xl' />,
      title: "24/7 Support",
      description: "Access stations anytime, anywhere"
    },
    {
      icon: <FaCircleCheck className='text-2xl' />,
      title: "Smart Filtering",
      description: "Filter by charger type and distance"
    }
  ];

  return (
    <div className='w-full min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-10'>
      <div className='w-full max-w-7xl min-h-[85vh] rounded-2xl text-white flex flex-col lg:flex-row bg-gradient-to-tr from-blue-900 via-gray-950 to-black
                      items-stretch justify-center gap-8 lg:gap-12 p-6 md:p-10 
                      border border-gray-800 bg-gray-950 shadow-2xl overflow-hidden'>
        <div className='w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-6'>

          <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'>
            Find EV
            <span className='block mt-2'>
              <HighlightText text={"Charging Stations"} />
            </span>
          </h1>

          <p className='text-gray-400 text-sm sm:text-base md:text-lg lg:max-w-[90%]'>
            Discover electric vehicle charging stations with real-time availability and advanced filtering at your fingertips.
          </p>

          <div className='w-full space-y-4'>
            <div className='w-full flex flex-col sm:flex-row gap-3 p-2 rounded-xl bg-gray-900 border border-gray-800 shadow-inner'>
              <input
                type="text"
                placeholder="Search by location, station name"
                className="flex-grow p-3 bg-transparent text-white focus:outline-none placeholder-gray-500"
                onClick={handleInputClick}
              />
              <Link
                to="/filter/Stations"
                className='flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 font-medium'
              >
                <FaFilter />
                Filter
              </Link>
            </div>

            {/*====================== Suggestions Chips======================== */}
            <div className='flex flex-wrap gap-2 justify-center lg:justify-start'>
              {stationSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={handleInputClick}
                  className='px-4 py-1.5 text-xs sm:text-sm rounded-full border border-gray-700 text-gray-300 bg-gray-800 hover:border-blue-500 hover:text-blue-400 transition-all duration-200'
                >
                  {suggestion.text}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/*====================== RIGHT SECTION: Features ======================== */}
        <div className='w-full lg:w-1/2 flex flex-col gap-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {features.map((feature, index) => (
              <div
                key={index}
                className='p-5 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20'
              >
                <div className='text-amber-500 mb-3'>{feature.icon}</div>
                <h3 className='text-lg font-bold text-white mb-2'>{feature.title}</h3>
                <p className='text-sm text-gray-400'>{feature.description}</p>
              </div>
            ))}
          </div>

          <div className='mt-4 p-6 rounded-xl bg-gradient-to-r from-amber-600/20 to-amber-500/10 border border-amber-500/30 backdrop-blur-sm'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse'></div>
              <span className='font-bold text-green-400'>Live Location Active</span>
            </div>
            <p className='text-gray-300 text-sm leading-relaxed'>
              Get real-time updates of charging stations near you with live availability status. Never miss a charging opportunity with our advanced tracking system.
            </p>
          </div>

          <Link
            to="/map/GoogleMapp"
            className='w-full p-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-center transition-all duration-300 shadow-lg hover:shadow-blue-500/50'
          >
            View on Interactive Map
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FindEv;