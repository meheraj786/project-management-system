import React from 'react'
import Navbar from '../components/navbar/Navbar'
import Sidebar from '../components/sidebar/Sidebar'
import Flex from '../layouts/Flex'
import { Outlet } from 'react-router'

const RootLayout = () => {
  return (
    <div>
      <Navbar/>
      <Flex className="items-start justify-start">
      <Sidebar/>
      <div className='flex-1'>
      <Outlet/>
      </div>
      </Flex>
    </div>
  )
}

export default RootLayout