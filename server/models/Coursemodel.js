// models/Course.js

const mongoose=require('mongoose');

const { Schema } = mongoose;

// Course Schema
const courseSchema = new Schema(
  {
    courseTitle: {
      type: String,
      required: true,
    //   trim: true,
    },
    subTitle: {
      type: String,
    //   trim: true,
    },
    description: {
      type: String,
      // required: true,
    },
    category: {
      type: String,
      required: true,
    },
    courseLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    coursePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    courseThumbnail: {
      type: String, // e.g., Cloudinary URL or local path
      required: true,
    },

    // Relationships
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture',
      },
    ],

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    //   required: true,
    },
    isPublished:{
        type:Boolean,
        default:false
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Course', courseSchema);
