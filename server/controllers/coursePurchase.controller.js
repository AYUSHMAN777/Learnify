const Stripe = require("stripe");
const Course = require("../models/Coursemodel"); // Assuming you'll need the Course model
const Lecture = require("../models/Lecture"); // Assuming you'll need the Lecture model
const CoursePurchase = require("../models/PurchaseCourse"); // Importing the CoursePurchase model
const stripe = new Stripe(process.env.Secret_key);
const User = require("../models/User"); // Importing the User model
const createCheckoutSession = async (req, res) => {
    try {
        const userId = req.id;
        const { courseId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        //creating a course purchase
        const newPurchase = new CoursePurchase({
            userId: userId,
            courseId: courseId,
            amount: course.coursePrice,
            status: "pending",
        });

        //creating a checkout sessoin
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: course?.courseTitle,
                            images: [course?.courseThumbnail],
                        },
                        unit_amount: course?.coursePrice * 100, // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `http://localhost:5173/course-progress/${courseId}`,
            cancel_url: `http://localhost:5173/course-detail/${courseId}`,
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
        // Save the purchase to the database
        newPurchase.paymentId = session.id; // Store the session ID in the purchase
        await newPurchase.save();

        // Return the session URL to the client
        res.status(200).json({
            success: true,
            message: "Checkout session created succesfully",
            url: session.url
        });

    } catch (error) {
        console.log(error);
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
    //handle the checkout session completed event
    if (event.type === "checkout.session.completed") {
        try {
            const session = event.data.object;

            const purchase = await CoursePurchase.findOne({
                paymentId: session.id,
            }).populate({ path: "courseId" });

            if (!purchase) {
                return res.status(404).json({ message: "Purchase not found" });
            }

            if (session.amount_total) {
                purchase.amount = session.amount_total / 100;
            }
            purchase.status = "completed";

            //make all lectures visible by setting ispreviewfree to true
            if (purchase.courseId && purchase.courseId.lectures.length > 0) {
                await Lecture.updateMany(
                    { _id: { $in: purchase.courseId.lectures } },
                    { $set: { isPreview: true } }//doubt 
                )
            }

            await purchase.save();

            //update user's enrolled course
            await User.findByIdAndUpdate(
                purchase.userId,
                { $addToSet: { enrolledCourses: purchase.courseId._id } },
                { new: true },
            );

            //update course to user id to enrolledstudents

            await Course.findByIdAndUpdate(
                purchase.courseId._id,
                { $addToSet: { enrolledStudents: purchase.userId } },
                { new: true }
            );

        } catch (error) {
            console.log("Error handling event", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    res.status(200).json({ received: true });

}


const getCourseDetailWithPurchaseStatus = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id; // From isAuthenticated middleware

        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required." });
        }

        // 1. Find the course and populate its details
        const course = await Course.findById(courseId)
            .populate({
                path: 'creator',
                // select: 'name photoUrl' // Select only the fields you need
            })
            .populate({
                path: 'lectures'
            });

        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }

        // 2. Check for a completed purchase record for this user and course
        const purchase = await CoursePurchase.findOne({
            userId: userId,//agr userid aru courseid purchase model me that mean course is purchased
            courseId: courseId,
            status: 'completed'
        });

        // 3. Determine the purchase status
        const isPurchased = !!purchase; // Convert the result to a boolean (true if found, false if not)

        // 4. Return the combined data
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
        const userId = req.id; // From isAuthenticated middleware

        // 1. Find all purchase records for the user with 'completed' status
        const purchasedCourse = await CoursePurchase.find({
            // userId: userId,
            status: 'completed'
        }).populate({
            path: 'courseId', // 2. Populate the course details for each purchase
            model: 'Course', // Explicitly specify the model name
            populate: { // Nested populate to get the creator's name
                path: 'creator',
                model: 'User',
                select: 'name'
            }
        });
        if(!purchasedCourse){
            return res.status(404).json({
                purchasedCourse:[],
            });
        }
        // Extract just the course details from the purchase records
        // const courses = purchasedCourse.map(purchase => purchase.courseId);

        // 3. Return the list of populated courses
        return res.status(200).json({
            success: true,
            message: "Successfully fetched all purchased courses.",
            purchasedCourse
            // courses,
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

