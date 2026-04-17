import React from 'react'
import { CgHashtag, CgProfile } from "react-icons/cg";
import { RiPhoneFindLine, RiChargingPile2Line, RiMapPinLine } from "react-icons/ri";
import { IoMdArchive } from "react-icons/io";
import { FaPlug } from "react-icons/fa";
import { BsFillLightningChargeFill } from "react-icons/bs";

import { MdOutlinePayment } from "react-icons/md";

import EV from './Api/EvChargeApi.jsx'

const menu = [
  {
    icon: <RiPhoneFindLine />,
    Heading: "Find Station"
  },
  {
    icon: <RiChargingPile2Line />,
    Heading: "Start Charging"
  },
  {
    icon: <MdOutlinePayment />,
    Heading: "Network Dashboard"
  },
  {
    icon: <RiMapPinLine />,
    Heading: "Route Planner"
  },

  {
    icon: <IoMdArchive />,
    Heading: "Archive"
  }
]

const menuDetails = [
  {
    Heading: "Power OutCut",
    icon: <BsFillLightningChargeFill />
  },
  {
    Heading: "Power OutCut",
    icon: <BsFillLightningChargeFill />

  },
  {
    Heading: "Power OutCut",
    icon: <BsFillLightningChargeFill />

  },
  {
    Heading: "Power OutCut",
    icon: <BsFillLightningChargeFill />

  },
  {
    Heading: "Power OutCut",
    icon: <BsFillLightningChargeFill />

  },
]


const DetailsCard = () => {


  const locationsArray = Array.isArray(EV) ? EV : [];
  const featuredLocations = locationsArray.slice(0, 1);


  return (
    <div className=' flex flex-row gap-4 items-center justify-center '>

      <div className='px-2 p-1   rounded-2xl bg-gray-800'>


        <div className='flex items-center text-2xl flex-row gap-2'>
          <CgProfile className='text-6xl' />
          Manjeet Kumar
        </div>

        {
          menu.map((item, index) => (
            <div key={index} className="menu-item flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-900 rounded-2xl">
              <span className="text-xl text-blue-600">
                {item.icon}
              </span>
              <span className="font-medium">
                {item.Heading}
              </span>
            </div>
          ))
        }


      </div>
      {/* <div className='px-2   rounded-2xl bg-gray-800'>

        <div className='flex items-center  p-1 text-2xl flex-row gap-5'>
          <FaPlug className='text-6xl rounded-full object-cover' />
          MauryaPoint
        </div>

        {
          menuDetails.map((item, index) => (
            <div key={index} className="menu-item flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-900 rounded-2xl">
              <span className="text-xl text-blue-600">
                {item.icon}
              </span>
              <span className="font-medium">
                {item.Heading}
              </span>
            </div>
          ))
        }


      </div> */}

      {/* ------------ EV Charging Locations Display ------------- */}
      <div className='px-4 py-3 rounded-2xl bg-gray-900 w-96 max-h-96 overflow-y-auto'>
        <h3 className='text-2xl font-bold mb-4 text-green-400 border-b border-green-700 pb-2'>
          🔌 Featured EV Stations ({locationsArray.length} Total)
        </h3>

        {featuredLocations.map((location) => (
          <div key={location.id} className="location-card p-3 mb-3 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition duration-200">
            <div className='flex justify-between items-start mb-1'>
              <h4 className="text-lg font-semibold text-white">
                <CgHashtag className='inline-block mr-1 text-blue-400' /> {location.name}
              </h4>

              <span className={`text-sm font-bold px-2 py-1 rounded-full ${location.status === 'Active' ? 'bg-green-600' : 'bg-red-600'}`}>
                {location.power_capacity_kw} kW
              </span>
            </div>

            <div className="text-sm text-gray-400">
              <p><strong>Status:</strong> {location.status} ({location.availability})</p>
              <p><strong>Distance:</strong> {location.distance_km} km</p>
              <p className="mt-2 text-xs italic border-t border-gray-700 pt-1 text-yellow-300">
                {location.comment}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default DetailsCard