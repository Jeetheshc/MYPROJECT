import React, { useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { axiosInstance } from '../../config/axiosInstance';
import toast from 'react-hot-toast';

export const Paymentseccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();

  // Function to verify payment and create booking
  const verifyPaymentAndCreateBooking = useCallback(async () => {
    try {
      // Validate session ID
      if (!sessionId) {
        toast.error("Missing payment session ID. Please try again.");
        return;
      }

      // Verify payment session status with the backend
      const { data } = await axiosInstance.get(`/payment/session-status?session_id=${sessionId}`);
      if (data.status !== 'succeeded') {
        toast.error("Payment verification failed. Please try again.");
        return;
      }

      // Retrieve booking details from localStorage
      const bookingDetails = {
        carId: localStorage.getItem('carId'),
        fromDate: localStorage.getItem('fromDate'),
        toDate: localStorage.getItem('toDate'),
        location: localStorage.getItem('location'),
        totalAmountPaid: Number(localStorage.getItem('totalPrice')), // Convert totalPrice to a number
        paymentMode: 'Stripe',
      };

      // Validate booking details
      if (
        !bookingDetails.carId ||
        !bookingDetails.fromDate ||
        !bookingDetails.toDate ||
        !bookingDetails.location ||
        !bookingDetails.totalAmountPaid
      ) {
        console.log(localStorage.getItem('carId'));
console.log(localStorage.getItem('fromDate'));
console.log(localStorage.getItem('toDate'));
console.log(localStorage.getItem('location'));
console.log(localStorage.getItem('totalPrice'));

        toast.error("Incomplete booking details. Please try again.");
        return;
      }

      // Finalize booking
      const bookingResponse = await axiosInstance.post('/bookings/create', bookingDetails);
      if (bookingResponse.status === 201) {
        toast.success("Booking Confirmed!");
        navigate('/user/Carbookinglists'); // Navigate to booking list
      } else {
        toast.error("Failed to create booking. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying payment or creating booking:", error.message);
      toast.error("An error occurred. Please contact support.");
    }
  }, [sessionId, navigate]);

  // Automatically trigger verification on component load
  useEffect(() => {
    verifyPaymentAndCreateBooking();
  }, [verifyPaymentAndCreateBooking]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <p className="mb-4 text-lg font-medium">Processing your booking...</p>
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
          onClick={verifyPaymentAndCreateBooking} // Allow manual retry
        >
          Reload Booking
        </button>
      </div>
    </div>
  );
};
