import React, { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { axiosInstance } from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const [profile, isLoading, error] = useFetch("/user/profile");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="text-xl font-bold text-blue-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-xl font-bold text-red-600">
          {error.message || "Error loading profile"}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="text-xl font-bold text-gray-600">
          No profile data available
        </div>
      </div>
    );
  }

  // Function to handle deactivating the account
  const handleDeactivateAccount = async () => {
    try {
      await axiosInstance.delete("/user/delete-account"); // Call the API to deactivate the account
      navigate("/"); // Redirect to the homepage after successful deactivation
    } catch (error) {
      console.error("Error during account deactivation", error);
    }
  };

  // Open the confirmation modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close the confirmation modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const userLogout = async () => {
    try {
      const response = await axiosInstance({
        method: "PUT",
        url: "/user/Logout",
      });
      navigate("/");
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 dark:bg-base-100 dark:text-base-content text-blue-900 flex items-center justify-center py-10">
      {/* Profile Card */}
      <div className="p-10 w-full max-w-md bg-white shadow-lg border dark:bg-base-100 dark:text-base-content border-blue-200 rounded-lg">
        {/* Profile Picture */}
        <div className="flex justify-center mt-6">
          <img
            src={profile.profilePic}
            alt="Profile Pic"
            className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-md"
          />
        </div>

        {/* Profile Details */}
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">
            {profile.name.toUpperCase()}
          </h2>
          <p className="text-gray-600 mb-4">
            {profile.address.charAt(0).toUpperCase() +
              profile.address.slice(1).toLowerCase()}
          </p>

          <div className="space-y-3 text-left">
            <div className="flex items-center">
              <span className="font-medium text-blue-600 w-1/3">Email:</span>
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-blue-600 w-1/3">Phone:</span>
              <span>{profile.phone}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-blue-600 w-1/3">Address:</span>
              <span>
                {profile.address.charAt(0).toUpperCase() +
                  profile.address.slice(1).toLowerCase()}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-blue-600 w-1/3">Status:</span>
              <span
                className={`text-sm px-2 py-1 rounded ${
                  profile.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {profile.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-blue-600 w-1/3">Created:</span>
              <span>
                {new Date(profile.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-blue-600 w-1/3">Updated:</span>
              <span>
                {new Date(profile.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col space-y-3 mt-4">
          <button
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md"
            onClick={() => navigate("/user/profileChangePassword")}
          >
            Change Password
          </button>
          <button
            className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md"
            onClick={() => navigate("/user/change-profile-photo")}
          >
            Change Profile Photo
          </button>
          <button
            className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md"
            onClick={() => navigate("/user/change-details")}
          >
            Change Details
          </button>
          <button
            className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md"
            onClick={userLogout}
          >
            Logout
          </button>
          <button
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md"
            onClick={openModal} // Trigger modal for deactivation
          >
            Deactivate Account
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold">
              Are you sure you want to deactivate your account?
            </h2>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-400 text-white py-2 px-4 rounded-lg mr-2"
                onClick={closeModal} // Close the modal
              >
                No
              </button>
              <button
                className="bg-red-600 text-white py-2 px-4 rounded-lg"
                onClick={() => {
                  handleDeactivateAccount();
                  closeModal(); // Close the modal after deactivating
                }}
              >
                Yes, Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
