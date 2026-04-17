import React from 'react';
import { FaChargingStation, FaMapMarkedAlt, FaIndustry, FaCity } from 'react-icons/fa';
import { BiWorld } from 'react-icons/bi';
import { MdElectricCar } from 'react-icons/md';

const EVDetails = () => {
  const indiaStats = {
    totalStations: 12000,
    totalInIndia: 100,
    uttarPradeshStations: 1850,
    uttarPradeshPercentage: 15.4,
    topStates: [
      { name: 'Maharashtra', percentage: 22.5, stations: 2700 },
      { name: 'Delhi NCR', percentage: 18.3, stations: 2196 },
      { name: 'Uttar Pradesh', percentage: 15.4, stations: 1850 },
      { name: 'Karnataka', percentage: 12.8, stations: 1536 },
      { name: 'Tamil Nadu', percentage: 11.2, stations: 1344 }
    ]
  };

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-16 px-4'>
      <div className='max-w-7xl mx-auto'>

        <div className='text-center mb-16'>
          <span className='inline-block px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-sm font-bold uppercase tracking-wider shadow-lg'>
            EV Infrastructure Stats
          </span>
          <h2 className='mt-6 text-4xl md:text-5xl font-black text-white'>
            EV Charging Network in <span className='text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500'>India</span>
          </h2>
          <p className='mt-4 text-gray-400 text-lg max-w-2xl mx-auto'>
            Comprehensive overview of electric vehicle charging infrastructure across India and Uttar Pradesh
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-16'>

          <div className='bg-gradient-to-br from-blue-900/40 to-blue-950/40 backdrop-blur-sm border border-blue-700/30 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-transform duration-300'>
            <div className='flex items-center gap-4 mb-6'>
              <div className='p-4 bg-blue-600 rounded-2xl'>
                <BiWorld className='text-4xl text-white' />
              </div>
              <div>
                <h3 className='text-2xl font-bold text-white'>All India</h3>
                <p className='text-blue-300 text-sm'>Total Network Coverage</p>
              </div>
            </div>

            <div className='mb-6'>
              <div className='flex items-end gap-3 mb-2'>
                <span className='text-6xl font-black text-white'>{indiaStats.totalStations.toLocaleString()}</span>
                <span className='text-2xl text-blue-400 font-bold mb-2'>Stations</span>
              </div>
              <p className='text-blue-300'>Across all states and union territories</p>
            </div>

            <div className='mt-6'>
              <div className='flex justify-between mb-2'>
                <span className='text-sm text-gray-400'>National Coverage</span>
                <span className='text-sm font-bold text-blue-400'>{indiaStats.totalInIndia}%</span>
              </div>
              <div className='w-full h-3 bg-gray-800 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000'
                  style={{ width: `${indiaStats.totalInIndia}%` }}
                ></div>
              </div>
            </div>

            <div className='grid grid-cols-3 gap-4 mt-8'>
              <div className='text-center p-3 bg-blue-950/50 rounded-xl'>
                <FaChargingStation className='text-3xl text-blue-400 mx-auto mb-2' />
                <p className='text-xs text-gray-400'>Fast Chargers</p>
              </div>
              <div className='text-center p-3 bg-blue-950/50 rounded-xl'>
                <FaCity className='text-3xl text-blue-400 mx-auto mb-2' />
                <p className='text-xs text-gray-400'>28 States</p>
              </div>
              <div className='text-center p-3 bg-blue-950/50 rounded-xl'>
                <MdElectricCar className='text-3xl text-blue-400 mx-auto mb-2' />
                <p className='text-xs text-gray-400'>Growing</p>
              </div>
            </div>
          </div>

          <div className='bg-gradient-to-br from-green-900/40 to-emerald-950/40 backdrop-blur-sm border border-green-700/30 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-transform duration-300'>
            <div className='flex items-center gap-4 mb-6'>
              <div className='p-4 bg-green-600 rounded-2xl'>
                <FaMapMarkedAlt className='text-4xl text-white' />
              </div>
              <div>
                <h3 className='text-2xl font-bold text-white'>Uttar Pradesh</h3>
                <p className='text-green-300 text-sm'>State Level Distribution</p>
              </div>
            </div>

            <div className='mb-6'>
              <div className='flex items-end gap-3 mb-2'>
                <span className='text-6xl font-black text-white'>{indiaStats.uttarPradeshStations.toLocaleString()}</span>
                <span className='text-2xl text-green-400 font-bold mb-2'>Stations</span>
              </div>
              <p className='text-green-300'>Third largest EV infrastructure in India</p>
            </div>

            <div className='mt-6'>
              <div className='flex justify-between mb-2'>
                <span className='text-sm text-gray-400'>Share of National Network</span>
                <span className='text-sm font-bold text-green-400'>{indiaStats.uttarPradeshPercentage}%</span>
              </div>
              <div className='w-full h-3 bg-gray-800 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-1000'
                  style={{ width: `${indiaStats.uttarPradeshPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className='grid grid-cols-3 gap-4 mt-8'>
              <div className='text-center p-3 bg-green-950/50 rounded-xl'>
                <FaCity className='text-3xl text-green-400 mx-auto mb-2' />
                <p className='text-xs text-gray-400'>75+ Cities</p>
              </div>
              <div className='text-center p-3 bg-green-950/50 rounded-xl'>
                <FaIndustry className='text-3xl text-green-400 mx-auto mb-2' />
                <p className='text-xs text-gray-400'>Expanding</p>
              </div>
              <div className='text-center p-3 bg-green-950/50 rounded-xl'>
                <FaChargingStation className='text-3xl text-green-400 mx-auto mb-2' />
                <p className='text-xs text-gray-400'>24/7 Active</p>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 shadow-2xl'>
          <div className='flex items-center gap-4 mb-8'>
            <div className='p-3 bg-amber-600 rounded-xl'>
              <FaMapMarkedAlt className='text-3xl text-white' />
            </div>
            <div>
              <h3 className='text-2xl font-bold text-white'>Top 5 States by EV Stations</h3>
              <p className='text-gray-400'>Leading regions in EV infrastructure development</p>
            </div>
          </div>

          <div className='space-y-4'>
            {indiaStats.topStates.map((state, index) => (
              <div key={index} className='group'>
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center gap-4'>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black
                      ${index === 0 ? 'bg-yellow-600 text-white' : ''}
                      ${index === 1 ? 'bg-gray-400 text-white' : ''}
                      ${index === 2 ? 'bg-amber-700 text-white' : ''}
                      ${index > 2 ? 'bg-gray-700 text-white' : ''}
                    `}>
                      #{index + 1}
                    </div>
                    <div>
                      <p className='text-lg font-bold text-white'>{state.name}</p>
                      <p className='text-sm text-gray-400'>{state.stations.toLocaleString()} charging stations</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-2xl font-black text-white'>{state.percentage}%</p>
                    <p className='text-xs text-gray-500'>of total</p>
                  </div>
                </div>

                <div className='w-full h-2 bg-gray-800 rounded-full overflow-hidden'>
                  <div
                    className={`h-full rounded-full transition-all duration-1000 group-hover:brightness-110
                      ${index === 0 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : ''}
                      ${index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' : ''}
                      ${index === 2 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : ''}
                      ${index > 2 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : ''}
                    `}
                    style={{ width: `${state.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className='mt-8 pt-6 border-t border-gray-800'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-center'>
              <div className='p-4 bg-gray-800/50 rounded-xl'>
                <p className='text-3xl font-black text-amber-500'>9,626</p>
                <p className='text-sm text-gray-400 mt-1'>Top 5 States Total</p>
              </div>
              <div className='p-4 bg-gray-800/50 rounded-xl'>
                <p className='text-3xl font-black text-green-500'>80.2%</p>
                <p className='text-sm text-gray-400 mt-1'>Combined Coverage</p>
              </div>
              <div className='p-4 bg-gray-800/50 rounded-xl'>
                <p className='text-3xl font-black text-blue-500'>3rd</p>
                <p className='text-sm text-gray-400 mt-1'>UP Ranking</p>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-12 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-700/30 rounded-2xl p-6 text-center'>
          <p className='text-gray-300 text-lg'>
            <span className='font-bold text-green-400'>Uttar Pradesh</span> ranks <span className='font-bold text-white'>3rd</span> in India with{' '}
            <span className='font-bold text-white'>{indiaStats.uttarPradeshPercentage}%</span> of the nation's EV charging infrastructure
          </p>
          <p className='text-gray-500 text-sm mt-2'>Data as of 2026 • Growing network across highway corridors and urban centers</p>
        </div>
      </div>
    </div>
  );
};

export default EVDetails;
