const jwt = require('jsonwebtoken');


const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized access.', success: false });
        }

        const decoded =await  jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token.', success: false });
        }
        req.id = decoded.userId; // Attach the user ID from the token
        next(); // Call the next middleware or route handler

    } catch (error) {
        console.error('Authentication Error:', error.message);
        return res.status(401).json({ message: 'Invalid token.', success: false });
    }
};

module.exports = isAuthenticated;
