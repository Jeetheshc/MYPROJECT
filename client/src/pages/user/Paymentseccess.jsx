// import React from "react";
// import { Link } from "react-router-dom";

// export const Paymentseccess = () => {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen dark:bg-base-100 dark:text-base-content bg-gray-100">
//       {/* Success Message */}
//       <h1 className="text-4xl font-bold text-green-600 mb-4">
//         Payment Successful!
//       </h1>
//       <p className="text-lg text-gray-700 mb-6">
//         Thank you for your payment. Your booking has been confirmed.
//       </p>

//       {/* Navigation Button */}
//       <Link
//         to="/user/Carbookinglists"
//         className="px-8 py-3 bg-blue-500 dark:bg-base-100 dark:text-base-content text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105"
//       >
//         Go to Bookings
//       </Link>
//     </div>
//   );
// };
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { axiosInstance } from '../../config/axiosInstance';
import toast from 'react-hot-toast';

export const Paymentseccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPaymentAndCreateBooking = async () => {
      try {
        // Verify payment session status
        const { data } = await axiosInstance.get(`/payment/session-status?session_id=${sessionId}`);
        
        if (data.status === 'succeeded') {
          // Payment succeeded, finalize booking
          const bookingResponse = await axiosInstance.post('/bookings/create', {
            carId: localStorage.getItem('carId'), // Store carId in localStorage before payment
            fromDate: localStorage.getItem('fromDate'), // Store booking details in localStorage
            toDate: localStorage.getItem('toDate'),
            location: localStorage.getItem('location'),
            totalAmountPaid: localStorage.getItem('totalPrice'),
            paymentMode: 'Stripe',
          });

          if (bookingResponse.status === 201) {
            toast.success('Booking Confirmed!');
            navigate('/user/Carbookinglists');
          }
        } else {
          toast.error('Payment verification failed. Please try again.');
        }
      } catch (error) {
        console.error('Error verifying payment or creating booking:', error.message);
        toast.error('Failed to confirm booking. Please contact support.');
      }
    };

    if (sessionId) verifyPaymentAndCreateBooking();
  }, [sessionId, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Processing your booking...</p>
    </div>
  );
};

