import React from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { FaArrowRight } from "react-icons/fa"; // Importing the arrow icon
import { SkeletonLoader } from "../../components/admin/SkeletonLoader";

export const Carlist = () => {
  const [data, isLoading, error] = useFetch("/car/cars"); // Adjust the endpoint as needed
  const navigate = useNavigate();

  if (isLoading) {
    return <SkeletonLoader />; // Show skeleton loader while data is loading
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Custom function to format the date as dd/mm/yyyy
  const formatDate = (date) => {
    const newDate = new Date(date);
    const day = newDate.getDate().toString().padStart(2, '0');
    const month = (newDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const year = newDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="container mx-auto flex flex-col min-h-screen justify-start items-center py-4">
      <h1 className="text-center text-3xl font-semibold mb-6">Car List</h1>

      {/* Center the "Add New Car" button */}
      <div className="flex justify-center mb-6">
        <button
          className="bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors hover:bg-blue-700"
          onClick={() => navigate("/admin/admin/addcars")}
        >
          Add New Car
        </button>
      </div>

      {/* Centered and scrollable table */}
      <div className="w-full max-w-6xl overflow-y-auto h-[calc(100vh-200px)]">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left border-b">#</th>
              <th className="px-4 py-2 text-left border-b">Car Brand</th>
              <th className="px-4 py-2 text-left border-b">Model</th>
              <th className="px-4 py-2 text-left border-b">Price/Day</th>
              <th className="px-4 py-2 text-left border-b">Year</th>
              <th className="px-4 py-2 text-left border-b">Added Date</th>
              <th className="px-4 py-2 text-left border-b">Location</th>
              <th className="px-4 py-2 text-left border-b">Availability</th>
              <th className="px-4 py-2 text-left border-b">Car Image</th>
              <th className="px-4 py-2 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((car, index) => (
              <tr key={car._id} className="odd:bg-white even:bg-gray-50">
                <td className="px-4 py-2 border-b">{index + 1}</td>
                <td className="px-4 py-2 border-b">{car.brand}</td>
                <td className="px-4 py-2 border-b">{car.model}</td>
                <td className="px-4 py-2 border-b">{car.pricePerDay}</td>
                <td className="px-4 py-2 border-b">{car.year}</td>
                <td className="px-4 py-2 border-b">{formatDate(car.createdAt)}</td>
                <td className="px-4 py-2 border-b">{car.location}</td>
                <td
                  className="px-4 py-2 border-b"
                  style={{ color: car.availability ? "green" : "red" }}
                >
                  {car.availability ? "Available" : "Not Available"}
                </td>
                <td className="px-4 py-2 border-b">
                  <img
                    src={car.carImages[0]}
                    alt={car.model}
                    className="w-24 h-16 object-cover"
                  />
                </td>
                <td className="px-4 py-2 border-b">
                  {/* Arrow key icon for view details */}
                  <button
                    className="bg-blue-500 text-white p-2 rounded-full transition-colors hover:bg-blue-600"
                    onClick={() => navigate(`/admin/admin/view-car/${car._id}`)}
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
