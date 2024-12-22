import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";

export const Reviewentryform = () => {
  const { bookingId, carId } = useParams(); // Get bookingId and carId from URL
  const navigate = useNavigate();
  const [reviewExists, setReviewExists] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axiosInstance.get(`review/get/${carId}/${bookingId}`);
        if (response.data.data) {
          setReviewExists(true);
          setRating(response.data.data.rating);
          setReviewText(response.data.data.reviewText);
        }
      } catch (err) {
        setReviewExists(false); // If no review exists, allow form entry
      }
    };

    fetchReview();
  }, [carId, bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || reviewText.trim() === "") {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axiosInstance.post("review/addreview", {
        carId,
        bookingId,
        rating,
        reviewText,
      });
      toast.success("Review added successfully!");
      navigate(`/user/Carbookinglists`); // Redirect to bookings or the relevant page
    } catch (error) {
      setError(error.response?.data?.message || "Error submitting review.");
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Your Review</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {reviewExists ? (
        <div>
          <h3 className="text-xl font-semibold">Your Review</h3>
          <p><strong>Rating: </strong>{rating} / 5</p>
          <p><strong>Review: </strong>{reviewText}</p>
          <button
            onClick={() => navigate("/user/Carbookinglists")}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4"
          >
            Go Back to Bookings
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Rating</label>
            <div className="flex space-x-2 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={`text-2xl ${star <= rating ? "text-yellow-500" : "text-gray-400"}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Review</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="mt-2 p-2 w-full border rounded-lg"
              rows="4"
            ></textarea>
          </div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg">
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
};
