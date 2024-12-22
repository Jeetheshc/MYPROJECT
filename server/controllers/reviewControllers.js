
import Booking from "../models/bookingmodel.js";
import Car from "../models/carModel.js";
import Review from "../models/reviewmodel.js";

// Add a new review
export const addReview = async (req, res) => {
    try {
        const { carId, bookingId, rating, reviewText } = req.body; // Include bookingId
        const userId = req.user.id; // Get user ID from auth middleware
console.log(carId,userId,rating,reviewText);
        // Validate input
        if (!carId || !bookingId || !rating || !reviewText) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the car exists
        const carExists = await Car.findById(carId);
        if (!carExists) {
            return res.status(404).json({ message: "Car not found" });
        }

        // Check if a review already exists for the booking
        const existingReview = await Review.findOne({ carId, bookingId, userId });
        if (existingReview) {
            return res.status(400).json({ message: "Review already exists for this booking." });
        }

        // Create and save the review
        const review = new Review({
            userId,
            carId,
            bookingId, // Include bookingId
            rating,
            reviewText,
        });

        await review.save();

        // Respond with success
        res.status(201).json({ message: "Review added successfully", data: review });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

// Get all reviews for a specific car
export const getReviewsForCar = async (req, res) => {
    try {
        const { carId } = req.params; // Car ID from the URL params

        // Fetch all reviews for the specific car
        const reviews = await Review.find({ carId })
            .populate("userId", "name profilePic") // Optionally populate user details
            .select("rating reviewText createdAt");

            if (!reviews || reviews.length === 0) {
                return res.status(200).json({ message: "No reviews found for this car.", data: [] });
            }

        res.status(200).json({ data: reviews });
    } catch (error) {
        res.status(500).json({ message: "Server error, please try again later." });
    }
};

// Update a review
export const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;

        const review = await Review.findOne({ _id: reviewId, userId });
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;
        await review.save();

        res.json({ message: "Review updated successfully", data: review });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

// Delete a review
export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;

        const review = await Review.findOneAndDelete({ _id: reviewId, userId });
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

export const createReview = async (req, res) => {
    try {
        const { carId, bookingId, rating, reviewText } = req.body; // Include bookingId
        const userId = req.user.id; // Get user ID from auth middleware

        // Validate input
        if (!carId || !bookingId || !rating || !reviewText) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the car exists
        const carExists = await Car.findById(carId);
        if (!carExists) {
            return res.status(404).json({ message: "Car not found" });
        }

        // Check if a review already exists for the booking
        const existingReview = await Review.findOne({ carId, bookingId, userId });
        if (existingReview) {
            return res.status(400).json({ message: "Review already exists for this booking." });
        }

        // Create and save the review
        const review = new Review({
            userId,
            carId,
            bookingId, // Include bookingId
            rating,
            reviewText,
        });

        await review.save();

        // Respond with success
        res.status(201).json({ message: "Review added successfully", data: review });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

export const addUserReview = async (req, res) => {
    try {
      const { carId, rating, reviewText } = req.body; // Get the data from the request body
      const userId = req.user.id; // The user's ID should be provided from the auth middleware
  
      // Validate input
      if (!carId || !rating || !reviewText) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Check if the car exists
      const carExists = await Car.findById(carId);
      if (!carExists) {
        return res.status(404).json({ message: "Car not found" });
      }
  
      // Create the review document
      const review = new Review({
        userId,
        carId,
        rating,
        reviewText,
      });
  
      // Save the review to the database
      await review.save();
  
      // Respond with a success message
      res.status(201).json({ message: "Review added successfully", data: review });
    } catch (error) {
      // Catch any errors and send a 500 response
      res.status(500).json({ message: error.message || "Internal Server Error" });
    }
  };
  
  // Controller to fetch review for a car
  export const getReviewForCar = async (req, res) => {
    try {
        const { carId, bookingId } = req.params;
        const userId = req.user.id; // From authentication middleware
    
        const review = await Review.findOne({ carId, userId, bookingId });
    
        if (!review) {
          return res.status(404).json({ message: "Review not found" });
        }
    
        res.status(200).json({ message: "Review found", data: review });
      } catch (error) {
        res.status(500).json({ message: error.message || "Internal Server Error" });
      }
    };
  export const reviewbycar = async (req, res) => {
    try {
    const { carId } = req.params;
    console.log(carId);
    const reviews = await Review.find({ carId }) 
    .populate('carId')  // Populate car details
      .populate('userId');// Populate userId to include user name
    if (!reviews.length) {
      return res.status(404).json({ message: "No reviews found for this car." });
    }
    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews." });
  }
};