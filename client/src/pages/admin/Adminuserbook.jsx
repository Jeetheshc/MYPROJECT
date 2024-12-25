import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance"; // Adjust to your Axios instance

export const Adminuserbook = () => {
    const { id } = useParams(); // Get userId from URL
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axiosInstance.get(`admin/bookings/userbook/${id}`);
                setBookings(response.data.data); // Assuming your API returns bookings in the "data" field
            } catch (err) {
                setError("Error fetching bookings.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, [id]);

    if (isLoading) {
        return <div>Loading bookings...</div>;
    }

    if (error) {
        return <div className="text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-semibold text-center text-indigo-700 mb-6">
                Bookings 
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.length === 0 ? (
                    <div className="col-span-full text-center">
                        No bookings found for this user.
                    </div>
                ) : (
                    bookings.map((booking, index) => (
                        <div key={booking._id} className="bg-white border rounded-lg shadow-md p-4">
                            <div className="mb-4">
                                <img
                                    src={booking.carId?.carImages[0]} // Assuming the first image is the car image
                                    alt={`${booking.carId?.brand} ${booking.carId?.model}`}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            </div>
                            <h3 className="text-xl font-semibold">{booking.carId?.brand} {booking.carId?.model}</h3>
                            <p className="text-gray-600">{booking.carId?.year}</p>
                            <p className="text-gray-500 mt-2">Location: {booking.location}</p>

                            <div className="mt-4">
                                <p><strong>From Date:</strong> {new Date(booking.fromDate).toLocaleDateString()}</p>
                                <p><strong>To Date:</strong> {new Date(booking.toDate).toLocaleDateString()}</p>
                                <p><strong>Payment Mode:</strong> {booking.paymentMode}</p>
                                <p><strong>Total Amount Paid:</strong> ${booking.totalAmountPaid}</p>
                                <p><strong>Status:</strong> {booking.status}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
