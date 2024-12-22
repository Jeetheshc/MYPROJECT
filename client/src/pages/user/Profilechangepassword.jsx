import React, { useState } from "react";
import { axiosInstance } from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";

export const Profilechangepassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.put("/user/reset-password", {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      setSuccess(response.data.message);
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });

      setTimeout(() => {
        navigate("/user/profile");
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      setError(error.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen dark:bg-base-100 dark:text-base-content bg-blue-100 text-blue-900 flex items-center justify-center py-10">
      <div className="p-10 w-full max-w-md dark:bg-base-100 dark:text-base-content bg-white shadow-lg border border-blue-200 rounded-lg">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">
          Change Password
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 text-sm p-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Old Password
            </label>
            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white font-semibold rounded-md ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/user/profile")}
            className="text-blue-500 hover:underline"
          >
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
};
