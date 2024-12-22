import React from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { DarkMode } from '../shared/Darkmode'
import { FaCar } from "react-icons/fa";
export const AdminLogoutHeader = () => {
    const navigate = useNavigate ()
  return (
    <div className='bg-blue-100 text-blue-900 dark:bg-base-100 dark:text-base-content p-4 flex font-semibold py-4 px-4  items-center justify-between'>
             <Link 
      to={"/admin"} 
      className="text-2xl font-bold uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-green-700 flex items-center gap-2 animate-pulse"
    > <FaCar className="text-3xl text-blue-700" />
      CARENTO
    </Link>
            <nav>
               <h1 className="text-red-600">
               You are not authorised to use the URL
               </h1>
            </nav>

            <div className='flex items-center space-x-4'>
                <button onClick={()=>navigate('/admin/login')}className='bg-white text-blue-600 font-semibold px-4 py-2 rounded-md shadow-md hover:bg-blue-100 transition duration-300'>Admin Login</button>
                
            </div>
            <div className='flex items-center space-x-4'>
                <button onClick={()=>navigate('/login')}className='bg-white text-blue-600 font-semibold px-4 py-2 rounded-md shadow-md hover:bg-blue-100 transition duration-300'>User Login</button>
                
            </div>

            <DarkMode />
        </div>
  )
}
