import React, { use } from "react";
import { useNavigate } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";

const EvMap = () => {

  const navigate = useNavigate();

  const handleMapClick = () => {
    navigate('/map/GoogleMapp');
  }

  return (
    <div className="max-w-7xl w-full mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-8 rounded-2xl p-6 md:p-10  transition-all duration-300">
        <div className="group w-full md:w-1/2 p-6 rounded-xl bg-gray-800/30 border border-gray-700 hover:border-amber-500/50 hover:bg-gray-800/50 transition-all duration-300 text-center">
          <div className="bg-amber-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
            <IoLocationSharp onClick={handleMapClick} className="text-4xl text-amber-500 cursor-pointer" />
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-white mb-3 cursor-pointer" onClick={handleMapClick}>
            Find EV Charging Stations
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Interactive map to locate nearby EV charging stations with real-time availability.
          </p>
        </div>
        <div className="group w-full md:w-1/2 p-6 rounded-xl bg-gray-800/30 border border-gray-700 hover:border-blue-500/50 hover:bg-gray-800/50 transition-all duration-300 text-center">
          <div className="bg-blue-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
            <IoLocationSharp onClick={handleMapClick} className="text-4xl text-blue-500 cursor-pointer" />
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-white mb-3 cursor-pointer" onClick={handleMapClick}>
            Plan Your Route
          </h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Optimize your trips with integrated route planning and battery estimation.
          </p>
        </div>

      </div>
    </div>
  );
}

export default EvMap;