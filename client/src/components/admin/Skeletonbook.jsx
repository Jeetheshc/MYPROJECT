import React from 'react';

export const Skeletonbook = () => {
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Skeleton Card */}
      <div className="flex items-center space-x-4 p-4 bg-gray-200 animate-pulse rounded-xl shadow-md">
        <div className="w-20 h-20 bg-gray-300 rounded-lg"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>
      </div>

      {/* Another Skeleton Card */}
      <div className="flex items-center space-x-4 p-4 bg-gray-200 animate-pulse rounded-xl shadow-md">
        <div className="w-20 h-20 bg-gray-300 rounded-lg"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>
      </div>

      {/* Another Skeleton Card */}
      <div className="flex items-center space-x-4 p-4 bg-gray-200 animate-pulse rounded-xl shadow-md">
        <div className="w-20 h-20 bg-gray-300 rounded-lg"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};