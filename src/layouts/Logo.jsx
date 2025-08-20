import React from 'react'
import smallLogo from '../assets/smallLogo.svg'

const Logo = ({className}) => {
  return (
    <h1 className={`font-heading font-bold text-[32px] flex items-center justify-center gap-x-1 ${className}`}> <img className='w-[34px]' src={smallLogo} alt="" /> Collab<span className='text-primary'>rix.</span></h1>
  )
}

export default Logo