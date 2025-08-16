const express = require('express');
const isAuthenticated = require('../middleware/isAuthenticated');
const router = express.Router();
const {
    getCourseProgress,
    updateLectureProgress,
    markAsCompleted,
    markAsIncomplete,
} = require('../controllers/courseprogess.controller');

router.get('/:courseId', isAuthenticated, getCourseProgress);
router.post('/:courseId/lectures/:lectureId/view', isAuthenticated, updateLectureProgress);
router.post('/:courseId/complete', isAuthenticated, markAsCompleted);
router.post('/:courseId/incomplete', isAuthenticated, markAsIncomplete);

module.exports = router;