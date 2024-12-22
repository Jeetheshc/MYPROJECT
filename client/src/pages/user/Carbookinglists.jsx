import React, { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { axiosInstance } from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";
import { SkeletonLoader } from "../../components/admin/SkeletonLoader";
import { generateBill, generateBookingReport } from "../shared/Pdf";

export const Carbookinglists = () => {
  const [bookings, isLoading, error] = useFetch("/user/user-bookings");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const navigate = useNavigate();

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">Error: {error}</div>;
  }

  const safeBookings = bookings || [];

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const isReviewEligible = (toDate) => {
    const currentDate = new Date();
    const bookingEndDate = new Date(toDate);
    return bookingEndDate <= currentDate;
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await axiosInstance({
        method: "PATCH",
        url: `/user/bookingcancel/${bookingId}`,
      });

      if (response.data.message) {
        setIsModalOpen(false);
        alert(response.data.message);
        navigate(0); // Refresh the current route
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel booking.");
    }
  };

  const openCancelModal = (bookingId) => {
    setBookingToCancel(bookingId);
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    if (status === "Booked") return "text-blue-600";
    if (status === "Cancelled") return "text-red-600";
    if (status === "Completed") return "text-green-600";
    return "text-gray-500";
  };

  const navigateToReviewPage = (bookingId, carId) => {
    navigate(`/user/reviewentry/${bookingId}/${carId}`);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen dark:bg-base-100 dark:text-base-content">
      <h1 className="text-2xl font-semibold mb-4">Your Bookings</h1>
      <div>
        <button
          onClick={() => generateBookingReport(safeBookings)} // Use the imported function
          className="bg-blue-600 m-3 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transform transition duration-300 ease-in-out hover:scale-105"
        >
          Generate Booking Report
        </button>
      </div>
      {safeBookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeBookings.map((booking) => {
            return (
              <div key={booking._id} className="bg-white shadow-md dark:bg-base-100 dark:text-base-content rounded-lg p-4">
                {booking.carId?.carImages && booking.carId.carImages.length > 0 && (
                  <img
                    src={booking.carId.carImages[0]}
                    alt={`${booking.carId.brand} ${booking.carId.model}`}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h2 className="text-lg font-semibold">{booking.carId?.brand} {booking.carId?.model}</h2>
                <p className="text-sm text-gray-500 dark:bg-base-100 dark:text-base-content">Booking ID: {booking._id}</p>
                <p>From: {formatDate(booking.fromDate)} - To: {formatDate(booking.toDate)}</p>
                <p>Location: {booking.carId?.location}</p>
                <p>Total Paid: Rs.{booking.totalAmountPaid}</p>
                <p className={`font-semibold ${getStatusColor(booking.status)}`}>Status: {booking.status}</p>
                <p>Payment Mode: {booking.paymentMode}</p>

                {booking?.status !== "Cancelled" && (
                  <button
                    className="bg-blue-600 m-3 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transform transition duration-300 ease-in-out hover:scale-105"
                    onClick={() => generateBill(booking)} // Use the imported function
                  >
                    Generate Bill
                  </button>
                )}

                {booking.status === "Booked" && (
                  <button
                    onClick={() => openCancelModal(booking._id)}
                    className="bg-red-600 m-3 text-white py-1 px-3 rounded-lg hover:bg-red-700 transform transition duration-300 ease-in-out hover:scale-105"
                  >
                    Cancel Booking
                  </button>
                )}

                {isReviewEligible(booking.toDate) && booking.status === "Completed" && (
                  <button
                    onClick={() => navigateToReviewPage(booking._id, booking.carId?._id)}
                    className="bg-green-600 m-3 text-white py-1 px-3 rounded-lg hover:bg-green-700 transform transition duration-300 ease-in-out hover:scale-105"
                  >
                    Add Review
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Are you sure you want to cancel this booking?</h2>
            <div className="mt-4">
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded-lg mr-2"
                onClick={() => handleCancelBooking(bookingToCancel)}
              >
                Yes, Cancel
              </button>
              <button
                className="bg-gray-600 text-white py-2 px-4 rounded-lg"
                onClick={() => setIsModalOpen(false)}
              >
                No, Keep it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
