import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DarkMode } from '../shared/Darkmode';
import { axiosInstance } from '../../config/axiosInstance';
import { FaCar } from "react-icons/fa";

function UserHeader() {
  const navigate = useNavigate();
  const userLogout = async () => {
    try {
      const response = await axiosInstance({ method: "PUT", url: '/user/Logout' });
      navigate('/')
    } catch (error) {
      // Handle error if needed
    }
  }

  return (
    <div className="w-full bg-gradient-to-r from-white via-green-500 to-blue-500 text-base-content shadow-md z-50 relative">
      <div className="container mx-auto flex items-center justify-between py-2 px-6">
        {/* Logo */}
        <Link
          to={"/"}
          className="text-2xl font-bold uppercase tracing-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-green-700 flex items-center gap-2 animate-pulse"
        >
          <FaCar className="text-3xl text-blue-700" />
          CARENTO - 
        </Link>

        {/* Navigation Links */}
        <nav>
          <ul className="flex gap-6">
            <li>
              <Link to="/" className="font-bold hover:text-blue-300 transition-all duration-300">Home</Link>
            </li>
            <li>
              <Link to="/about" className="font-bold hover:text-blue-300 transition-all duration-300">About</Link>
            </li>
            <li>
              <Link to="/cars" className="font-bold hover:text-blue-300 transition-all duration-300">Cars</Link>
            </li>
            <li>
              <Link to="/user/Carbookinglists" className="font-bold hover:text-blue-300 transition-all duration-300">Bookings</Link>
            </li>
          </ul>
        </nav>

        {/* Profile Button */}
        <div>
          <button
            onClick={() => navigate('user/profile')}
            className="bg-white mr-5 text-sky-700 font-semibold px-4 py-2 rounded-md shadow-md hover:bg-blue-100 transition-all duration-300"
          >
            Profile
          </button>
          <button
            className="bg-white text-red-600 font-semibold px-4 py-2 rounded-md shadow-md hover:bg-blue-100 transition-all duration-300"
            onClick={userLogout}
          >
            Logout
          </button>
        </div>
        <DarkMode />
      </div>

    </div>
  );
}

export default UserHeader;
