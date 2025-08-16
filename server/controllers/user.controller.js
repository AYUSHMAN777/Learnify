const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generatetoken');
const { deleteMediafromcloudinary, uploadMedia } = require('../utils/cloudinary');

// Register Controller
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        
        // Log the user in by generating a token
        generateToken(res, newUser, 'User registered successfully.');

    } catch (error) {
        console.error('Registration Error:', error.message);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// Login Controller
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required.' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT token
        generateToken(res, user, `Welcome back ${user.name}`);

        // res.status(200).json({ message: 'Login successful.', token });
    } catch (error) {
        console.error('Login Error:', error.message);
        return res.status(500).json({ message: 'Server error during login.' });
    }
};

const logout = (req, res) => {
    try {
        return res
            .status(200)
            .cookie('token', "", { maxAge: 0 })
            .json({
                message: 'Logout successful.',
                success: true
            });
    } catch (error) {
        console.error('Logout Error:', error.message);
        return res.status(500).json({
            message: 'Server error during logout.',
            success: false
        });
    }
}
const getUserProfile = async (req, res) => { //getuserprofile only after the user is authenticated using middleware
    try {
        const userId = req.id;
        const user = await User?.findById(userId)
            .select('-password')
            .populate({
                path: 'enrolledCourses', // The field in the User schema
                populate: {
                    path: 'creator',     // The field inside the Course schema
                    select: 'name photoUrl' // Specify which fields from the creator you want
                }
            });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error('Profile Fetch Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server error during profile fetch.'
        });
    }
};

//update profile controller
const updateProfile = async (req, res) => {
    try {
        const userId = req.id;// Auth middleware se aata hai
        const { name } = req.body;//req.body take data from frontend and send data in request body and receive data in req.body by baackend and can use it by destructuring in controller
        const profilephoto = req.file;
        // Controller me File Access :

        // Multer middleware file ko req.file me daal deta hai.
        // Aap controller me req.file se file ka path nikal sakte hain:


        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        //extract the public ID from the profile photo file name
        if (user.photoUrl) {
            const publicId = user.photoUrl.split('/').pop().split('.')[0];
            deleteMediafromcloudinary(publicId); // Assuming you have a function to delete media from Cloudinary
        }


        // File check
        if (!profilephoto) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }
        console.log('profilephoto:', profilephoto);


        //uplaod profile photo to cloudinary
        const cloudinaryResponse = await uploadMedia(profilephoto.path);
        console.log('cloudinaryResponse:', cloudinaryResponse);
        if (!cloudinaryResponse) {
            return res.status(500).json({ message: 'Cloudinary upload failed.' });
        }

        const photoUrl = cloudinaryResponse.secure_url; // Assuming the response contains the URL

        // user.photoPublicId = cloudinaryResponse.public_id; // Assuming the response contains the public ID
        const updatedData = { name, photoUrl };





        // Find user and update
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select('-password');
        return res.status(200).json({
            user: updatedUser,
            message: 'Profile updated successfully.',
            success: true,
        });

    }
    catch (error) {
        console.error('Profile Update Error:', error.message);
        return res.status(500).json({ message: 'Server error during profile update.' });
    }
}

module.exports = { registerUser, loginUser, logout, getUserProfile, updateProfile };
