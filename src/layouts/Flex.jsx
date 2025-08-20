import React from 'react'

const Flex = ({children, className}) => {
  return (
    <div className={`flex flex-wrap justify-center items-center ${className}`}>{children}</div>
  )
}

export default Flex