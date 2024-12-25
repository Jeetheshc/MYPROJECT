import React from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { FaArrowRight } from "react-icons/fa";
import { SkeletonLoader } from "../../components/admin/SkeletonLoader";

export const Userlist = () => {
  const [data, isLoading, error] = useFetch("admin/admin/userlist"); // Adjust the endpoint as needed
  const navigate = useNavigate();

  if (isLoading) {
    return <SkeletonLoader />; // Show skeleton loader while data is loading
  }

  if (error) {
    return <div className="text-red-600">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto flex flex-col min-h-screen justify-start items-center py-4">
      <h1 className="text-center text-3xl font-semibold mb-6">User List</h1>

      

      {/* Scrollable table */}
      <div className="w-full max-w-6xl overflow-y-auto h-[calc(100vh-200px)]">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left border-b">#</th>
              <th className="px-4 py-2 text-left border-b">Profile</th>
              <th className="px-4 py-2 text-left border-b">Name</th>
              <th className="px-4 py-2 text-left border-b">Email</th>
              <th className="px-4 py-2 text-left border-b">Phone</th>
              <th className="px-4 py-2 text-left border-b">Address</th>
              <th className="px-4 py-2 text-left border-b">Status</th>
              <th className="px-4 py-2 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((user, index) => (
              <tr key={user._id} className="odd:bg-white even:bg-gray-50">
                <td className="px-4 py-2 border-b">{index + 1}</td>
                <td className="px-4 py-2 border-b text-center">
                  <img
                    src={user.profilePic}
                    alt={user.name}
                    className="w-12 h-12 rounded-full mx-auto"
                  />
                </td>
                <td className="px-4 py-2 border-b">{user.name}</td>
                <td className="px-4 py-2 border-b">{user.email}</td>
                <td className="px-4 py-2 border-b">{user.phone}</td>
                <td className="px-4 py-2 border-b">{user.address}</td>
                <td className="px-4 py-2 border-b">
                  <span
                    className={`px-2 py-1 text-sm rounded ${
                      user.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-2 border-b">
                  {/* Arrow key icon for view details */}
                  <button
                    className="bg-blue-500 text-white p-2 rounded-full transition-colors hover:bg-blue-600"
                    onClick={() => navigate(`admin/admin/view-user/${user._id}`)}
                  >
                    <FaArrowRight className="text-lg" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
