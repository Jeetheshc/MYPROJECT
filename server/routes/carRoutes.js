import express from "express";
import { addNewCar, deactivateCar, editCarDetails, getAllCar, getCarLocations, showCarDetails, updateCarPhotos } from "../controllers/carControllers.js";
import { upload } from "../middlewares/multer.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { getBookingDetails } from "../controllers/userControllers.js";

const router = express.Router();

// Add a new car
router.post("/add", upload.single("carImages"), addNewCar);

// Get all cars
router.get("/cars", getAllCar);

// Get distinct car locations
router.get("/locations", getCarLocations);

// Edit car details
router.put("/edit/:id",upload.single("carImages"), editCarDetails);

// Deactivate a car
router.put("/deactivate/:id", deactivateCar);

// Show car details
router.get("/:id", showCarDetails);

// Update car photos
router.put("/editphotos/:id", upload.array("carimages", 5), updateCarPhotos);



export { router as carRouter };
