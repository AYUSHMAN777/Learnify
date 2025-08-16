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

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    'https://learnify-1-sb4f.onrender.com'
  ],
  credentials: true,
}));

// API Routes
app.use('/api/media', mediaRoute);
app.use('/api/user', userRoutes);
app.use('/api/course', courseRoute);
app.use('/api/progress', courseProgress);
app.use('/api/purchase', purchaseCourseRoute);

// --- CORRECTED STATIC FILE SERVING ---
// This builds the correct path from the current directory (__dirname, which is inside 'server')
// up one level ('..') to the project root, and then into 'client/dist'.
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

// The catch-all handler to serve the React app's index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;