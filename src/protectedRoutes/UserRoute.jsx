import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const UserRoute = ({children}) => {
  const user= useSelector((state)=>state.userInfo.value)


  if (user) return children
  if (!user) return <Navigate to="/login"/>
}

export default UserRoute