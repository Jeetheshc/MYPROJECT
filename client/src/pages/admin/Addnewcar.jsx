import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const Addnewcar = () => {
    const [carImagePreview, setCarImagePreview] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
      try {
          const formData = new FormData();
  
          // Append the form fields to the formData
          formData.append("brand", data.brand);
          formData.append("model", data.model);
          formData.append("year", data.year);
          formData.append("pricePerDay", data.pricePerDay);
          formData.append("carType", data.carType);
          formData.append("features", data.features);
          formData.append("location", data.location);
          formData.append("carNumber", data.carNumber);
          formData.append("ownerDetails.name", data.ownerDetails.name);
          formData.append("ownerDetails.mobileNumber", data.ownerDetails.mobileNumber);
          formData.append("ownerDetails.email", data.ownerDetails.email);
          formData.append("ownerDetails.address", data.ownerDetails.address);
          formData.append("ownerDetails.aadharNumber", data.ownerDetails.aadharNumber);
  
          // Append car images if available
          if (data.carImages && data.carImages[0]) {
              formData.append("carImages", data.carImages[0]);
          }
          console.log("Form Data (Before Sending):");
          formData.forEach((value, key) => {
              console.log(key, value);
          });
          // Make the API call to submit the form data
          const response = await axiosInstance({
              method: "POST",
              url: "/car/add",
              data: formData,
              headers: {
                  "Content-Type": "multipart/form-data",
              },
          });
  
          toast.success("Car added successfully!");
          navigate("/admin/");
      } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.message || "Failed to add car. Please try again.");
      }
  };
  

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCarImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="hero bg-gray-50 min-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold text-green-700 mb-4 transition-transform duration-300 hover:scale-105">
                        Add New Car
                    </h1>
                </div>
                <div className="card bg-white w-full max-w-sm shrink-0 shadow-lg border border-green-200">
                    <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
                        {/* Car Brand */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-green-600 font-medium">Car Brand</span>
                            </label>
                            <input
                                type="text"
                                {...register("brand", { required: "Car brand is required" })}
                                placeholder="Enter car brand"
                                className="input input-bordered border-green-300 focus:ring focus:ring-green-200 focus:border-green-500"
                            />
                            {errors.brand && <span className="text-red-500 text-sm">{errors.brand.message}</span>}
                        </div>

                        {/* Car Model */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-green-600 font-medium">Car Model</span>
                            </label>
                            <input
                                type="text"
                                {...register("model", { required: "Car model is required" })}
                                placeholder="Enter car model"
                                className="input input-bordered border-green-300 focus:ring focus:ring-green-200 focus:border-green-500"
                            />
                            {errors.model && <span className="text-red-500 text-sm">{errors.model.message}</span>}
                        </div>

                        {/* Car Year */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-green-600 font-medium">Car Year</span>
                            </label>
                            <input
                                type="number"
                                {...register("year", { required: "Car year is required" })}
                                placeholder="Enter car year"
                                className="input input-bordered border-green-300 focus:ring focus:ring-green-200 focus:border-green-500"
                            />
                            {errors.year && <span className="text-red-500 text-sm">{errors.year.message}</span>}
                        </div>

                        {/* Price per Day */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-green-600 font-medium">Price per Day</span>
                            </label>
                            <input
                                type="number"
                                {...register("pricePerDay", { required: "Price per day is required" })}
                                placeholder="Enter price per day"
                                className="input input-bordered border-green-300 focus:ring focus:ring-green-200 focus:border-green-500"
                            />
                            {errors.pricePerDay && <span className="text-red-500 text-sm">{errors.pricePerDay.message}</span>}
                        </div>

                        {/* Car Type */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-green-600 font-medium">Car Type</span>
                            </label>
                            <input
                                type="text"
                                {...register("carType", { required: "Car type is required" })}
                                placeholder="Enter car type"
                                className="input input-bordered border-green-300 focus:ring focus:ring-green-200 focus:border-green-500"
                            />
                            {errors.carType && <span className="text-red-500 text-sm">{errors.carType.message}</span>}
                        </div>

                        {/* Features */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-green-600 font-medium">Features</span>
                            </label>
                            <input
                                type="text"
                                {...register("features", { required: "Car features are required" })}
                                placeholder="Enter car features (comma-separated)"
                                className="input input-bordered border-green-300 focus:ring focus:ring-green-200 focus:border-green-500"
                            />
                            {errors.features && <span className="text-red-500 text-sm">{errors.features.message}</span>}
                        </div>

                        {/* Car Location */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-green-600 font-medium">Car Location</span>
                            </label>
                            <input
                                type="text"
                                {...register("location", { required: "Car location is required" })}
                                placeholder="Enter car location"
                                className="input input-bordered border-green-300 focus:ring focus:ring-green-200 focus:border-green-500"
                            />
                            {errors.location && <span className="text-red-500 text-sm">{errors.location.message}</span>}
                        </div>

                        {/* Car Number */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-green-600 font-medium">Car Number</span>
                            </label>
                            <input
                                type="text"
                                {...register("carNumber", { required: "Car number is required" })}
                                placeholder="Enter car number"
                                className="input input-bordered border-green-300 focus:ring focus:ring-green-200 focus:border-green-500"
                            />
                            {errors.carNumber && <span className="text-red-500 text-sm">{errors.carNumber.message}</span>}
                        </div>

                        {/* Owner Name */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-green-600 font-medium">Owner Name</span>
                            </label>
                            <input
                                type="text"
                                {...register("ownerDetails.name", { required: "Owner's name is required" })}
                                placeholder="Enter owner's name"
                                className="input input-bordered border-green-300 focus:ring focus:ring-green-200 focus:border-green-500"
                            />
                            {errors.ownerDetails?.name && <span className="text-red-500 text-sm">{errors.ownerDetails?.name.message}</span>}
                        </div>

                        {/* Owner Mobile */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-green-600 font-medium">Owner Mobile</span>
                            </label>
                            <input
                                type="text"
                                {...register("ownerDetails.mobileNumber", { required: "Owner's mobile is required" })}
                                placeholder="Enter owner's mobile number"
                                className="input input-bordered border-green-300 focus:ring focus:ring-green-200 focus:border-green-500"
                            />
                            {errors.ownerDetails?.mobileNumber && <span className="text-red-500 text-sm">{errors.ownerDetails?.mobileNumber.message}</span>}
                        </div>

                        {/* Owner Email */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-green-600 font-medium">Owner Email</span>
                            </label>
                            <input
                                type="email"
                                {...register("ownerDetails.email", { required: "Owner's email is required" })}
                                placeholder="Enter owner's email"
                                className="input input-bordered border-green-300 focus:ring focus:ring-green-200 focus:border-green-500"
                            />
                            {errors.ownerDetails?.email && <span className="text-red-500 text-sm">{errors.ownerDetails?.email.message}</span>}
                        </div>

                        {/* Owner Address */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-green-600 font-medium">Owner Address</span>
                            </label>
                            <input
                                type="text"
                                {...register("ownerDetails.address", { required: "Owner's address is required" })}
                                placeholder="Enter owner's address"
                                className="input input-bordered border-green-300 focus:ring focus:ring-green-200 focus:border-green-500"
                            />
                            {errors.ownerDetails?.address && <span className="text-red-500 text-sm">{errors.ownerDetails?.address.message}</span>}
                        </div>

                        {/* Owner Aadhar Number */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-green-600 font-medium">Owner Aadhar Number</span>
                            </label>
                            <input
                                type="text"
                                {...register("ownerDetails.aadharNumber", { required: "Owner's Aadhar number is required" })}
                                placeholder="Enter owner's Aadhar number"
                                className="input input-bordered border-green-300 focus:ring focus:ring-green-200 focus:border-green-500"
                            />
                            {errors.ownerDetails?.aadharNumber && <span className="text-red-500 text-sm">{errors.ownerDetails?.aadharNumber.message}</span>}
                        </div>

                        {/* Car Image Upload */}
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

                        <div className="form-control mt-6">
                            <button className="btn bg-green-600 hover:bg-green-700 text-white border-none transition-transform duration-300 hover:scale-105">
                                Add Car
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
