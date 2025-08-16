const Stripe = require("stripe");
const Course = require("../models/Coursemodel");
const Lecture = require("../models/Lecture");
const CoursePurchase = require("../models/PurchaseCourse");
const stripe = new Stripe(process.env.Secret_key);
const User = require("../models/User");

const createCheckoutSession = async (req, res) => {
    try {
        const userId = req.id;
        const { courseId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const newPurchase = new CoursePurchase({
            userId: userId,
            courseId: courseId,
            amount: course.coursePrice,
            status: "pending",
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr", // Changed to INR
                        product_data: {
                            name: course?.courseTitle,
                            images: [course?.courseThumbnail],
                        },
                        unit_amount: course?.coursePrice * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            // --- THIS IS THE FIX ---
            success_url: `${process.env.FRONTEND_URL}/course-progress/${courseId}`,
            cancel_url: `${process.env.FRONTEND_URL}/course-detail/${courseId}`,
            // ------------------------
            metadata: {
                userId: userId,
                courseId: courseId,
            },
            shipping_address_collection: {
                allowed_countries: ['IN', 'US'],
            },
        });

        if (!session) {
            return res.status(500).json({ message: "Failed to create checkout session" });
        }

        newPurchase.paymentId = session.id;
        await newPurchase.save();

        res.status(200).json({
            success: true,
            message: "Checkout session created successfully",
            url: session.url
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

const webhook = async (req, res) => {
    const endpointSecret = process.env.WEBHOOK_ENDPOINT_SECRET;
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.log("webhook error", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        try {
            const session = event.data.object;
            const purchase = await CoursePurchase.findOne({ paymentId: session.id }).populate({ path: "courseId" });

            if (purchase && purchase.status !== 'completed') {
                purchase.status = "completed";
                await purchase.save();

                await User.findByIdAndUpdate(
                    purchase.userId,
                    { $addToSet: { enrolledCourses: purchase.courseId._id } }
                );

                await Course.findByIdAndUpdate(
                    purchase.courseId._id,
                    { $addToSet: { enrolledStudents: purchase.userId } }
                );
            }
        } catch (error) {
            console.log("Error handling event", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    res.status(200).json({ received: true });
};


const getCourseDetailWithPurchaseStatus = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required." });
        }

        const course = await Course.findById(courseId)
            .populate({ path: 'creator' })
            .populate({ path: 'lectures' });

        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }

        const purchase = await CoursePurchase.findOne({
            userId: userId,
            courseId: courseId,
            status: 'completed'
        });

        const isPurchased = !!purchase;

        return res.status(200).json({
            success: true,
            course,
            isPurchased,
        });

    } catch (error) {
        console.error("Error fetching course details with status:", error);
        return res.status(500).json({ message: "Server error." });
    }
};

const getAllPurchasedCourses = async (req, res) => {
    try {
        const userId = req.id;

        const purchasedCourses = await CoursePurchase.find({
            userId: userId,
            status: 'completed'
        }).populate({
            path: 'courseId',
            model: 'Course',
            populate: {
                path: 'creator',
                model: 'User',
                select: 'name'
            }
        });

        const courses = purchasedCourses.map(purchase => purchase.courseId);

        return res.status(200).json({
            success: true,
            message: "Successfully fetched all purchased courses.",
            courses,
        });

    } catch (error) {
        console.error("Error fetching purchased courses:", error);
        return res.status(500).json({ message: "Server error." });
    }
};

module.exports = {
    createCheckoutSession,
    webhook,
    getCourseDetailWithPurchaseStatus,
    getAllPurchasedCourses
};