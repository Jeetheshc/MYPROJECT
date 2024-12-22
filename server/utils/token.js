import jwt from 'jsonwebtoken';

export const generateToken = (user, role) => {
    try {
        const token = jwt.sign(
            { id: user._id, role: role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token expires in 1 day
        );
        return token; // Ensure the token is returned
    } catch (error) {
        console.error("Error generating token:", error);
        throw new Error("Token generation failed");
    }
};

export const generateadminToken = (admin, role) => {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing");
        }
        const token = jwt.sign(
            { id: admin._id, role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        return token;
    } catch (error) {
        console.error("Error generating token:", error.message);
        throw new Error("Token generation failed");
    }
};
