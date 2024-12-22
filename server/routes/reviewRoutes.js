import express from "express";
import { addReview, getReviewsForCar, updateReview, deleteReview, createReview, addUserReview, getReviewForCar, reviewbycar } from "../controllers/reviewControllers.js";
import { userAuth } from "../middlewares/userAuth.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();

// Add a new review
router.post("/add", userAuth, createReview);

// Get all reviews for a specific car
router.get("/:carId", adminAuth, getReviewsForCar);
// Get all reviews for a specific car
router.get("user/:carId", userAuth, getReviewsForCar);
// Update a review
router.put("/:reviewId", userAuth, updateReview);

// Delete a review
router.delete("/:reviewId", userAuth, deleteReview);

// Route to fetch a review for a specific car by the user and booking
router.get("/get/:carId/:bookingId", userAuth, getReviewForCar);

// Route to add a review for a specific car
router.post("/addreview", userAuth, addReview);

router.get("/reviewbycar/:carId",reviewbycar)

export { router as reviewRouter };
