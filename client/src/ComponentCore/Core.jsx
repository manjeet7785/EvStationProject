import React from 'react';
import { VscGraph } from "react-icons/vsc";
import { CgSmartphoneChip } from "react-icons/cg";
import { MdPrivacyTip } from 'react-icons/md';
import { FaMapMarkerAlt } from 'react-icons/fa';
import EVDetails from './EVDetails';

const Core = () => {

  const Feature = [
    {
      id: 1,
      icon: <VscGraph />,
      name: "Dashboard Overview",
      Para: "Get a quick view of key information like station activity, reports, and usage stats.",
    },
    {
      id: 2,
      icon: <CgSmartphoneChip />,
      name: "Smart Features",
      Para: "Helpful tools to make managing and using charging stations simpler and smoother.",
    },
    {
      id: 3,
      icon: <MdPrivacyTip />,
      name: "Safe & Reliable",
      Para: "Built-in safety and access control features to ensure a secure user experience.",
    },
  ];

  const charging = [
    {
      "id": 1, "icon": "⚡", "name": "Fast DC Chargers", "total_number": 520, "watt_capacity": "50kW - 350kW", "description": "High-power chargers suitable for quick, long-distance stops."
    },
    {
      "id": 2, "icon": "🔌", "name": "AC Level 2 Stations", "total_number": 1250, "watt_capacity": "3.3kW - 22kW", "description": "Ideal for overnight charging or longer visits like malls and workplaces."
    },
    {
      "id": 3, "icon": "🔋", "name": "Battery Swapping Points", "total_number": 75, "watt_capacity": "N/A (Instant Swap)", "description": "Quick exchange service primarily for 2-wheelers and 3-wheelers."
    },
    {
      "id": 4, "icon": "🏠", "name": "Home Charging Solutions", "total_number": 3000, "watt_capacity": "7.4kW", "description": "Solutions provided for personal garages and residential use."
    }
  ];


  return (
    <>
      <div className='w-full flex min-h-[100vh] md:h-[90vh] items-center justify-center p-4 md:p-8'>

        <div className='w-full md:w-[90%] lg:w-[80%] min-h-[90%] rounded-xl text-white flex flex-col md:flex-row 
                       gap-8 md:gap-12 p-6 md:p-10 
                       border border-gray-800 bg-gray-950 shadow-2xl overflow-hidden'>

          {/* ========================= Left Section ============================== */}

          <div className="w-full md:w-[50%] flex flex-col items-start left text-left">

            <span className='w-fit rounded-full px-4 py-1 uppercase bg-gray-800 text-amber-500 text-sm font-semibold border border-gray-700'>
              Core Features
            </span>

            <h1 className='mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white'>
              Enterprise-grade charging infrastructure management
            </h1>

            <p className='mt-4 text-gray-400 text-lg'>
              Our platform provides comprehensive tools to monitor, optimize and scale your EV charging Networks with unprecedented control and efficiency.
            </p>

            <div className='mt-8 w-full space-y-4'>
              {Feature.map((item) => (
                <div key={item.id} className='flex gap-4 p-3 bg-gray-900 rounded-lg border border-gray-800 hover:bg-gray-800 transition duration-300'>

                  <div className='flex-shrink-0 flex items-center justify-center text-3xl text-amber-500'>
                    {item.icon}
                  </div>

                  <div className='flex flex-col text-left'>
                    <span className='text-lg font-bold text-white'>{item.name}</span>
                    <p className='text-gray-400 text-sm'>{item.Para}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="right w-full md:w-1/2 flex flex-col gap-6 p-4 md:p-6 bg-gray-900 rounded-xl shadow-inner border border-gray-800">

            <div className='flex flex-col items-start'>
              <span className='text-xl font-bold uppercase text-white'>Network Dashboard</span>
              <p className='text-gray-400'>Live status and management of charging stations.</p>
            </div>

            <div className='w-full'>
              <span className='text-3xl font-bold text-white'>Charging Stations</span>
              <p className='text-gray-400 text-sm'>Manage your network and view capacity.</p>
            </div>

            <div className='relative w-full'>
              <input
                className='w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500'
                type="text"
                placeholder='Enter your Location'
              />
              <FaMapMarkerAlt className='absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500' />
            </div>

            <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2'>
              {charging.map((item) => (

                <div key={item.id} className='bg-gray-800 p-4 rounded-lg flex flex-col border border-gray-700 hover:border-amber-500 transition duration-300'>

                  <div className='flex items-center gap-3'>

                    <div className='flex-shrink-0 text-3xl text-amber-500'>
                      {item.icon}
                    </div>

                    <div className='flex flex-col text-left'>
                      <span className='text-lg font-bold text-white leading-tight'>{item.name}</span>
                      <p className='text-sm text-gray-400 leading-tight'>
                        {item.total_number} Points • {item.watt_capacity}
                      </p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <EVDetails />
    </>
  )
}

export default Core; 