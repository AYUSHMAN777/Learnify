const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');
// --- FIX: Removed 'webhook' from the import as it's now handled in index.js ---
const { createCheckoutSession, getAllPurchasedCourses, getCourseDetailWithPurchaseStatus, getInstructorDashboardData } = require('../controllers/coursePurchase.controller');

// Route to create a checkout session
router.post('/create-checkout-session', isAuthenticated, createCheckoutSession);

// --- FIX: The webhook route has been removed from this file ---

router.get('/course/:courseId/detail-with-status', isAuthenticated, getCourseDetailWithPurchaseStatus);
router.get('/purchased-courses', isAuthenticated, getAllPurchasedCourses);
router.get('/instructor-dashboard', isAuthenticated, getInstructorDashboardData)
module.exports = router;