import Car from "../models/carModel.js";
import { cloudinaryInstance } from "../config/cloudinary.js";
import fs from 'fs';
import path from 'path';
import Review from "../models/reviewmodel.js";
import Booking from "../models/bookingmodel.js";

// Get all cars
export const getAllCar = async (req, res) => {
  try {
    const carsList = await Car.find()
      .populate({
        path: 'ownerDetails.bookingId', // Populate single booking
        model: 'Booking',
        populate: { path: 'userId', select: 'name email' },
      })
      .lean();

    for (const car of carsList) {
      // Fetch reviews for the current car
      const reviews = await Review.find({ carId: car._id }).populate('userId', 'name email');
      car.reviews = reviews;

      // Calculate the average rating
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        car.averageRating = totalRating / reviews.length;
      } else {
        car.averageRating = 0; // Default to 0 if no reviews
      }
    }

    res.json({ message: 'Cars fetched successfully', data: carsList });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};
// Add a new car




export const addNewCar = async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      pricePerDay,
      carType,
      features,
      location,
      carNumber,
      "ownerDetails.name": ownerName,
      "ownerDetails.mobileNumber": ownerMobileNumber,
      "ownerDetails.email": ownerEmail,
      "ownerDetails.address": ownerAddress,
      "ownerDetails.aadharNumber": ownerAadharNumber,
    } = req.body;

    // Reconstruct ownerDetails
    const ownerDetails = {
      name: ownerName,
      mobileNumber: ownerMobileNumber,
      email: ownerEmail,
      address: ownerAddress,
      aadharNumber: ownerAadharNumber,
    };

    // Validate required fields
    if (
      !brand ||
      !model ||
      !year ||
      !pricePerDay ||
      !carType ||
      !location ||
      !carNumber ||
      !ownerDetails.name ||
      !ownerDetails.mobileNumber ||
      !ownerDetails.email ||
      !ownerDetails.address ||
      !ownerDetails.aadharNumber
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Upload car images to Cloudinary if provided
    let carImages;
    if (req.file) {
      const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      try {
        const uploadResult = await cloudinaryInstance.uploader.upload(fileBase64, {
          folder: "carImages", // Specify the folder in Cloudinary
        });
        carImages = uploadResult.secure_url; // Store the URL of the uploaded image
      } catch (error) {
        return res.status(500).json({ message: "Failed to upload picture", error: error.message });
      }
    }


    const newCar = new Car({
      brand,
      model,
      year,
      pricePerDay,
      carType,
      features: features ? features.split(",") : [],
      location,
      carNumber,
      carImages,
      ownerDetails,
    });

    await newCar.save();

    res.status(201).json({ message: "Car added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};


// export const editCarDetails = async (req, res) => {
//   try {
//     const { id } = req.params; // ID of the car to update
//     const {
//       admin,
//       brand,
//       model,
//       year,
//       pricePerDay,
//       carType,
//       features,
//       location,
//       carNumber,
//       "ownerDetails.name": ownerName,
//       "ownerDetails.mobileNumber": ownerMobileNumber,
//       "ownerDetails.email": ownerEmail,
//       "ownerDetails.address": ownerAddress,
//       "ownerDetails.aadharNumber": ownerAadharNumber,
//     } = req.body;

//     // Reconstruct ownerDetails
//     const ownerDetails = {
//       name: ownerName,
//       mobileNumber: ownerMobileNumber,
//       email: ownerEmail,
//       address: ownerAddress,
//       aadharNumber: ownerAadharNumber,
//     };

//     // Check for duplicate car number (if updated)
//     if (carNumber) {
//       const existingCar = await Car.findOne({ carNumber, _id: { $ne: id } });
//       if (existingCar) {
//         return res.status(400).json({ message: "Car number already exists" });
//       }
//     }

//     // Handle features parsing
//     const parsedFeatures = typeof features === "string" ? JSON.parse(features) : features;

//     // Handle image upload
//     let carImages;
//     if (req.file) {
//       const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
//       try {
//         const uploadResult = await cloudinaryInstance.uploader.upload(fileBase64, {
//           folder: "carImages",
//         });
//         carImages = uploadResult.secure_url;
//       } catch (error) {
//         return res.status(500).json({ message: "Failed to upload car image", error: error.message });
//       }
//     }

//     // Construct updated data
//     const updatedData = {
//       admin,
//       brand,
//       model,
//       year,
//       pricePerDay,
//       carType,
//       features: parsedFeatures,
//       location,
//       carNumber,
//       ownerDetails,
//       ...(carImages && { carImages }), // Only include if new image uploaded
//     };

//     // Update car details
//     const car = await Car.findByIdAndUpdate(id, updatedData, { new: true });
//     if (!car) {
//       return res.status(404).json({ message: "Car not found" });
//     }

//     res.status(200).json({ message: "Car details updated successfully", data: car });
//   } catch (error) {
//     res.status(500).json({ message: error.message || "Internal server error" });
//   }
// };
export const editCarDetails = async (req, res) => {
  try {
    // Parse ownerDetails if it's a stringified object
    if (req.body.ownerDetails) {
      req.body.ownerDetails = JSON.parse(req.body.ownerDetails);
    }

    let carImages;
    if (req.file) {
      // If a new image is uploaded
      console.log("Image loaded");

      // Convert the image buffer to base64 for Cloudinary upload
      const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      try {
        // Upload to Cloudinary
        const uploadResult = await cloudinaryInstance.uploader.upload(fileBase64, {
          folder: "carImages", // Specify the folder in Cloudinary
        });
        carImages = uploadResult.secure_url; // URL of the uploaded image
      } catch (error) {
        return res.status(500).json({ message: "Failed to upload picture", error: error.message });
      }
    }

    // Ensure carImages gets updated if a new image is uploaded, or keep the existing image
    if (carImages) {
      req.body.carImages = [carImages]; // Update with new image URL
    }

    // Update the car details in the database
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    return res.status(200).json(updatedCar);  // Send back updated car data
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update car" });
  }
};

// Deactivate car
export const deactivateCar = async (req, res) => {
  try {
    const { id } = req.params;

    const car = await Car.findByIdAndUpdate(id, { availability: false }, { new: true });
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json({ message: "Car deactivated successfully", car });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Show car details
export const showCarDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is valid
    if (!id) {
      return res.status(400).json({ message: "Car ID is required" });
    }

    // Fetch car data by ID
    const car = await Car.findById(id).exec();

    // Check if car exists
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Log the car object to check for ownerDetails
    console.log('Fetched Car Data:', car);

    // Send car data in the response
    res.status(200).json({ data: car });
  } catch (error) {
    console.error('Error fetching car details:', error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};


// Update car photos
export const updateCarPhotos = async (req, res) => {
  try {
    const { carId } = req.params;

    const uploadedImages = await Promise.all(
      req.files.map((file) =>
        cloudinaryInstance.uploader.upload(file.path).then((result) => result.url)
      )
    );

    const car = await Car.findByIdAndUpdate(
      carId,
      { $push: { carimages: { $each: uploadedImages } } }, // Add new images to the existing array
      { new: true }
    );

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json({ message: "Car photos updated successfully", car });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Fetch distinct car locations
export const getCarLocations = async (req, res) => {
  try {
    const locations = await Car.distinct("location");
    res.status(200).json({ message: "Locations retrieved successfully", data: locations });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
