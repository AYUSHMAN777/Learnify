
const jwt = require('jsonwebtoken');
// Create JWT
const generateToken = (res, user, message) => {
    const token = jwt.sign({ userId: user._id, email: user.email },
        process.env.JWT_SECRET || 'mysecretkey', { expiresIn: '7d' });
    // Set cookie with token
    return res.status(200).cookie('token', token, { httpOnly: true, sameSite: 'Strict', maxAge: 7 * 24 * 60 * 60 * 1000 }).json({
        message,
        success: true,
        user,
    });
  

};
module.exports = generateToken;