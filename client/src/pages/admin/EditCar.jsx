import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFetch } from "../../hooks/useFetch"; // Custom hook for fetching data
import { SkeletonLoader } from "../../components/admin/SkeletonLoader";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form"; // Import useForm from react-hook-form
import { axiosInstance } from "../../config/axiosInstance";

export const EditCar = () => {
    const { id } = useParams(); // Get the car ID from the URL
    const [car, setCar] = useState(null);
    const [carImagePreview, setCarImagePreview] = useState(null);
    const navigate = useNavigate();

    // Fetch the current car data
    const [data, isLoadingData, errorData] = useFetch(`/car/${id}`);

    useEffect(() => {
        if (data) {
            setCar(data); // Set car data from the fetched response
            setCarImagePreview(data.carImages[0]); // Set image preview if available
        }
    }, [data]);

    // react-hook-form setup
    const { register, handleSubmit, setValue } = useForm(); // Initialize useForm

    useEffect(() => {
        if (car) {
            // Set default values for the form fields
            setValue("brand", car.brand);
            setValue("model", car.model);
            setValue("year", car.year);
            setValue("pricePerDay", car.pricePerDay);
            setValue("availability", car.availability);
            setValue("carType", car.carType);
            setValue("features", car.features.join(", ")); // Assuming features are an array
            setValue("location", car.location);
            setValue("carNumber", car.carNumber);
            setValue("ownerName", car.ownerDetails.name);
            setValue("ownerMobileNumber", car.ownerDetails.mobileNumber);
            setValue("ownerEmail", car.ownerDetails.email);
            setValue("ownerAddress", car.ownerDetails.address);
            setValue("ownerAadharNumber", car.ownerDetails.aadharNumber);
        }
    }, [car, setValue]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCarImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        try {
            const updatedFormData = new FormData();
    
            // Append the form fields to the formData
            updatedFormData.append("brand", data.brand);
            updatedFormData.append("model", data.model);
            updatedFormData.append("year", data.year);
            updatedFormData.append("pricePerDay", data.pricePerDay);
            updatedFormData.append("availability", data.availability);
            updatedFormData.append("carType", data.carType);
            updatedFormData.append("features", data.features);
            updatedFormData.append("location", data.location);
            updatedFormData.append("carNumber", data.carNumber);
    
            // Append ownerDetails as an object
            updatedFormData.append("ownerDetails", JSON.stringify({
                name: data.ownerName,
                mobileNumber: data.ownerMobileNumber,
                email: data.ownerEmail,
                address: data.ownerAddress,
                aadharNumber: data.ownerAadharNumber,
            }));
    
            if (data.carImages && data.carImages[0]) {
                updatedFormData.append("carImages", data.carImages[0]);
            }
            console.log("Form Data (Before Sending):");
            updatedFormData.forEach((value, key) => {
                console.log(key, value);
            });
            // Make the API call to update the car data using axiosInstance
            const response = await axiosInstance({
                method: "PUT",
                url: `/car/edit/${id}`, // Use the car id to edit the specific car
                data: updatedFormData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
    console.log("img=",updatedFormData);
            toast.success("Car updated successfully!");
            navigate(`/admin/admin/view-car/${car._id}`);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update car. Please try again.");
        }
    };
    


    if (isLoadingData) {
        return <SkeletonLoader />;
    }

    if (errorData) {
        return <div className="text-red-600">Error: {errorData.message}</div>;
    }

    if (!car) {
        return <div className="text-red-600">No car data available.</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-semibold text-center text-indigo-700 mb-6">Edit Car</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Car Brand */}
                    <div>
                        <label htmlFor="brand" className="block font-medium text-gray-700">Car Brand</label>
                        <input
                            id="brand"
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            {...register("brand", { required: "Car brand is required" })}
                        />
                    </div>

                    {/* Car Model */}
                    <div>
                        <label htmlFor="model" className="block font-medium text-gray-700">Car Model</label>
                        <input
                            id="model"
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            {...register("model", { required: "Car model is required" })}
                        />
                    </div>

                    {/* Car Year */}
                    <div>
                        <label htmlFor="year" className="block font-medium text-gray-700">Car Year</label>
                        <input
                            id="year"
                            type="number"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            {...register("year", { required: "Car year is required" })}
                        />
                    </div>

                    {/* Price Per Day */}
                    <div>
                        <label htmlFor="pricePerDay" className="block font-medium text-gray-700">Price Per Day</label>
                        <input
                            id="pricePerDay"
                            type="number"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            {...register("pricePerDay", { required: "Price per day is required" })}
                        />
                    </div>

                    {/* Availability */}
                    <div className="flex items-center space-x-2">
                        <label htmlFor="availability" className="block text-gray-700 font-medium text-lg">Availability</label>
                        <input
                            id="availability"
                            type="checkbox"
                            className="w-6 h-6 border-2 border-gray-400 rounded-lg cursor-pointer transition-transform transform scale-125 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            {...register("availability")}
                        />
                    </div>

                    {/* Car Type */}
                    <div>
                        <label htmlFor="carType" className="block font-medium text-gray-700">Car Type</label>
                        <input
                            id="carType"
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            {...register("carType", { required: "Car type is required" })}
                        />
                    </div>

                    {/* Features */}
                    <div>
                        <label htmlFor="features" className="block font-medium text-gray-700">Features</label>
                        <input
                            id="features"
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            {...register("features", { required: "Car features are required" })}
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label htmlFor="location" className="block font-medium text-gray-700">Location</label>
                        <input
                            id="location"
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            {...register("location", { required: "Location is required" })}
                        />
                    </div>

                    {/* Car Number */}
                    <div>
                        <label htmlFor="carNumber" className="block font-medium text-gray-700">Car Number</label>
                        <input
                            id="carNumber"
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            {...register("carNumber", { required: "Car number is required" })}
                        />
                    </div>

                    {/* Owner Details */}
                    <div>
                        <label htmlFor="ownerName" className="block font-medium text-gray-700">Owner Name</label>
                        <input
                            id="ownerName"
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            {...register("ownerName", { required: "Owner name is required" })}
                        />
                    </div>

                    <div>
                        <label htmlFor="ownerMobileNumber" className="block font-medium text-gray-700">Owner Mobile Number</label>
                        <input
                            id="ownerMobileNumber"
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            {...register("ownerMobileNumber", { required: "Owner mobile number is required" })}
                        />
                    </div>

                    <div>
                        <label htmlFor="ownerEmail" className="block font-medium text-gray-700">Owner Email</label>
                        <input
                            id="ownerEmail"
                            type="email"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            {...register("ownerEmail", { required: "Owner email is required" })}
                        />
                    </div>

                    <div>
                        <label htmlFor="ownerAddress" className="block font-medium text-gray-700">Owner Address</label>
                        <input
                            id="ownerAddress"
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            {...register("ownerAddress", { required: "Owner address is required" })}
                        />
                    </div>

                    <div>
                        <label htmlFor="ownerAadharNumber" className="block font-medium text-gray-700">Owner Aadhar Number</label>
                        <input
                            id="ownerAadharNumber"
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            {...register("ownerAadharNumber", { required: "Owner Aadhar number is required" })}
                        />
                    </div>

                    
                    <div className="form-control">
                            <label className="label">
                                <span className="label-text text-green-600 font-medium">Car Image</span>
                            </label>
                            <input
                                type="file"
                                {...register("carImages")}
                                className="file-input file-input-bordered file-input-green-500 w-full"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>

                    {/* Image Preview */}
                    {carImagePreview && (
                        <div className="form-control mt-4">
                            <label className="label">
                                <span className="label-text text-green-600 font-medium">Image Preview</span>
                            </label>
                            <img
                                src={carImagePreview}
                                alt="Car Preview"
                                className="w-full h-auto rounded-lg border border-green-300"
                            />
                        </div>
                    )}
                </div>

                <div className="col-span-2 text-center mt-6">
                    <button type="submit" className="bg-indigo-600 text-white p-3 rounded-md w-full sm:w-auto">
                        Update Car
                    </button>
                </div>
            </form>
        </div>
    );
};
