const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./database/db');
const cookieParser = require('cookie-parser');
const courseRoute = require('./routes/course.route');
const mediaRoute = require('./routes/media.route');
const userRoutes = require('./routes/user.route');
const purchaseCourseRoute = require('./routes/purchaseCourse.route');
const courseProgress = require('./routes/courseProgress.route');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

// const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://learnify-ecru.vercel.app'
  ],
  credentials: true,
}));

// Routes  
app.use('/api/media', mediaRoute);
app.use('/api/user', userRoutes);
app.use('/api/course', courseRoute);
app.use('/api/progress', courseProgress);
app.use('/api/purchase', purchaseCourseRoute);

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;
