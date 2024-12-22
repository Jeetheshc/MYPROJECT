import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch"; // Custom hook for fetching data
import { SkeletonLoader } from "../../components/admin/SkeletonLoader";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form"; // Import useForm from react-hook-form
import { axiosInstance } from "../../config/axiosInstance";

export const Edituser = () => {
    const { id } = useParams(); // Get the user ID from the URL
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Fetch the current user data
    const [data, isLoadingData, errorData] = useFetch(`admin/userdetails/${id}`);

    useEffect(() => {
        if (data) {
            setUser(data); // Set user data from the fetched response
        }
    }, [data]);

    // react-hook-form setup
    const { register, handleSubmit, setValue } = useForm(); // Initialize useForm

    useEffect(() => {
        console.log(user); // Check if user data is loaded
        if (user) {
            setValue("name", user.name);
            setValue("email", user.email);
            setValue("phone", user.phone);
            setValue("address", user.address);
        }
    }, [user, setValue]);


    const onSubmit = async (data) => {
        try {
            // Prepare the data to be sent, including the isActive field
            const updatedData = {
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address,
                isActive: data.isActive,  // Include the isActive status
            };
    
            // Make the API call to update the user data
            const response = await axiosInstance.put(`admin/useredit/${id}`, updatedData, {
                headers: {
                    "Content-Type": "application/json",  // Ensure the correct content type
                },
            });
    
            toast.success("User updated successfully!");
            navigate(`/admin/view-user/${id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update user. Please try again.");
        }
    };
    

    if (isLoadingData) {
        return <SkeletonLoader />;
    }

    if (errorData) {
        return <div className="text-red-600">Error: {errorData.message}</div>;
    }

    if (!user) {
        return <div className="text-red-600">No user data available.</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-semibold text-center text-indigo-700 mb-6">Edit User</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* User Name */}
                    <div>
                        <label htmlFor="name" className="block font-medium text-gray-700">Name</label>
                        <input
                            id="name"
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            {...register("name", { required: "Name is required" })}
                        />
                    </div>

                    {/* User Email */}
                    <div>
                        <label htmlFor="email" className="block font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            {...register("email", { required: "Email is required" })}
                        />
                    </div>

                    {/* User Phone */}
                    <div>
                        <label htmlFor="phone" className="block font-medium text-gray-700">Phone</label>
                        <input
                            id="phone"
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            {...register("phone", { required: "Phone is required" })}
                        />
                    </div>

                    {/* User Address */}
                    <div>
                        <label htmlFor="address" className="block font-medium text-gray-700">Address</label>
                        <input
                            id="address"
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            {...register("address", { required: "Address is required" })}
                        />
                    </div>

                    {/* User Active Status */}
                    <div className="col-span-2">
                        <label htmlFor="isActive" className="block font-medium text-gray-700">Is Active</label>
                        <input
                            id="isActive"
                            type="checkbox"
                            className="w-6 h-6"
                            {...register("isActive")}
                        />
                    </div>
                </div>

                <div className="col-span-2 text-center mt-6">
                    <button type="submit" className="bg-indigo-600 text-white p-3 rounded-md w-full sm:w-auto">
                        Update User
                    </button>
                </div>
            </form>
        </div>
    );
};
