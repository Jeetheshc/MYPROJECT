import Booking from "../models/bookingmodel.js";
import Car from "../models/carModel.js"; // Assuming you have a Car model


export const createBooking = async (req, res) => {
  try {
      const { carId, userId, fromDate, toDate, location, totalAmountPaid } = req.body;

      if (!carId || !userId || !fromDate || !toDate || !location || !totalAmountPaid) {
          console.error('Missing required booking details:', req.body);
          return res.status(400).json({ message: 'Missing required booking details' });
      }

      const newBooking = new Booking({
          carId,
          userId,
          fromDate,
          toDate,
          location,
          paymentDate: new Date(),
          totalAmountPaid,
      });

      await newBooking.save();

      res.status(201).json({ success: true, message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
      console.error('Error creating booking:', error.message || error);
      res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
};

export const newbooking = async (req, res) => {
  try {
    const { carId, fromDate, toDate, location, paymentMode, totalAmountPaid } = req.body;
    const userId = req.user.id;

    console.log(carId, userId, fromDate, toDate, location, paymentMode, totalAmountPaid);

    // Check if all required data is provided
    if (!carId || !userId || !fromDate || !toDate || !location || !totalAmountPaid) {
      return res.status(400).json({ message: "Missing required booking details" });
    }

    // Convert fromDate and toDate to Date objects
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    if (isNaN(fromDateObj.getTime()) || isNaN(toDateObj.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Create a new booking instance
    const newBooking = new Booking({
      carId,
      userId,
      fromDate: fromDateObj,
      toDate: toDateObj,
      location,
      paymentDate: new Date(),
      paymentMode,
      totalAmountPaid,
    });

    // Save the new booking to the database
    const savedBooking = await newBooking.save();

    // Send the response back with the saved booking data
    res.status(201).json({ success: true, data: savedBooking });
  } catch (error) {
    console.error("Error creating booking:", error.message);
    res.status(500).json({ message: "Failed to create booking", error: error.message });
  }
};
// Create a new booking
// export const createBooking = async (req, res) => {
//   try {
//     const {
//       carId,
//       userId,
//       bookingDate,
//       bookingTime,
//       location,
//       fromTime,
//       toTime,
//       paymentDateTime,
//       paymentMode,
//       totalAmountPaid
//     } = req.body;

//     // Validate required fields
//     if (!carId || !userId || !bookingDate || !bookingTime || !location || !fromTime || !toTime || !paymentDateTime || !paymentMode || !totalAmountPaid) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Validate payment mode
//     const validPaymentModes = ["Credit Card", "Debit Card", "UPI", "Cash"];
//     if (!validPaymentModes.includes(paymentMode)) {
//       return res.status(400).json({ message: "Invalid payment mode" });
//     }

//     // Check if the car exists
//     const car = await Car.findById(carId);
//     if (!car) {
//       return res.status(404).json({ message: "Car not found" });
//     }

//     // Calculate total days and total price
//     const fromDate = new Date(fromTime);
//     const toDate = new Date(toTime);
//     const rentalDays = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24));
//     const totalPrice = rentalDays * car.pricePerDay;

//     if (totalPrice !== totalAmountPaid) {
//       return res.status(400).json({ message: "Total amount paid does not match calculated total price" });
//     }

//     // Create booking
//     const newBooking = new Booking({
//       carId,
//       userId,
//       bookingDate,
//       bookingTime,
//       location,
//       fromTime,
//       toTime,
//       paymentDateTime,
//       paymentMode,
//       totalAmountPaid,
//       totalPrice,
//     });

//     await newBooking.save();
//     res.status(201).json({ message: "Booking created successfully", data: newBooking });
//   } catch (error) {
//     res.status(500).json({ message: error.message || "Internal Server Error" });
//   }
// };



// Get all bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('carId')  // Populate car details
      .populate('userId');  // Populate user details
    res.json({ message: 'Bookings retrieved successfully', data: bookings });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};


// Get a booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate({
        path: "carId",
        populate: {
          path: "provider", // Populates the provider field in the car document
        },
      })
      .populate("userId"); // Populate user details if needed

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking retrieved successfully", data: booking });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};


// export const getBookingById = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const booking = await Booking.findById(id).populate("carId userId");
//         if (!booking) {
//             return res.status(404).json({ message: "Booking not found" });
//         }

//         res.json({ message: "Booking retrieved successfully", data: booking });
//     } catch (error) {
//         res.status(500).json({ message: error.message || "Internal Server Error" });
//     }
// };

// Cancel a booking
// export const cancelBooking = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const booking = await Booking.findById(id);
//         if (!booking) {
//             return res.status(404).json({ message: "Booking not found" });
//         }

//         await Booking.findByIdAndDelete(id);
//         res.json({ message: "Booking cancelled successfully" });
//     } catch (error) {
//         res.status(500).json({ message: error.message || "Internal Server Error" });
//     }
// };

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the booking by ID
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the booking is within 24 hours
    if (new Date(booking.fromTime) - new Date() <= 24 * 60 * 60 * 1000) {
      return res
        .status(400)
        .json({ message: "Bookings cannot be canceled within 24 hours of the start time." });
    }

    // Update the booking status to 'Cancelled'
    booking.status = "Cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully", data: booking });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};





export const getAvailableCars = async (req, res) => {
  try {
    const { fromDate, toDate, location } = req.body;

    if (!fromDate || !toDate) {
      return res.status(400).json({ message: "fromDate and toDate are required" });
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (from > to) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    // Fetch all booked cars within the given range and ignore cancelled bookings
    const bookedCarIds = await Booking.find({
      $or: [
        { fromDate: { $lte: to }, toDate: { $gte: from }, status: { $ne: "Cancelled" } }, // Exclude cancelled bookings
      ],
    }).distinct("carId");

    // Fetch cars that are not booked in the given range
    const query = { _id: { $nin: bookedCarIds }, availability: true }; // Include availability filter
    if (location) query.location = location;

    const availableCars = await Car.aggregate([
      { $match: query }, // Match cars that are available based on the filter
      {
        $lookup: {
          from: "reviews", // MongoDB collection for reviews
          localField: "_id",
          foreignField: "carId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] }, // Check if there are reviews
              then: { $avg: "$reviews.rating" }, // Calculate average rating
              else: 0, // Default to 0 if no reviews
            },
          },
        },
      },
    ]);

    res.json({ message: "Available cars retrieved successfully", data: availableCars });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const getCarBookings = async (req, res) => {
  const { id } = req.params; // Car ID from the request parameters

  try {
    // Fetch car details
    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({ message: "Car not found." });
    }

    // Fetch booking details related to the car
    const bookings = await Booking.find({ carId: id })
      .populate("userId", "name email phone address profilePic") // Populate user details
      .select(
        "fromDate toDate location paymentDate paymentMode totalAmountPaid status bookingDate"
      );

    res.status(200).json({
      data: {
        car,        // Car details
        bookings,   // Booking details
      },
    });
  } catch (error) {
    console.error("Error fetching car details with bookings:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const getBookingsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Fetching bookings for userId: ${userId}`);

    // Fetch bookings by userId and populate car details (brand, model, year, carImages, location)
    const bookings = await Booking.find({ userId })
      .populate("carId", "brand model year carImages location") // Populate car details
      .exec();

    // Check if there are no bookings for the user
    if (!bookings || bookings.length === 0) {
      return res.status(200).json({ message: "No reviews found for this car.", data: [] });
  }
    // Send the bookings data if available
    res.status(200).json({ data: bookings });
  } catch (error) {
    // Log the actual error for debugging purposes
    console.error("No bookings:", error);

    // If the error isn't related to empty bookings, show a different error message
    res.status(500).json({ message: "An error occurred while fetching bookings." });
  }
};