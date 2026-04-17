import React from 'react'
import { BsLightningCharge } from "react-icons/bs";
import { Link } from 'react-router-dom';
import HighlightText from '../TextColor/HighlightText';
import { FaArrowRightLong } from "react-icons/fa6";
import CTABTN from '../TextColor/CTABTN';

const Hero = () => {
  return (
    <div className='w-full h-[90vh] flex flex-col  items-center justify-center font-extrabold text-white '>

      <Link to="/">

        <div className='group   p-1 mx-auto font-bold rounded-full bg-gray-800 transition-all duration-200 hover:scale-95 w-fit'>
          <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px] group-hover:bg-gray-950  '>
            <BsLightningCharge />
            <p className=' uppercase text-[1rem] sm:text-[10px]'>next-generation ev infrastructure</p>
          </div>
        </div>
      </Link>

      <div className=' flex flex-col justify-center text-center mt-4 items-center mb-4 '>
        <span className="font-extrabold text-6xl gap-4  mb-8">
          Intelligent
          {"  "}

          <HighlightText text={"Ev Charging Networks"}></HighlightText>
        </span>

        <p className=" w-[60%] flex text-center justify-center font-normal text-[1rem] line-clamp-2">
          The most advanced platform for managing  electric vehicle charging infrastructure with real-time analytics,AI optimization,and seamless scalability for enterprises and municipalities.
        </p>
      </div>

      <div className='flex gap-8 items-center justify-center '>
        <CTABTN active={true} path={"/map/GoogleMapp"} >
          Start Free Trail
          <FaArrowRightLong />
        </CTABTN  >

        <button
          onClick={() => window.open('https://youtu.be/OFRlJtCDt7o', '_blank')}
          className='rounded-md py-3 px-6 font-bold bg-gray-800 text-white hover:scale-95 transition-all duration-200'
        >
          Watch Demo
        </button>
      </div>




    </div>
  )
}

export default Hero