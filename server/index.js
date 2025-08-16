const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./database/db');
const cookieParser = require('cookie-parser');
const path = require('path');

// Import your route handlers
const courseRoute = require('./routes/course.route');
const mediaRoute = require('./routes/media.route');
const userRoutes = require('./routes/user.route');
const purchaseCourseRoute = require('./routes/purchaseCourse.route');
const courseProgress = require('./routes/courseProgress.route');

// --- FIX: Import the webhook controller directly ---
const { webhook } = require('./controllers/coursePurchase.controller');

dotenv.config();
connectDB();

const app = express();

// --- FIX: Define the webhook route BEFORE express.json() ---
// This ensures the body is received as a raw buffer for Stripe's signature verification.
app.post('/api/purchase/webhook', express.raw({ type: 'application/json' }), webhook);

// Now, use the JSON parser for all other routes
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://learnify-ecru.vercel.app'
  ],
  credentials: true,
}));

// Your other API Routes
app.use('/api/media', mediaRoute);
app.use('/api/user', userRoutes);
app.use('/api/course', courseRoute);
app.use('/api/progress', courseProgress);
app.use('/api/purchase', purchaseCourseRoute);

// Serve static files from the React app
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;