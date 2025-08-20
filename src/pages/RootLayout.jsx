import React from 'react'
import Navbar from '../components/navbar/Navbar'
import Sidebar from '../components/sidebar/Sidebar'

const RootLayout = () => {
  return (
    <div>
      <Navbar/>
      <Sidebar/>
    </div>
  )
}

export default RootLayout