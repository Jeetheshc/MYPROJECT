import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance";

export const CarbookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axiosInstance.get(`/bookings/${id}`);
        setBooking(response.data.data);
        console.log(response.data.data); // Log the booking details to inspect the structure
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch booking details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleCancel = async () => {
    const isWithin24Hours =
      new Date(booking.fromTime) - new Date() <= 24 * 60 * 60 * 1000;

    if (isWithin24Hours) {
      alert("Bookings cannot be canceled within 24 hours of the start time.");
      return;
    }

    const confirmCancellation = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (confirmCancellation) {
      try {
        await axiosInstance.patch(`/bookings/${id}`);
        alert("Booking canceled successfully.");
        navigate("/user/Carbookinglists");
      } catch (err) {
        alert(err.response?.data?.message || "Failed to cancel booking.");
      }
    }
  };

  if (isLoading) return <p>Loading booking details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const formatDate = (date) =>
    new Date(date).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Booking Details</h2>

      <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-3xl mx-auto">
        {/* Car Details */}
        <h3 className="text-lg font-semibold">Car Details</h3>
        {booking?.carId ? (
          <>
            <img
              src={booking.carId?.carimages?.[0]}
              alt={`${booking.carId?.brand} ${booking.carId?.model}`}
              className="w-[500px] h-auto max-w-full rounded-md mb-4"
            />
            <p><strong>Brand:</strong> {booking.carId?.brand}</p>
            <p><strong>Model:</strong> {booking.carId?.model}</p>
            <p><strong>Year:</strong> {booking.carId?.year}</p>
          </>
        ) : (
          <p>Car details not available.</p>
        )}

        <hr className="my-4" />

        {/* Car Provider Details */}
        <h3 className="text-lg font-semibold">Provider Details</h3>
        {booking?.carId?.provider ? (
          <>
            <img
              src={booking.carId.provider.profilePic || "https://via.placeholder.com/150"}
              alt={booking.carId.provider.name || "Provider"}
              className="w-24 h-24 rounded-full mb-4"
            />
            <p><strong>Name:</strong> {booking.carId.provider.name}</p>
            <p><strong>Email:</strong> {booking.carId.provider.email}</p>
            <p><strong>Phone:</strong> {booking.carId.provider.phone}</p>
            <p><strong>Address:</strong> {booking.carId.provider.address}</p>
          </>
        ) : (
          <p>Provider details not available.</p>
        )}

        <hr className="my-4" />

        {/* Booking Details */}
        <h3 className="text-lg font-semibold">Booking Details</h3>
        <p><strong>Location:</strong> {booking.location}</p>
        <p><strong>From:</strong> {formatDate(booking.fromTime)}</p>
        <p><strong>To:</strong> {formatDate(booking.toTime)}</p>
        <p><strong>Total Price:</strong> Rs.{booking.totalPrice}</p>
        <p><strong>Status:</strong>{" "}
          <span
            className={booking.status === "Cancelled" ? "text-red-500" : "text-green-500"}
          >
            {booking.status}
          </span>
        </p>
      </div>

      {/* Cancel Booking Button */}
      {booking.status !== "Cancelled" && (
        <button
          onClick={handleCancel}
          className="btn btn-primary mt-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-300"
        >
          Cancel Booking
        </button>
      )}
    </div>
  );
};
