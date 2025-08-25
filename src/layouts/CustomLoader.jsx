import React from 'react'
import Logo from './Logo.jsx'
import smallLogo from "../assets/smallLogo.svg";

const CustomLoader = () => {
  return (
    <div className='w-full fixed top-0 font-primary left-0 flex justify-center items-center bg-white h-screen'>
            <h1
              className={`font-heading font-bold  text-[52px] flex items-center justify-center gap-x-3 `}
            >
              {" "}
              <img className="w-[54px] rotate-stop-go" src={smallLogo} alt="" /> Collab
              <span className="text-primary">rix.</span>
              <span className="text-sm mb-2">Beta</span>
            </h1>
    </div>
  )
}

export default CustomLoader