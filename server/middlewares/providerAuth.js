
import jwt from "jsonwebtoken";

export const carProviderAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
   

        req.carProvider = tokenDecoded; // Populate req.carProvider
        next();
    } catch (error) {
        console.error("Error in carProviderAuth:", error.message); // Debug log
        res.status(500).json({ message: "Internal Server Error" });
    }
};
