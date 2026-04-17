import React from 'react'
import { Link } from 'react-router-dom'

const CTABTN = ({ children, active, linkto }) => {
  return (
    <Link to={linkto}>    <div className={`group font-semibold flex gap-4 justify-center items-center rounded-xl border-2  p-2.5
    
      ${active ? "bg-blue-600 text-white " : " "} hover:scale-95 w-fit"
    `}>
      {children}
    </div>
    </Link>

  )
}

export default CTABTN