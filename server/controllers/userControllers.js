
import User from "../models/userModel.js";
import Booking from "../models/bookingmodel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import { cloudinaryInstance } from "../config/cloudinary.js";
import Review from "../models/reviewmodel.js";


export const userSignup = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        if (!name || !email || !password || !phone || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        // Upload profile photo to Cloudinary if provided
        let profilePic;

        if (req.file) {
            // Convert the file buffer to a base64 string for upload
            const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

            try {
                const uploadResult = await cloudinaryInstance.uploader.upload(fileBase64, {
                    folder: "profile_pics", // Specify the folder in Cloudinary
                });
                profilePic = uploadResult.secure_url; // Store the URL of the uploaded image
            } catch (error) {
                return res.status(500).json({ message: "Failed to upload profile picture", error: error.message });
            }
        } else {
            profilePic = "https://via.placeholder.com/150/000000/FFFFFF/?text=Profile";
        }
        const newUser = new User({ name, email, password: hashedPassword, phone, address, profilePic });
        await newUser.save();

        const token = generateToken(newUser, "user");
        res.cookie("token", token, { sameSite: "None", secure: true });
        // res.cookie("token", token);

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(400).json({ message: "User does not exist" });
        }

        if (!userExist.isActive) {
            return res.status(403).json({ message: "Account is deactivated. Please contact support." });
        }

        const isPasswordMatch = await bcrypt.compare(password, userExist.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }



        const token = generateToken(userExist, 'user');
        res.cookie("token", token, { sameSite: "None", secure: true });
        // res.cookie('token', token);

        res.json({ message: "User logged in successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const userProfile = async (req, res, next) => {
    try {

        const userId = req.user.id;
        const userProfile = await User.findById(userId).select("-password");


        res.json({ message: "user login successfully", data: userProfile });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};




export const userLogout = (req, res) => {
    try {
        res.clearCookie('token', { secure: true, sameSite: 'none' });

        res.json({ message: "user logout success" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const checkUser = (req, res) => {
    try {
        res.json({ message: "User authorized" });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const updateUserDetails = async (req, res) => {

    try {
        const userId = req.user.id; // Get the user ID from JWT authentication
        const { name, email, address, phone } = req.body;

        // Check if the fields are provided
        if (!name || !email || !address || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the email already exists (excluding the current user's email)
        const existingUser = await User.findOne({ email, _id: { $ne: userId } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        // Find the user by ID and update the profile
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email, address, phone },
            { new: true } // Return the updated user data
        ).select('-password'); // Exclude password from the response

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Profile updated successfully',
            data: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};


export const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        user.password = bcrypt.hashSync(newPassword, 10);
        await user.save();

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const changeProfilePhoto = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from authenticated middleware

        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Convert file buffer to base64 for Cloudinary upload
        const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

        // Upload image to Cloudinary
        const uploadResult = await cloudinaryInstance.uploader.upload(fileBase64, {
            folder: "profile_pics", // Store in a folder on Cloudinary
            public_id: `user_${userId}_profile_pic`, // Optional: customize image name
            overwrite: true, // Replace the image if it already exists
        });

        if (!uploadResult.secure_url) {
            return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
        }

        // Update user profile picture in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResult.secure_url },
            { new: true }
        ).select("-password");

        // Respond with success
        res.status(200).json({
            message: "Profile picture updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error("Error updating profile picture:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deactivateAccount = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from authentication middleware

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isActive) {
            return res.status(400).json({ message: "Account is already deactivated" });
        }

        user.isActive = false; // Set account to inactive
        await user.save();

        res.clearCookie("token"); // Clear the auth token cookie
        res.json({ message: "Account deactivated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};


export const getAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find().select("-password"); // Exclude the password field for security reasons

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        res.status(200).json({ data: users });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch bookings for the logged-in user and populate car details
        const bookings = await Booking.find({ userId })
            .populate('carId')
            .populate("userId", "name email phone address profilePic");

        // If no bookings, send a 200 response with a message
        if (!bookings || bookings.length === 0) {
            return res.status(200).json({ message: 'No bookings found' });
        }

        // Update booking status to "Completed" if the "toDate" has passed and the status is "Booked"
        const currentDate = new Date();

        for (let booking of bookings) {
            const toDate = new Date(booking.toDate);
            if (booking.status === 'Booked' && toDate <= currentDate) {
                booking.status = 'Completed'; // Automatically mark as completed
                await booking.save();
            }
        }

        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        console.error('Error fetching user bookings:', error.message || error);
        res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
    }
};



export const getBookingDetails = async (req, res) => {
    try {
        const { bookingId } = req.params;
        console.log('Booking ID:', bookingId); // Log the bookingId

        // Validate bookingId
        if (!bookingId) {
            return res.status(400).json({ message: "Booking ID is missing" });
        }

        // Fetch the booking by bookingId and populate car details
        const booking = await Booking.findById(bookingId).populate("carId");

        // Check if booking was found
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        console.log('Booking Data:', booking); // Log the retrieved booking data

        // Return the booking details in the response
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        console.error("Error fetching booking details:", error);
        res.status(500).json({ message: "Failed to fetch booking details", error: error.message });
    }
};



export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the booking by ID
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }


        // Update the booking status to 'Cancelled'
        booking.status = "Cancelled";
        await booking.save();

        res.json({ message: "Booking cancelled successfully", data: booking });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

export const getReviewForCar = async (req, res) => {
    try {
        const { userId, carId } = req.params; // Get userId and carId from params

        // Fetch review for the given user and car
        const review = await Review.findOne({ userId, carId });

        if (review) {
            return res.status(200).json({ data: review });
        } else {
            return res.status(404).json({ message: "No review found for this car by this user." });
        }
    } catch (error) {
        console.error("Error fetching review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};