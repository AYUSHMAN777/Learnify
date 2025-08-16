const mongoose = require('mongoose');
const { Schema } = mongoose;

const coursePurchaseSchema = new Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
        paymentId: {
            type: String,
            required:true,
            // This will likely be added after a successful payment transaction
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt timestamps
    }
);

module.exports = mongoose.model('CoursePurchase', coursePurchaseSchema);
