import React, { useState } from "react";
import { useFetch } from "../../hooks/useFetch";

import { axiosInstance } from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { generateBill, generateCarWiseBookingReport } from "../shared/Pdf";
import { Skeletonbook } from "../../components/admin/Skeletonbook";

export const Adminbooking = () => {
  const [data, isLoading, error] = useFetch("/bookings"); // Fetch bookings data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Track search query for filtering
  const navigate = useNavigate(); // For page refresh/navigation

  if (isLoading) {
    return <Skeletonbook />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Function to handle cancel booking
  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await axiosInstance({
        method: "PATCH",
        url: `/admin/bookingcancel/${bookingId}`, // Use bookingId here
      });

      if (response.data.message) {
        // Close modal after successful cancellation
        setIsModalOpen(false);
        alert(response.data.message); // Optionally show a success message
        // Refresh the booking list by re-rendering the component
        navigate(0); // This will refresh the current route (re-render the component)
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel booking.");
    }
  };

  // Apply filter to the data based on the search query
  const filteredData = searchQuery
    ? data.filter((booking) => {
        const lowerQuery = searchQuery.toLowerCase();
        return (
          booking?.carId?.brand?.toLowerCase().includes(lowerQuery) ||
          booking?.carId?.carType?.toLowerCase().includes(lowerQuery) ||
          booking?.status?.toLowerCase().includes(lowerQuery) ||
          booking?.userId?.name.toLowerCase().includes(lowerQuery) ||
          booking?.location?.toLowerCase().includes(lowerQuery)
        );
      })
    : data; // Show all bookings if no filter is applied
    const handleGenerateReport = () => {
      if (!data || data.length === 0) {
        alert("No bookings available to generate a report.");
        return;
      }
      generateCarWiseBookingReport(data); // Pass the entire bookings data to the function
    };
  return (
    <div className="container mx-auto min-h-screen py-6">
      <h1 className="text-center text-3xl font-semibold mb-6">Booking List</h1>
      <button
        className="bg-blue-600 m-3 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transform transition duration-300 ease-in-out hover:scale-105"
        onClick={handleGenerateReport}
      >
        Generate Report
      </button>
      {/* Search Filter */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Car Brand, Type, Status, Booked by or Location"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query
        />
      </div>

      {/* Render filtered data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData?.map((booking) => (
          <div
            key={booking?._id}
            className="border rounded-lg shadow-md p-4 flex flex-col"
          >
            {/* Display Car Image and Details */}
            <img
              src={booking?.carId?.carImages[0]} // Assuming carImages is an array
              alt={booking?.carId?.model}
              className="w-full h-40 object-cover rounded-t-lg mb-4"
            />
            <div className="flex-1">
              <h2 className="text-lg font-semibold">
                {booking?.carId?.brand} {booking?.carId?.model}
              </h2>
              <p className="text-sm text-gray-600">Car Type: {booking?.carId?.carType || "N/A"}</p>
              <p className="text-sm text-gray-600">Car Year: {booking?.carId?.year || "Unknown"}</p>
              <p className="text-sm text-gray-600">
                Booked by: {booking?.userId?.name || "Unknown User"}
              </p>
              <p className="text-sm text-gray-600">
                Status:{" "}
                <span
                  className={`font-bold ${booking?.status === "Booked" ? "text-green-600" : "text-red-600"}`}
                >
                  {booking?.status}
                </span>
              </p>
              <p className="text-sm text-gray-600">Location: {booking?.location}</p>
              <p className="text-sm text-gray-600">
                From: {new Date(booking?.fromDate).toLocaleDateString("en-GB")}
              </p>
              <p className="text-sm text-gray-600">
                To: {new Date(booking?.toDate).toLocaleDateString("en-GB")}
              </p>
              <p className="text-sm text-gray-600">
                Total Amount Paid: ₹{booking.totalAmountPaid}
              </p>
              <p className="text-sm text-gray-600">Payment Mode: {booking?.paymentMode}</p>
              <p className="text-sm text-gray-600">
                Payment Date: {booking?.bookingDate}
              </p>
              <p className="text-sm text-gray-600">User: {booking?.userId?.email}</p>
              <p className="text-sm text-gray-600">Phone: {booking?.userId?.phone}</p>

              {/* Cancel Booking Button */}
              {booking?.status === "Booked" && (
                <button
                  className="bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700 transform transition duration-300 ease-in-out hover:scale-105"
                  onClick={() => {
                    setBookingToCancel(booking?._id);
                    setIsModalOpen(true); // Open confirmation modal
                  }}
                >
                  Cancel Booking
                </button>
              )}

              {/* Generate Bill Button */}
              {booking?.status !== "Cancelled" && (
                <button
                  className="bg-blue-600 m-3 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transform transition duration-300 ease-in-out hover:scale-105"
                  onClick={() => generateBill(booking)}
                >
                  Generate Bill
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold">Are you sure you want to cancel this booking?</h2>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-400 text-white py-2 px-4 rounded-lg mr-2"
                onClick={() => setIsModalOpen(false)} // Close the modal
              >
                No
              </button>
              <button
                className="bg-red-600 text-white py-2 px-4 rounded-lg"
                onClick={() => handleCancelBooking(bookingToCancel)} // Pass the bookingId
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
