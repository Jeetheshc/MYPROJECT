import React, { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { axiosInstance } from '../../config/axiosInstance';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const ProfileChangeDetails = () => {
  const [profile, isLoading, error] = useFetch('/user/profile'); // Fetch current profile details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  // Populate form with current profile data
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setAddress(profile.address);
      setPhone(profile.phone);
    }
  }, [profile]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setErrorMessage('');

    try {
      const updatedData = { name, email, address, phone };
      const response = await axiosInstance.put('/user/profile-update', updatedData);

      toast.success("Profile updated successfully!");
      navigate('/user/profile'); // Redirect to the profile page
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-blue-600 font-bold">Loading current profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 font-bold">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-base-100 dark:text-base-content bg-blue-50 flex items-center justify-center py-10">
      <div className="card w-full max-w-md dark:bg-base-100 dark:text-base-content bg-white shadow-lg p-6 rounded-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Update Profile</h2>

        {/* Error message */}
        {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}

        {/* Profile Update Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="font-medium text-blue-600">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="font-medium text-blue-600">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="address" className="font-medium text-blue-600">Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="phone" className="font-medium text-blue-600">Phone</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full btn btn-primary"
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};
