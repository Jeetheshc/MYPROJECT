import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../config/axiosInstance";

export const Signup = ({ role = "user" }) => {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    // Configure role-specific routes
    const user = {
        role: "user",
        signup_route: "/user/signup",
        profile_route: "/user/profile",
    };

    if (role === "provider") {
        user.role = "provider";
        user.signup_route = "/provider/signup";
        user.profile_route = "/provider/profile";
    }

    if (role === "admin") {
        user.role = "admin";
        user.signup_route = "/admin/signup";
        user.profile_route = "/admin/profile";
    }

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();

            // Append non-file fields
            Object.keys(data).forEach((key) => {
                if (key !== "profilePic") {
                    formData.append(key, data[key]);
                }
            });

            // Append the profile picture file
            if (data.profilePic && data.profilePic[0]) {
                formData.append("profilePic", data.profilePic[0]);
            }

            // API call for signup
            const response = await axiosInstance({
                method: "POST",
                url: user.signup_route,
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Signup successful!");
            navigate(user.profile_route);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Signup failed. Please try again.");
        }
    };

    return (
        <div className="hero bg-green-50 min-h-screen">
            <div className="absolute inset-0 bg-cover bg-center dark:bg-base-100 dark:text-base-content bg-no-repeat" style={{ backgroundImage: "url('https://images6.alphacoders.com/374/374742.jpg')" }}></div>
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold text-green-700 mb-4 transition-transform duration-300 hover:scale-105">
                        Sign Up Now!
                    </h1>
                </div>
                <div className="card bg-white shrink-0 shadow-lg border border-green-200">
                    <form className="card-body grid grid-cols-1 sm:grid-cols-2 gap-6" onSubmit={handleSubmit(onSubmit)}>
                        {/* Name Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-green-600 font-medium">Name</span>
                            </label>
                            <input
                                type="text"
                                {...register("name")}
                                placeholder="Enter your name"
                                className="input input-bordered border-green-300 focus:ring focus:ring-green-200 focus:border-green-500"
                                required
                            />
                        </div>

                        {/* Email Field with Email Format Validation */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-green-600 font-medium">Email</span>
                            </label>
                            <input
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Please enter a valid email",
                                    }
                                })}
                                placeholder="Enter your email"
                                className="input input-bordered border-green-300 focus:ring focus:ring-green-200 focus:border-green-500"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-green-600 font-medium">Password</span>
                            </label>
                            <input
                                type="password"
                                {...register("password")}
                                placeholder="Enter your password"
                                className="input input-bordered border-green-300 focus:ring focus:ring-green-200 focus:border-green-500"
                                required
                            />
                        </div>

                        {/* Phone Number Field with Validation (10 digits) */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-green-600 font-medium">Phone</span>
                            </label>
                            <input
                                type="text"
                                {...register("phone", {
                                    required: "Phone number is required",
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: "Please enter a valid 10-digit phone number",
                                    }
                                })}
                                placeholder="Enter your phone number"
                                maxLength={10}
                                className="input input-bordered border-green-300 focus:ring focus:ring-green-200 focus:border-green-500"
                                required
                            />
                        </div>

                        {/* Address Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-green-600 font-medium">Address</span>
                            </label>
                            <input
                                type="text"
                                {...register("address")}
                                placeholder="Enter your address"
                                className="input input-bordered border-green-300 focus:ring focus:ring-green-200 focus:border-green-500"
                                required
                            />
                        </div>

                        {/* Profile Picture Upload */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-green-600 font-medium">Profile Picture</span>
                            </label>
                            <input
                                type="file"
                                {...register("profilePic")}
                                className="file-input file-input-bordered file-input-green-500 w-full"
                                accept="image/*"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="form-control mt-6 col-span-2">
                            <button className="btn bg-green-600 hover:bg-green-700 text-white border-none transition-transform duration-300 hover:scale-105">
                                Sign Up
                            </button>
                        </div>

                        {/* Link to Login */}
                        <label className="label col-span-2">
                            <Link to="/login" className="label-text-alt link link-hover text-green-600">
                                Already have an account? Login here.
                            </Link>
                        </label>
                    </form>

                </div>
            </div>
        </div>
    );
};
