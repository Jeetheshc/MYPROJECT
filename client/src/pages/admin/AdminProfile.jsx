import React from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch"; // Import your custom hook
import toast from "react-hot-toast"; 

export const AdminProfile = () => {
    const navigate = useNavigate();

    // Use the useFetch hook to get the admin profile data
    const [admin, isLoading, error] = useFetch(`admin/profile/${id}`); // Make sure to adjust the API endpoint accordingly

    // Handle error or no data case
    if (error) {
        toast.error(error.message || "Failed to fetch admin profile");
    }

    // Handle redirection if no admin data is found
    if (!isLoading && !admin) {
        navigate("admin/login"); // Redirect to login if no profile is found
        return null;
    }

    return (
        <div className="container mx-auto p-6">
            {isLoading ? (
                <div>Loading...</div> // Show loading text or spinner while fetching data
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-semibold text-center text-indigo-700 mb-6">Admin Profile</h1>

                    {/* Profile Picture */}
                    <div className="text-center mb-6">
                        <img
                            src={admin.profilePic || "https://via.placeholder.com/150"}
                            alt="Admin Profile"
                            className="w-32 h-32 rounded-full mx-auto"
                        />
                    </div>

                    {/* Profile Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="font-medium text-gray-700">Name</label>
                            <div>{admin.name}</div>
                        </div>

                        <div>
                            <label className="font-medium text-gray-700">Email</label>
                            <div>{admin.email}</div>
                        </div>

                        <div>
                            <label className="font-medium text-gray-700">Phone</label>
                            <div>{admin.phone}</div>
                        </div>

                        <div>
                            <label className="font-medium text-gray-700">Account Status</label>
                            <div>{admin.isActive ? "Active" : "Inactive"}</div>
                        </div>

                        <div>
                            <label className="font-medium text-gray-700">Created At</label>
                            <div>{new Date(admin.createdAt).toLocaleDateString()}</div>
                        </div>

                        <div>
                            <label className="font-medium text-gray-700">Updated At</label>
                            <div>{new Date(admin.updatedAt).toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div className="text-center mt-6">
                        <button
                            onClick={() => navigate("/admin/edit-profile")} // Navigate to edit profile page
                            className="bg-indigo-600 text-white p-3 rounded-md w-full sm:w-auto"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
