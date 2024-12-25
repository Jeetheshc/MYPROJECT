import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch"; // Assuming this is your custom hook
import { SkeletonLoader } from "../../components/admin/SkeletonLoader";

export const Userdetailpage = () => {
    const { id } = useParams(); // Get the user ID from the URL parameters
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch user data using the useFetch hook
    const [data, isLoadingData, errorData] = useFetch(`admin/admin/userdetails/${id}`); // Adjust the endpoint as needed

    useEffect(() => {
        if (data) {
            setUser(data); // Set user data when fetched successfully
            setIsLoading(false);
        }
    }, [data]);

    if (isLoadingData) {
        return <SkeletonLoader />; // Show skeleton loader while data is loading
    }

    if (errorData) {
        return <div className="text-red-600">Error: {errorData.message}</div>;
    }

    if (!user) {
        return <div className="text-red-600">No user data available.</div>;
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
            <h1 className="text-4xl font-semibold text-center text-indigo-700 mb-6">User Details</h1>

            <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-medium text-white">
                        {user.name} ({user.email})
                    </h2>
                    <button
                        className="bg-yellow-500 text-white py-2 px-6 rounded-lg transition-colors hover:bg-yellow-600"
                        onClick={() => navigate(`admin/admin/edit-user/${user._id}`)}
                    >
                        Edit User
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {/* User Information */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-medium text-gray-700">User ID:</p>
                        <p>{user._id}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-medium text-gray-700">Name:</p>
                        <p>{user.name}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-medium text-gray-700">Email:</p>
                        <p>{user.email}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-medium text-gray-700">Phone:</p>
                        <p>{user.phone}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-medium text-gray-700">Address:</p>
                        <p>{user.address}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-medium text-gray-700">Profile Picture:</p>
                        {user.profilePic ? (
                            <img
                                src={user.profilePic}
                                alt="User Profile"
                                className="w-auto h-75 object-cover rounded-lg shadow-md"
                            />
                        ) : (
                            <p>No profile picture available.</p>
                        )}
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-medium text-gray-700">Created At:</p>
                        <p>{formatDate(user.createdAt)}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-medium text-gray-700">Updated At:</p>
                        <p>{formatDate(user.updatedAt)}</p>
                    </div>
                </div>

                {/* Add Bookings Button */}
                <div className="mt-6 text-center">
                    <button
                        className="bg-green-500 text-white py-2 px-6 rounded-lg transition-colors hover:bg-green-600"
                        onClick={() => navigate(`admin/admin/userreviews/${id}`)}
                    >
                        View Bookings
                    </button>
                </div>
            </div>
        </div>
    );
};
