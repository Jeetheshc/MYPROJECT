import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { axiosInstance } from '../../config/axiosInstance';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const ProfileChangePhoto = () => {
  const [profile, isLoading, error] = useFetch('/user/profile'); // Fetch current profile details
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const navigate = useNavigate();

  // Handle File Selection and Preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file)); // Set preview image URL
    }
  };

  // Handle Profile Photo Upload
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setUploadError('Please select a new profile photo to upload.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('profilePic', selectedFile); // Append the file to FormData

      await axiosInstance.put('/user/change-profile-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success("Profile photo updated successfully!");
      navigate('/user/profile');
    } catch (err) {
      console.error(err);
      setUploadError(err.response?.data?.message || 'Failed to update profile photo');
    } finally {
      setUploading(false);
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
    <div className="min-h-screen dark:bg-base-100 dark:text-base-content bg-blue-50 flex items-center justify-center">
      <div className="card w-full max-w-md p-6 dark:bg-base-100 dark:text-base-content bg-white shadow-lg rounded-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Change Profile Photo</h2>

        {/* Current Profile Photo */}
        <div className="flex justify-center mb-4">
          <img
            src={previewImage || profile?.profilePic || 'https://via.placeholder.com/150/000000/FFFFFF/?text=Profile'}
            alt="Current Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
          />
        </div>

        {/* Form to Upload New Photo */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="profilePic" className="font-medium text-blue-600">
              Select a New Profile Photo
            </label>
            <input
              type="file"
              id="profilePic"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2 border p-2 rounded"
            />
          </div>

          {/* Upload Error Message */}
          {uploadError && <p className="text-red-600 text-sm">{uploadError}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full btn btn-primary"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Update Photo'}
          </button>
        </form>
      </div>
    </div>
  );
};
