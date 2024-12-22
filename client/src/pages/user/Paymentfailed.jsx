import React from "react";
import { Link } from "react-router-dom";

export const Paymentfailed = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen dark:bg-base-100 dark:text-base-content bg-gray-100">
      {/* Failure Message */}
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        Payment Failed!
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Oops! Something went wrong with your payment. Please try again.
      </p>

      {/* Navigation Button */}
      <Link
        to="/cars"
        className="px-8 py-3 bg-blue-500 dark:bg-base-100 dark:text-base-content text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105"
      >
        Browse Cars
      </Link>
    </div>
  );
};
