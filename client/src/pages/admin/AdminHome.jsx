import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaClipboardList, FaUsers } from 'react-icons/fa';

export const AdminHome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center ">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        <div className="flex gap-8">
          <button
            className="flex flex-col items-center px-8 py-6 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-all duration-300 w-40 h-40"
            onClick={() => navigate('/admin/admin/carslist')}
          >
            <FaCar className="text-5xl mb-4" />
            <span className="text-lg font-semibold">Car List</span>
          </button>
          <button
            className="flex flex-col items-center px-8 py-6 bg-green-500 text-white rounded-xl shadow-lg hover:bg-green-600 transition-all duration-300 w-40 h-40"
            onClick={() => navigate('/admin/admin/userlist')}
          >
            <FaUsers className="text-5xl mb-4" />
            <span className="text-lg font-semibold">User List</span>
          </button>
          <button
            className="flex flex-col items-center px-8 py-6 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-all duration-300 w-40 h-40"
            onClick={() => navigate('/admin/admin/bookings')}
          >
            <FaClipboardList className="text-5xl mb-4" /> {/* You can choose a suitable icon for bookings */}
            <span className="text-lg font-semibold">Bookings</span>
          </button>
        </div>
      </div>
    </div>
  );
};