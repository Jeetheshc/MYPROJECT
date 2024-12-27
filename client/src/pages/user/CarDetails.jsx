import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { ProductSkelton } from "../../components/user/Skelton";
import { axiosInstance } from "../../config/axiosInstance";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";
export const CarDetails = () => {
  const { id } = useParams();
  const locationState = useLocation().state;
  const { bookingDetails } = locationState || {};
  const [Cars, isLoading] = useFetch(`car/${id}`);
  const navigate = useNavigate();
  console.log("detais", Cars);
  const [formData, setFormData] = useState({
    fromDate: bookingDetails?.fromDate || "",
    toDate: bookingDetails?.toDate || "",
    location: bookingDetails?.location || "",
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  const parseDate = (dateString) => {
    // Split the date string by slash
    const [day, month, year] = dateString.split('/');
    
    // Create a new Date object with the format YYYY-MM-DD
    // JavaScript accepts YYYY-MM-DD format, so we reorder the day, month, year
    const parsedDate = new Date(`${year}-${month}-${day}`);
    
    // Check if the parsed date is valid
    if (isNaN(parsedDate.getTime())) {
      console.error("Invalid date:", dateString);
      return null;  // Return null if the date is invalid
    }
  
    return parsedDate;
  };
  

  useEffect(() => {
    if (formData.fromDate && formData.toDate && Cars?.pricePerDay) {
      const from = parseDate(formData.fromDate);
      const to = parseDate(formData.toDate);

      if (to >= from) {
        let rentalDays = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
        const calculatedPrice = rentalDays * Cars.pricePerDay;

        setTotalDays(rentalDays);
        setTotalPrice(calculatedPrice);
      } else {
        setTotalDays(0);
        setTotalPrice(0);
      }
    } else {
      setTotalDays(0);
      setTotalPrice(0);
    }
  }, [formData.fromDate, formData.toDate, Cars]);

  const makePayment = async () => {
    try {
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_Publishable_key);

      console.log("Car data being sent to backend:", Cars);

      const fromDateObj = parseDate(formData.fromDate);
      const toDateObj = parseDate(formData.toDate);
    
      if (!fromDateObj || !toDateObj) {
        alert("Invalid date selected. Please select valid dates.");
        return;
      }
    
      if (fromDateObj > toDateObj) {
        alert("From date cannot be later than To date.");
        return;
      }
    
      const formattedFromDate = fromDateObj.toISOString();
      const formattedToDate = toDateObj.toISOString();
    
      // Prepare the booking data
      const bookingData = {
        carId: Cars._id,
        fromDate: formattedFromDate,
        toDate: formattedToDate,
        location: formData.location,
        totalAmountPaid: totalPrice,
      };
    
      // Store the booking details in localStorage before payment
      localStorage.setItem("carId", bookingData.carId);
      localStorage.setItem("fromDate", bookingData.fromDate);
      localStorage.setItem("toDate", bookingData.toDate);
      localStorage.setItem("location", bookingData.location);
      localStorage.setItem("totalPrice", bookingData.totalAmountPaid);
    
      console.log("Booking Data to be Sent:", bookingData);
      // Send the total price instead of pricePerDay
      const session = await axiosInstance.post("/payment/create-checkout-session", {
        car: {
          carId: {
            totalPrice: totalPrice,  // Pass the total price here
          },
          model: Cars?.model,
          carImages: Cars?.carImages || [],
        },
      });

      console.log("Session response:", session);

      const result = await stripe.redirectToCheckout({
        sessionId: session?.data?.sessionId,
      });

      if (result.error) {
        console.error("Stripe Checkout Error:", result.error);
      }
    } catch (error) {
      console.error("Error in makePayment:", error.response?.data || error.message);
      alert("Payment initiation failed. Please try again.");
    }
  };

  const handleConfirm = async () => {
    if (!formData.fromDate || !formData.toDate || !formData.location) {
      alert("Please ensure all details are correct before confirming.");
      return;
    }
  
    const fromDateObj = parseDate(formData.fromDate);
    const toDateObj = parseDate(formData.toDate);
  
    if (!fromDateObj || !toDateObj) {
      alert("Invalid date selected. Please select valid dates.");
      return;
    }
  
    if (fromDateObj > toDateObj) {
      alert("From date cannot be later than To date.");
      return;
    }
  
    const formattedFromDate = fromDateObj.toISOString();
    const formattedToDate = toDateObj.toISOString();
  
    const bookingData = {
      carId: Cars._id,
      fromDate: formattedFromDate,
      toDate: formattedToDate,
      location: formData.location,
      totalAmountPaid: totalPrice,
    };
  
    console.log("Booking Data to be Sent:", bookingData);
  
    try {
      const response = await axiosInstance.post("/bookings/create", bookingData);
  
      if (response.status === 201) {
        toast.success("Booking Confirmed !");
        navigate("/user/Carbookinglists");
      }
    } catch (error) {
      console.error("Error confirming booking:", error.message);
      alert("Failed to confirm booking.");
    }
  };

  return (
    <div className="flex justify-center items-center dark:bg-base-100 dark:text-base-content min-h-screen p-4 bg-gray-100">
      {isLoading ? (
        <ProductSkelton />
      ) : (
        <div className="flex flex-col md:flex-row dark:bg-base-100 dark:text-base-content bg-white shadow-lg rounded-lg w-full max-w-6xl p-6 gap-8">
          {/* Car Details */}
          <div className="flex-1">
            <img
              src={Cars?.carImages[0]}
              alt={`${Cars?.brand} ${Cars?.model}`}
              className="w-full h-48 md:h-64 object-cover rounded-md mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {Cars?.brand} {Cars?.model}
            </h2>
            <p className="text-gray-500 mb-2">{Cars?.year}</p>
            <p className="text-lg text-gray-600 font-semibold mb-2">
              Rs.{Cars?.pricePerDay} / Day
            </p>
            <p className="text-gray-600 font-semibold">
              Location: {Cars?.location}
            </p>
            <p className="text-gray-600 font-semibold">
              Registration: {Cars?.carNumber}
            </p>

            <ul className="text-gray-500 text-sm mt-4">
              {Cars?.features.map((feature, index) => (
                <li key={index} className="list-disc list-inside">
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Booking Details */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-xl font-semibold mb-4">Booking Details</h3>
            <p>From Date: {formData.fromDate}</p>
            <p>To Date: {formData.toDate}</p>
            <p>Pickup Location: {formData.location}</p>
            <p className="text-lg font-semibold text-blue-500 mt-2">
              Total Days: {totalDays}
            </p>
            <p className="text-lg font-semibold text-blue-500 mt-2">
              Total Price: Rs.{totalPrice.toFixed(2)}
            </p>

            <div className="flex justify-end mt-auto gap-4">
              <button
                className="px-6 py-2 bg-blue-500  text-white rounded-md hover:bg-blue-600 transition-all"
                onClick={makePayment}
              >
                Confirm Booking
              </button>
              <button
                className="px-6 py-2 bg-blue-500  text-white rounded-md hover:bg-blue-600 transition-all"
                onClick={handleConfirm}
              >
                 Booking
              </button>
            </div>
          </div>
          

          {/* Provider Details */}
          <div className="w-full md:w-1/3 dark:bg-base-100 dark:text-base-content bg-gray-50 shadow-md rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Car Provider Details</h3>
            {Cars?.ownerDetails ? (
              <div className="flex flex-col items-center">

                <p className="text-lg font-semibold">{Cars.ownerDetails.name}</p>
                <p className="text-sm text-gray-500">{Cars.ownerDetails.address}</p>
                <p className="text-sm text-gray-500">Phone: {Cars.ownerDetails.mobileNumber}</p>
                <p className="text-sm text-gray-500">Email: {Cars.ownerDetails.email}</p>
              </div>
            ) : (
              <p>Loading provider details...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
