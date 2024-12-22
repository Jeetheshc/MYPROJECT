import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance"; // Use your custom Axios instance
import { useNavigate } from "react-router-dom";

export const Carreviews = () => {
    const { id } = useParams(); // Get car ID from the URL
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axiosInstance.get(`/review/reviewbycar/${id}`); // Fetch reviews for a specific car
                setReviews(response.data.reviews);
                setIsLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load reviews.");
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, [id]);

    const handleAddReview = () => {
        navigate(`/user/reviewentry/${id}`); // Navigate to the review entry page
    };

    if (isLoading) return <p>Loading reviews...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-semibold mb-4">Reviews for Car</h1>
            {reviews.length === 0 ? (
                <div className="text-center">
                    <p className="bg-blue-100 text-blue-800 px-6 py-4 rounded-lg text-center font-medium shadow-md">
                        No reviews available for this car yet.
                    </p>

                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div
                            key={review._id}
                            className="bg-white shadow-md rounded-lg p-4 border border-gray-300"
                        >
                            <h2 className="text-lg font-semibold text-gray-700">
                                {review.userId?.name || "Anonymous"}
                            </h2>
                            <p className="text-gray-600">{review.reviewText}</p>
                            <div className="text-yellow-500">
                                {Array(review.rating)
                                    .fill("★")
                                    .join("")}
                                {Array(5 - review.rating)
                                    .fill("☆")
                                    .join("")}
                            </div>
                            <p className="text-sm text-gray-500">
                                Reviewed on: {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}

                </div>
            )}
        </div>
    );
};
