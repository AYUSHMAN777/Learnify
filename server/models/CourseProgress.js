const mongoose = require('mongoose');
const { Schema } = mongoose;

// Sub-schema for tracking the progress of a single lecture
const lectureProgressSchema = new Schema({
    lectureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture',
        required: true,
    },
    viewed: {
        type: Boolean,
        default: false,
    },
}, { _id: false }); // _id is not needed for this sub-document

// Main schema for tracking the overall progress of a course for a user
const courseProgressSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        lectureProgress: [lectureProgressSchema], // Array of lecture progress sub-documents
    },
    {
        timestamps: true, // Adds createdAt and updatedAt timestamps
    }
);

// Create a compound index to ensure a user can only have one progress document per course
// courseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });


module.exports = mongoose.model('CourseProgress', courseProgressSchema);
