

import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js"; 
import CarProvider from "../models/carprovidermodel.js";

export const CarPSignup = async (req, res) => {
    try {
        const { name, email, password, phone, address, profilePic } = req.body;

        if (!name || !email || !password || !phone || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const CarPExist = await CarProvider.findOne({ email }); // Corrected reference
        if (CarPExist) {
            return res.status(400).json({ message: "CarP already exists" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10)

        const newCarP = new CarProvider({ name, email, password: hashedPassword, phone, address, profilePic }); // Corrected reference
        await newCarP.save();

        const token = generateToken(newCarP, "CarP");

        res.cookie("token", token)

        res.status(201).json({ message: "CarP created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const CarPLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const CarPExist = await CarP.findOne({ email });
        if (!CarPExist) {
            return res.status(400).json({ message: "CarP does not exist" });
        }

        if (!CarPExist.isActive) {
            return res.status(403).json({ message: "Account is deactivated. Please contact support." });
        }

        const isPasswordMatch = await bcrypt.compare(password, CarPExist.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

      

        const token = generateToken(CarPExist, 'CarP');
        res.cookie('token', token);

        res.json({ message: "CarP logged in successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const CarPProfile = async (req, res, next) => {
    try {
        
     const CarPId =req.CarP.id;
     const CarPProfile = await CarP.findById(CarPId).select("-password");


        res.json({ message: "CarP login successfully", data:CarPProfile });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const CarPLogout = (req, res) => {
    try {
        res.clearCookie('token');
        res.json({ message: "CarP logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const checkCarP = (req, res) => {
    try {
        res.json({ message: "CarP authorized" });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const updateCarPDetails = async (req, res) => {
    try {
        const CarPId = req.CarP.id; // Assuming req.user is populated by middleware
        const { name, phone, address } = req.body;

        if (!name || !phone || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const updatedCarP = await CarP.findByIdAndUpdate(
            CarPId,
            { name, phone, address },
            { new: true, runValidators: true }
        ).select("-password");

        res.json({ message: "CarP details updated successfully", data: updatedCarP });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};
export const changePassword = async (req, res) => {
    try {
        const CarPId = req.CarP.id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const CarP = await CarP.findById(CarPId);
        if (!CarP) {
            return res.status(404).json({ message: "CarP not found" });
        }

        const isPasswordMatch = await bcrypt.compare(oldPassword, CarP.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        CarP.password = bcrypt.hashSync(newPassword, 10);
        await CarP.save();

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};
export const changeProfilePhoto = async (req, res) => {
    try {
        const CarPId = req.CarP.id;
        const { profilePic } = req.body;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture URL is required" });
        }

        const updatedCarP = await CarP.findByIdAndUpdate(
            CarPId,
            { profilePic },
            { new: true }
        ).select("-password");

        res.json({ message: "Profile photo updated successfully", data: updatedCarP });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};


export const deactivateAccount = async (req, res) => {
    try {
        const CarPId = req.CarP.id; // Get CarP ID from authentication middleware

        const CarP = await CarP.findById(CarPId);
        if (!CarP) {
            return res.status(404).json({ message: "CarP not found" });
        }

        if (!CarP.isActive) {
            return res.status(400).json({ message: "Account is already deactivated" });
        }

        CarP.isActive = false; // Set account to inactive
        await CarP.save();

        res.clearCookie("token"); // Clear the auth token cookie
        res.json({ message: "Account deactivated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};
