
import jwt from "jsonwebtoken";

export const adminAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
   

        req.Admin = tokenDecoded; // Populate req.Admin
        next();
    } catch (error) {
        console.error("Error in adminAuth:", error.message); // Debug log
        res.status(500).json({ message: "Internal Server Error" });
    }
};
