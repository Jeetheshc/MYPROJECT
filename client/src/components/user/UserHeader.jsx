import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DarkMode } from '../shared/Darkmode';
import { axiosInstance } from '../../config/axiosInstance';
import { FaCar } from "react-icons/fa";
import { FaBars, FaTimes } from "react-icons/fa"; // Add the hamburger icon and close icon

function UserHeader() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For toggling the mobile menu

  const userLogout = async () => {
    try {
      const response = await axiosInstance({ method: "PUT", url: '/user/Logout' });
      navigate('/');
    } catch (error) {
      // Handle error if needed
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="w-full bg-gradient-to-r from-white via-green-500 to-blue-500 text-base-content shadow-md z-50 relative">
      <div className="container mx-auto flex items-center justify-between py-2 px-6">
        {/* Logo */}
        <Link
          to={"/"}
          className="text-2xl font-bold uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-green-700 flex items-center gap-2 animate-pulse"
        >
          <FaCar className="text-3xl text-blue-700" />
          CARENTO
        </Link>

        {/* Hamburger Menu for Mobile */}
        <button onClick={toggleMenu} className="lg:hidden text-3xl text-blue-700">
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden lg:block">
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

        {/* Profile and Logout Button */}
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

        {/* Dark Mode Toggle */}
        <DarkMode />
      </div>

      {/* Mobile Navigation Links (Toggled by Hamburger Menu) */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-white p-4 shadow-md">
          <ul className="space-y-4">
            <li>
              <Link to="/" className="font-bold text-blue-700 hover:text-blue-500 transition-all duration-300">Home</Link>
            </li>
            <li>
              <Link to="/about" className="font-bold text-blue-700 hover:text-blue-500 transition-all duration-300">About</Link>
            </li>
            <li>
              <Link to="/cars" className="font-bold text-blue-700 hover:text-blue-500 transition-all duration-300">Cars</Link>
            </li>
            <li>
              <Link to="/user/Carbookinglists" className="font-bold text-blue-700 hover:text-blue-500 transition-all duration-300">Bookings</Link>
            </li>
            <li>
              <Link to="/user/profile" className="font-bold text-blue-700 hover:text-blue-500 transition-all duration-300">Profile</Link>
            </li>
            <li>
              <button
                onClick={userLogout}
                className="font-bold text-red-600 hover:text-red-500 transition-all duration-300 w-full text-left"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserHeader;
