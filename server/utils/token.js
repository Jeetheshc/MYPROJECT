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
