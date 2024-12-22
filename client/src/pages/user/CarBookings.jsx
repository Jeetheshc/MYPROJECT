import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const CarBookings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { carDetails, bookingDetails } = location.state || {};

  if (!carDetails || !bookingDetails) {
    return (
      <div className="p-4">
        <p>No booking details available.</p>
      </div>
    );
  }

  const { fromDate, toDate, location: bookingLocation } = bookingDetails;

  // Convert dates to Date objects
  const fromDateObj = new Date(fromDate);
  const toDateObj = new Date(toDate);

  // Calculate total days
  const rentalDays = Math.ceil(
    (toDateObj - fromDateObj) / (1000 * 60 * 60 * 24)
  );

  // Ensure a minimum of one day is charged
  const totalPrice = rentalDays * carDetails.pricePerDay;

  const handleConfirmBooking = () => {
    alert("Booking confirmed!");
    navigate("/user/Carbookinglists", {
      state: {
        bookingDetails,
        carDetails,
        totalPrice,
        pickupAddress: carDetails.pickupLocation || "Default Pickup Location",
      },
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Booking Confirmation</h2>
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-xl font-semibold">
          {carDetails.brand} {carDetails.model}
        </h3>
        <p className="text-gray-500">{carDetails.year}</p>
        <p className="text-lg text-gray-600 font-semibold my-2">
          ${carDetails.pricePerDay} / Day
        </p>

        <h4 className="mt-4 text-lg font-semibold">Booking Details</h4>
        <ul className="text-gray-600">
          <li><strong>From:</strong> {fromDate}</li>
          <li><strong>To:</strong> {toDate}</li>
          <li><strong>Location:</strong> {bookingLocation}</li>
          <li><strong>Total Days:</strong> {rentalDays} {rentalDays === 1 ? "Day" : "Days"}</li>
          <li><strong>Total Price:</strong> Rs.{totalPrice}</li>
        </ul>

        <h4 className="mt-4 text-lg font-semibold">Pickup Address</h4>
        <p className="text-gray-600">{carDetails.pickupLocation || "Default Pickup Location"}</p>

        <button
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={handleConfirmBooking}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};
