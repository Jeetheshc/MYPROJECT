import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../config/axiosInstance";

export const Login = ({ role = "user" }) => {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const user = {
        role: "user",
        login_api: "/user/login",
        profile_route: "/user/profile",
        signup_route: "/signup",
    };

    

    if (role === "admin") {
        user.role = "admin";
        (user.login_api = "/admin/login"), (user.profile_route = "/admin"), (user.signup_route = "/admin/signup");
    }


    const onSubmit = async (data) => {
        try {
            console.log(data, '====data');

            const response = await axiosInstance({ method: "POST", url: user.login_api, data });
            console.log(response, "====response");
            toast.success("Log-in success");
            navigate(user.profile_route);
        } catch (error) {
            toast.error("Log-in failed");
            console.log(error);
        }
    };

    return (
        <div className="hero bg-blue-50 dark:bg-base-100 dark:text-base-content min-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">
                {/* Text Section */}
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold text-blue-700 mb-4 transition-transform duration-300 hover:scale-105">
                        Login now! {role}
                    </h1>
                </div>

                {/* Login Card */}
                <div className="card bg-white w-full max-w-sm shrink-0 shadow-lg border dark:bg-base-100 dark:text-base-content border-blue-200">
                    <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
                        {/* Email Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-blue-600 font-medium">Email</span>
                            </label>
                            <input
                                type="email"
                                {...register("email")}
                                placeholder="Enter your email"
                                className="input input-bordered border-blue-300 focus:ring focus:ring-blue-200 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-blue-600 font-medium">Password</span>
                            </label>
                            <input
                                type="password"
                                {...register("password")}
                                placeholder="Enter your password"
                                className="input input-bordered border-blue-300 focus:ring focus:ring-blue-200 focus:border-blue-500"
                                required
                            />
                            <label className="label">
                                <Link
                                    to={user.signup_route}
                                    className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                                >
                                    New User? CLick to Register
                                </Link>
                                
                            </label>
                           
                            <label className="label">
                                <Link
                                    to={"/admin/login"}
                                    className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                                >
                                    Login as Admin
                                </Link>
                                
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="form-control mt-6">
                            <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-none transition-transform duration-300 hover:scale-105">
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
};