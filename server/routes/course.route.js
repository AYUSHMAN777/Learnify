const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');
const { 
    createCourse, 
    getAllAdminCourses, 
    editCourse, 
    getCourseById, 
    createLecture, 
    getCourseLecture, 
    getlecturebyId, 
    removelecture, 
    editlecture, 
    togglePublishCourse, 
    getPublishedCourses, 
    searchCourse, 
    removeCourse 
} = require('../controllers/course.controller');
const upload = require('../utils/multer');

router.post('/', isAuthenticated, createCourse);
router.get('/', isAuthenticated, getAllAdminCourses);
router.get('/published', getPublishedCourses);
router.delete('/:courseId', isAuthenticated, removeCourse);
router.get('/search', isAuthenticated, searchCourse);
router.put('/:courseId', isAuthenticated, upload.single('courseThumbnail'), editCourse);
router.get('/:courseId', isAuthenticated, getCourseById);
router.post('/:courseId/lecture', isAuthenticated, createLecture);
router.get('/:courseId/lecture', isAuthenticated, getCourseLecture);
router.post('/:courseId/lecture/:lectureId', isAuthenticated, upload.single('file'), editlecture);
router.delete('/lecture/:lectureId', isAuthenticated, removelecture);
router.get('/lecture/:lectureId', isAuthenticated, getlecturebyId);
router.patch('/:courseId', isAuthenticated, togglePublishCourse);

module.exports = router;