import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { axiosInstance } from "../../config/axiosInstance"; // Assuming axiosInstance is configured

export const Bookingdetails = () => {
    const { bookingId } = useParams();  // Fetch booking ID from URL params
    const [booking, isLoading, error] = useFetch(`/user/bookdetails/${bookingId}`);
    const navigate = useNavigate();

    // Loading state or error handling
    if (isLoading) {
        return <div>Loading booking details...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleCancelBooking = async () => {
        try {
            const response = await axiosInstance.delete(`/user/cancel-booking/${bookingId}`);
            if (response.data.success) {
                alert("Booking cancelled successfully");
                navigate("/user/bookings");  // Redirect to booking list after canceling
            } else {
                console.error("Failed to cancel booking:", response.data.message);
                alert("Failed to cancel booking.");
            }
        } catch (error) {
            console.error("Error canceling booking:", error);
            alert("An error occurred while canceling the booking.");
        }
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            {booking ? (
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-2xl font-semibold">
                        {booking.carId?.brand} {booking.carId?.model}
                    </h1>
                    <p>From: {new Date(booking.fromDate).toLocaleDateString()}</p>
                    <p>To: {new Date(booking.toDate).toLocaleDateString()}</p>
                    <p>Total Paid: Rs.{booking.totalAmountPaid}</p>
                    <p>Location: {booking.location}</p>
                    <p>Status: {booking.status}</p>
                    <p>Payment Mode: {booking.paymentMode}</p>

                    {/* Cancel Booking Button */}
                    <button
                        onClick={handleCancelBooking}
                        className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg"
                    >
                        Cancel Booking
                    </button>
                </div>
            ) : (
                <p>No booking details found.</p>
            )}
        </div>
    );
};
