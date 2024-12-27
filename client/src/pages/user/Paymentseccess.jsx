import React from "react";
import { Link } from "react-router-dom";

export const Paymentseccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen dark:bg-base-100 dark:text-base-content bg-gray-100">
      {/* Success Message */}
      <h1 className="text-4xl font-bold text-green-600 mb-4">
        Payment Successful!
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Thank you for your payment. Your booking has been confirmed.
      </p>

      {/* Navigation Button */}
      <Link
        to="/user/Carbookinglists"
        className="px-8 py-3 bg-blue-500 dark:bg-base-100 dark:text-base-content text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105"
      >
        Go to Bookings
      </Link>
    </div>
  );
};
