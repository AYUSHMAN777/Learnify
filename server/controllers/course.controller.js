const Course = require('../models/Coursemodel');
const Lecture = require('../models/Lecture');
const { uploadMedia, deleteMediafromcloudinary } = require('../utils/cloudinary');
// import Course from "../models/course.model.js"; // adjust the path to your model

const createCourse = async (req, res) => {
    try {
        const { courseTitle, category } = req.body;

        if (!courseTitle || !category) {
            return res.status(400).json({ message: 'Course title and category are required.' });
        }

        const course = await Course.create({
            courseTitle,
            category,
            creator: req.id, // assuming user ID is available in req.user

        });
        return res.status(201).json({
            message: 'Course created successfully',
            // course: savedCourse,
        })
    } catch (error) {
        console.error('Create Course Error:', error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
};

const getAllAdminCourses = async (req, res) => {
    try {
        const userId = req.id; // Assuming `req.user` is populated via auth middleware

        const courses = await Course.find({ creator: userId });

        res.status(200).json({
            success: true,
            message: "All courses created by this admin fetched successfully",
            courses,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch admin courses",
            error: error.message,
        });
    }
};



// Update course controller
const editCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const {
            courseTitle,
            subTitle,
            description,
            category,
            courseLevel,
            coursePrice
        } = req.body;

        // Handle thumbnail
        const thumbnail = req.file || req.body.courseThumbnail;

        // Find course first
        let course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        let courseThumbnailUrl = course.courseThumbnail;
        if (thumbnail && req.file) {
            // Delete old thumbnail if exists
            if (course.courseThumbnail) {
                const publicID = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMediafromcloudinary(publicID);
            }
            // Upload new thumbnail
            const uploaded = await uploadMedia(thumbnail.path);
            courseThumbnailUrl = uploaded.secure_url;
        }

        // Update course in DB
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                courseTitle,
                subTitle,
                description,
                category,
                courseLevel,
                coursePrice,
                courseThumbnail: courseThumbnailUrl
            },
            { new: true }
        );

        res.status(200).json({
            message: "Course updated successfully",
            data: updatedCourse,
        });
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        return res.status(200).json({
            success: true,
            message: 'Course fetched successfully.',
            course,
        });
    } catch (error) {
        console.error('Fetch Course by ID Error:', error.message);
        return res.status(500).json({ message: 'Server error during course fetch.' });
    }

};

const removeCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        // Optionally: Remove associated lectures, media, etc. here

        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({ message: "Course removed successfully" });
    } catch (error) {
        console.error("Remove Course Error:", error);
        return res.status(500).json({ message: "Server error during course removal." });
    }
};

// 2. Add the new createLecture controller
const createLecture = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { lectureTitle } = req.body;

        if (!lectureTitle) {
            return res.status(400).json({ message: 'Lecture title is required.' });
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        // Create a new lecture
        const newLecture = await Lecture.create({ lectureTitle });

        // Save the new lecture to the database
        await newLecture.save();

        // Add the new lecture's ID to the course's lectures array
        course.lectures.push(newLecture._id);

        // Save the updated course
        await course.save();

        return res.status(201).json({
            success: true,
            message: 'Lecture created successfully.',
            lecture: newLecture,
        });

    } catch (error) {
        console.error('Create Lecture Error:', error.message);
        return res.status(500).json({ message: 'Server error during lecture creation.' });
    }
};
const getCourseLecture = async (req, res) => {
    try {
        const { courseId } = req.params;
        // This line finds the course and populates its lectures
        const course = await Course.findById(courseId).populate('lectures');

        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        return res.status(200).json({
            success: true,
            message: 'Course fetched successfully.',
            lectures: course.lectures, // This will return the lectures associated with the course
            // course, // This course object will now contain the full list of lectures
        });
    } catch (error) {
        console.error('Fetch Course by ID Error:', error.message);
        return res.status(500).json({ message: 'Server error during course fetch.' });
    }
};

const editlecture = async (req, res) => {
    try {
        const { lectureTitle, videoInfo, isPreviewFree } = req.body;
        const { courseId, lectureId } = req.params;

        // Find the course and lecture
        const course = await Course.findById(courseId);
        const lecture = await Lecture.findById(lectureId);

        if (!course || !lecture) {
            return res.status(404).json({ message: 'Course or lecture not found.' });
        }

        // Update the lecture details
        if (lectureTitle) lecture.lectureTitle = lectureTitle;
        if (videoInfo.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if (videoInfo.publicId) lecture.publicId = videoInfo.publicId;
        if (isPreviewFree) lecture.isPreview = isPreviewFree;

        await lecture.save();

        // Ensure the course still has the lecture id if it was not already there
        if (course && !course.lectures.includes(lecture._id)) {
            course.lectures.push(lecture._id);
            await course.save();
        }
        return res.status(200).json({
            lecture,
            message: "Lecture updated successfully"
        });
    } catch (error) {
        console.error('Edit Lecture Error:', error.message);
        return res.status(500).json({ message: 'Server error during lecture edit.' });
    }
};

const removelecture = async (req, res) => {
    try {
        const { lectureId } = req.params;

        // Find the course and lecture
        // const course = await Course.findById(courseId);
        const lecture = await Lecture.findById(lectureId);

        if (!lecture) {
            return res.status(404).json({ message: 'Lecture not found.' });
        }

        // Remove the lecture from the database
        await Lecture.findByIdAndDelete(lectureId);

        //delete lecture video from cloudinary
        if (lecture.publicId) {
            await deleteMediafromcloudinary(lecture.publicId);
        }

        // Optionally, you can also remove the lecture ID from the course's lectures array
        await Course.updateOne(
            { lectures: lectureId },//find the course that contain the lecture 
            { $pull: { lectures: lectureId } },//remove the lectureId from the lecture array
        );

        return res.status(200).json({
            success: true,
            message: 'Lecture removed successfully.',
        });

    } catch (error) {
        console.error('Remove Lecture Error:', error.message);
        return res.status(500).json({ message: 'Server error during lecture removal.' });
    }
};

const getlecturebyId = async (req, res) => {
    try {
        const { lectureId } = req.params;

        const lecture = await Lecture.findById(lectureId);

        if (!lecture) {
            return res.status(404).json({ message: 'Lecture not found.' });
        }

        return res.status(200).json({
            success: true,
            message: 'Lecture fetched successfully.',
            lecture,
        });
    } catch (error) {
        console.error('Fetch Lecture by ID Error:', error.message);
        return res.status(500).json({ message: 'Server error during lecture fetch.' });
    }
};


//publish/unpublish the course 
 const togglePublishCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { publish } = req.query;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found!"
            });
        }

        // publish status based on the query parameter
        course.isPublished = publish === "true";
        await course.save();

        const statusMessage = course.isPublished ? "Published" : "Unpublished";
        return res.status(200).json({
            message: `Course is ${statusMessage}`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to update status"
        });
    }

};


//getpublishcourse
const getPublishedCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).populate(
            { path: "creator",
              select: "name photoUrl" } // Populate creator's name and photoUrl
        );

        return res.status(200).json({
            success: true,
            message: "All published courses fetched successfully.",
            courses,
        });
    } catch (error) {
        console.error("Error fetching published courses:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch published courses.",
        });
    }
};

const searchCourse = async (req, res) => {
    try {
        const { query = '', categories = [], sortByPrice = '' } = req.query;//

        // 1. Base search criteria: only published courses
        const searchCriteria = {
            isPublished: true,
        };

        // 2. Add text search criteria if a query is provided
        if (query) {
            searchCriteria.$or = [
                { courseTitle: { $regex: query, $options: 'i' } },
                { subTitle: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ];
        }

        // 3. Add category filter if categories are provided
        if (categories.length > 0) {
            // Ensure categories are provided as an array
            const categoryArray = Array.isArray(categories) ? categories : [categories];
            searchCriteria.category = { $in: categoryArray };
        }

        // 4. Define sorting options
        let sortOption = {};
        if (sortByPrice === 'price-asc') {
            sortOption.coursePrice = 1; // 1 for ascending
        } else if (sortByPrice === 'price-desc') {
            sortOption.coursePrice = -1; // -1 for descending
        } else {
            sortOption.createdAt = -1; // Default sort by newest
        }

        // 5. Find courses based on criteria and sort options, then populate creator details
        const courses = await Course.find(searchCriteria)
            .sort(sortOption)
            .populate({
                path: 'creator',
                select: 'name photoUrl' // Select only name and photoUrl
            });

        return res.status(200).json({
            success: true,
            message: "Courses fetched successfully.",
            courses,
        });

    } catch (error) {
        console.error("Error searching courses:", error);
        return res.status(500).json({ message: "Server error during course search." });
    }
};

module.exports = { createCourse, getAllAdminCourses, editCourse, searchCourse, getCourseById, createLecture, getCourseLecture, removelecture, editlecture, getlecturebyId, togglePublishCourse, getPublishedCourses ,removeCourse};
