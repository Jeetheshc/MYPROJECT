import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance"; // Assuming axiosInstance is configured

export const CarReviewPage = () => {
    const { id } = useParams(); // Car ID
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch reviews for the car
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axiosInstance.get(`/review/${id}`);
                setReviews(response.data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, [id]);

    if (isLoading) {
        return <div>Loading...</div>;  // Show a loading message while fetching data
    }

    if (error) {
        return <div className="text-red-600">Error: {error}</div>;  // Show error message if any
    }

    if (reviews.length === 0) {
        return <div>No reviews available for this car.</div>;  // Handle empty reviews list
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-semibold text-center text-indigo-700 mb-6">
                Reviews for this Car
            </h1>
            <div className="grid grid-cols-1 gap-4">
                {reviews.map((review) => (
                    <div
                        key={review._id}
                        className="bg-white p-6 rounded-lg shadow-md mb-4"
                    >
                        <div className="flex justify-between">
                            <p className="font-semibold">{review.userId.name}</p>
                            <p className="text-yellow-500">Rating: {review.rating} ⭐</p>
                        </div>
                        <p className="text-gray-700 mt-2">{review.reviewText}</p>
                        <p className="text-gray-500 text-sm mt-2">
                            Posted on: {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
