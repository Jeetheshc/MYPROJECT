import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch"; // Assuming this is your custom hook
import { SkeletonLoader } from "../../components/admin/SkeletonLoader";

export const CarDetailpage = () => {
    const { id } = useParams(); // Get the car ID from the URL parameters
    const [car, setCar] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch car data using the useFetch hook
    const [data, isLoadingData, errorData] = useFetch(`admin/car/${id}`); // Adjust the endpoint as needed

    useEffect(() => {
        if (data) {
            setCar(data); // Set car data when fetched successfully
            setIsLoading(false);
        }
    }, [data]);

    if (isLoadingData) {
        return <SkeletonLoader />; // Show skeleton loader while data is loading
    }

    if (errorData) {
        return <div className="text-red-600">Error: {errorData.message}</div>;
    }

    if (!car) {
        return <div className="text-red-600">No car data available.</div>;
    }

    const formatDate = (date) => {
        const newDate = new Date(date);
        const day = newDate.getDate().toString().padStart(2, "0");
        const month = (newDate.getMonth() + 1).toString().padStart(2, "0");
        const year = newDate.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-semibold text-center text-indigo-700 mb-6">Car Details</h1>

            <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-medium text-white">
                        {car.brand} {car.model}
                    </h2>
                    <div>
                        <button
                            className="bg-yellow-500 text-white py-2 px-6 rounded-lg transition-colors hover:bg-yellow-600 mr-4"
                            onClick={() => navigate(`admin/admin/edit-car/${car._id}`)}
                        >
                            Edit Car
                        </button>
                        <button
                            className="bg-green-500 text-white py-2 px-6 rounded-lg transition-colors hover:bg-green-600 mr-4"
                            onClick={() => navigate(`admin/admin/car-bookings/${car._id}`)}
                        >
                            Booking History
                        </button>
                        <button
                            className="bg-red-500 text-white py-2 px-6 rounded-lg transition-colors hover:bg-blue-600"
                            onClick={() => navigate(`admin/admin/reviews/${car._id}`)} // Navigate to review page
                        >
                            View Reviews.
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {/* Display Car Information */}
                    <div className="mt-6">
                        <p className="font-medium text-gray-700">Car Image:</p>
                        <div className="flex space-x-4">
                            {car.carImages?.length > 0 ? (
                                <img
                                    src={car.carImages[0]} // Display the first image if available
                                    alt={`Car Image`}
                                    className="w-auto h-75 object-cover rounded-lg shadow-md"
                                />
                            ) : (
                                <p>No images available for this car.</p>
                            )}
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-medium text-gray-700">Car ID:</p>
                        <p>{car._id}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-medium text-gray-700">Car Brand:</p>
                        <p>{car.brand}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-medium text-gray-700">Model:</p>
                        <p>{car.model}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-medium text-gray-700">Year:</p>
                        <p>{car.year}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-medium text-gray-700">Price Per Day:</p>
                        <p className="text-green-600 font-semibold">{car.pricePerDay}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-medium text-gray-700">Car Type:</p>
                        <p className="text-blue-600">{car.carType}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-medium text-gray-700">Availability:</p>
                        <p className={car.availability ? "text-green-500" : "text-red-500"}>
                            {car.availability ? "Available" : "Not Available"}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-medium text-gray-700">Location:</p>
                        <p>{car.location}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-medium text-gray-700">Car Number:</p>
                        <p>{car.carNumber}</p>
                    </div>

                    {/* Display Owner Details */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-medium text-gray-700">Owner Name:</p>
                        <p>{car.ownerDetails?.name}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-medium text-gray-700">Owner Mobile Number:</p>
                        <p>{car.ownerDetails?.mobileNumber}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-medium text-gray-700">Owner Email:</p>
                        <p>{car.ownerDetails?.email}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-medium text-gray-700">Owner Address:</p>
                        <p>{car.ownerDetails?.address}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-medium text-gray-700">Owner Aadhar Number:</p>
                        <p>{car.ownerDetails?.aadharNumber}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-medium text-gray-700">Features:</p>
                        <ul>
                            {car.features?.map((feature, index) => (
                                <li key={index} className="text-gray-700">{feature}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-medium text-gray-700">Created At:</p>
                        <p>{formatDate(car.createdAt)}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-medium text-gray-700">Updated At:</p>
                        <p>{formatDate(car.updatedAt)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
