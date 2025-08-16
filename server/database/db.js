const mongoose = require('mongoose');


// Connect MongoDB

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.VITE_MONGO_URI)
        console.log('MongoDB connected');
    }
    catch(error){
        console.error('MongoDB connection failed:', error.message);
          process.exit(1);
    }
};
module.exports = connectDB;