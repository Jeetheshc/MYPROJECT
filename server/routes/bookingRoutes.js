import express from "express";


import { cancelBooking, createBooking, getAvailableCars, getBookingById, getBookings, getBookingsForUser, getCarBookings, newbooking } from "../controllers/bookingControllers.js";
import { carProviderAuth } from "../middlewares/providerAuth.js";
import { userAuth } from "../middlewares/userAuth.js";

const router = express.Router();

// Routes for booking management
router.post("/create",userAuth, newbooking); // Create a new booking
router.get("/", getBookings); // Get all bookings
router.get("/:id", getBookingById); // Get a booking by ID
router.patch("/:id", carProviderAuth, cancelBooking); // Cancel a booking (requires authentication)
router.post("/available-cars", getAvailableCars);
router.get("/:id/booking",getCarBookings)
router.get("/userbook/:userId",getBookingsForUser)



export { router as bookingRouter };
