import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    rating: { type: Number, required: true },
    reviewText: { type: String, required: true }, // Ensure this matches
    createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
