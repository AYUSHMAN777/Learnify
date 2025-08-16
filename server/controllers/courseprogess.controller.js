const CourseProgress = require('../models/CourseProgress');
const Course = require('../models/Coursemodel');

const getCourseProgress = async (req, res) => {
    try {
        const userId = req.id; // From isAuthenticated middleware
        const { courseId } = req.params;

        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required." });
        }

        // 1. Try to find the user's progress for this course
        let courseProgress = await CourseProgress.findOne({ userId, courseId })
            .populate("courseId");

        const courseDetails = await Course.findById(courseId)
        .populate('creator', 'name')
        .populate('lectures');
         
        if (!courseDetails) {
            return res.status(404).json({ message: "Course not found." });
        }

        // 2. If no progress is found, fetch course details and return a default progress object
        if (!courseProgress) {
            return res.status(200).json({
                data: {
                    courseDetails,
                    progress: [],
                    completed: false
                }
            })
        }
        //3. return the user course progress along with coursedetail
        //jab hm kisi lecture pr click krnge tab turnt update lecture controller run hoga aur wo courseprogress ko update kr dega

        return res.status(200).json({
            data: {
                // courseProgress,
                courseDetails,
                progress: courseProgress ? courseProgress.lectureProgress : [],
                completed: courseProgress ? courseProgress.completed : false
            }
        });
    } catch (error) {
        console.error("Error fetching course progress:", error);
        return res.status(500).json({ message: "Server error." });
    }
};


const updateLectureProgress = async (req, res) => {
    try {
        const userId = req.id;
        const { courseId, lectureId } = req.params;

        // Find the full course details to get the total number of lectures
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }

        // Find the user's progress for this course
        let courseProgress = await CourseProgress.findOne({ userId, courseId });

        // If no progress exists, create a new one
        if (!courseProgress) {
            courseProgress = new CourseProgress({
                userId,
                courseId,
                completed: false,
                lectureProgress: [],
            });
        }

        // Find the index of the lecture being updated
        const lectureIndex = courseProgress.lectureProgress.findIndex(
            (lp) => lp.lectureId.toString() === lectureId);

        // If the lecture is already in the progress array, mark it as viewed
        if (lectureIndex !== -1) {
            courseProgress.lectureProgress[lectureIndex].viewed = true;
        } else {
            // If it's not in the array, add it as a new viewed lecture
            //simple first time kisi lecture pr click kr rhe ho tb ye else statement run hoga kyuki us time pr wo lecture db me nhi hota 
            courseProgress.lectureProgress.push({ lectureId, viewed: true });
           
        }

        // Check if the entire course is completed
        const completedLecturesCount = courseProgress.lectureProgress.filter(
            (lp) => lp.viewed
        ).length;

        if (completedLecturesCount === course.lectures.length) {
            courseProgress.completed = true;
        }

        // Save the updated progress
        await courseProgress.save();

        return res.status(200).json({
            success: true,
            message: "Lecture progress updated successfully.",
            data: courseProgress,
        });

    } catch (error) {
        console.error("Error updating lecture progress:", error);
        return res.status(500).json({ message: "Server error." });
    }
};


const markAsCompleted = async (req, res) => {
    try {
        const userId = req.id;
        const { courseId } = req.params;

        // 1. Find the course to get all its lecture IDs
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }

        // 2. Find the user's progress for this course, or create it if it doesn't exist
        let courseProgress = await CourseProgress.findOne({ userId, courseId });

        if (!courseProgress) {
            courseProgress = new CourseProgress({ userId, courseId });
        }

        // 3. Create a new lectureProgress array with all lectures marked as viewed
        //    This is more robust as it uses the definitive course lecture list.
        courseProgress.lectureProgress = course.lectures.map(lectureId => ({
            lectureId: lectureId,
            viewed: true,
        }));

        courseProgress.completed = true;

        // 4. Save the changes
        await courseProgress.save();

        return res.status(200).json({
            success: true,
            message: "Course marked as completed successfully.",
            data: courseProgress,
        });

    } catch (error) {
        console.error("Error marking course as completed:", error);
        return res.status(500).json({ message: "Server error." });
    }
};


const markAsIncomplete = async (req, res) => {
    try {
        const userId = req.id;
        const { courseId } = req.params;

        // 1. Find the user's progress for this course
        let courseProgress = await CourseProgress.findOne({ userId, courseId });

        if (!courseProgress) {
            // If no progress exists, there's nothing to mark as incomplete.
            return res.status(404).json({ message: "Course progress not found." });
        }

        // 2. Reset the progress
        // Set all lecture statuses to false
        courseProgress.lectureProgress.forEach(lecture => {
            lecture.viewed = false;
        });
        
        // Mark the entire course as not completed
        courseProgress.completed = false;

        // 3. Save the changes
        await courseProgress.save();

        return res.status(200).json({
            success: true,
            message: "Course marked as incomplete.",
            data: courseProgress,
        });

    } catch (error) {
        console.error("Error marking course as incomplete:", error);
        return res.status(500).json({ message: "Server error." });
    }
};


module.exports = {
    getCourseProgress,
    updateLectureProgress,
    markAsCompleted,
    markAsIncomplete, // Export the new function
};






