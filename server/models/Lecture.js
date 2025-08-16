const mongoose = require('mongoose');
const { Schema } = mongoose;

const lectureSchema = new Schema(
  {
    lectureTitle: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String, // Will store the Cloudinary URL for the video
    },
    publicId: {
      type: String, // Will store the Cloudinary public_id for video deletion
    },
    isPreview: {
      type: Boolean,
      default: false, // Default to false, lectures are not a free preview unless specified
    },
    // course: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Course',
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lecture', lectureSchema);