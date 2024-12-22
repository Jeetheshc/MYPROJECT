import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-50">
      {/* Icon and Header */}
      <div className="text-center">
        <FaExclamationTriangle className="text-blue-600 text-6xl mb-4" />
        <h1 className="text-4xl font-bold text-gray-700 mb-2">404 - Page Not Found</h1>
        <p className="text-lg text-gray-600">The page you are looking for does not exist.</p>
      </div>

      {/* Navigate to Home Button */}
      <button
        onClick={() => navigate('/')}
        className="mt-8 flex items-center px-6 py-3 bg-blue-600 text-white font-semibold text-lg rounded-md shadow-md hover:bg-blue-700 transition duration-300"
      >
        <FaHome className="mr-2" />
        Back to Home
      </button>
    </div>
  );
};

export default ErrorPage;
