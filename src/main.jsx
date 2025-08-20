import React,{ StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import firebaseConfig from './firebase/firebase.js'
import { createBrowserRouter, RouterProvider } from 'react-router'
import RootLayout from './pages/RootLayout.jsx'
import Registration from './pages/Registration.jsx'
import Login from './pages/Login.jsx'



const router = createBrowserRouter([
  { path: "/", Component: RootLayout },
  { path: "/registration", Component: Registration },
  { path: "/login", Component: Login },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />,
  </StrictMode>,
)
