import React from "react";

export const SkeletonLoader = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="bg-gray-200 rounded-md shadow-md mb-6 p-6 animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left border-b">#</th>
              <th className="px-4 py-2 text-left border-b"></th>
              <th className="px-4 py-2 text-left border-b"></th>
              <th className="px-4 py-2 text-left border-b"></th>
              <th className="px-4 py-2 text-left border-b"></th>
              <th className="px-4 py-2 text-left border-b"></th>
              <th className="px-4 py-2 text-left border-b"></th>
              <th className="px-4 py-2 text-left border-b"></th>
              <th className="px-4 py-2 text-left border-b"></th>
            </tr>
          </thead>
          <tbody>
            {/* Skeleton row */}
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <tr key={index} className="bg-gray-50">
                  <td className="px-4 py-2 border-b">
                    <div className="h-6 bg-gray-300 rounded w-12"></div>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="h-6 bg-gray-300 rounded w-24"></div>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="h-6 bg-gray-300 rounded w-24"></div>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="h-6 bg-gray-300 rounded w-24"></div>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="h-6 bg-gray-300 rounded w-20"></div>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="h-6 bg-gray-300 rounded w-12"></div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
