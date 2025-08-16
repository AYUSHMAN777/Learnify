const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');
const { createCheckoutSession, webhook, getAllPurchasedCourses, getCourseDetailWithPurchaseStatus } = require('../controllers/coursePurchase.controller');

router.post('/create-checkout-session', isAuthenticated, createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);
router.get('/course/:courseId/detail-with-status', isAuthenticated, getCourseDetailWithPurchaseStatus);
router.get('/purchased-courses', isAuthenticated, getAllPurchasedCourses);

module.exports = router;