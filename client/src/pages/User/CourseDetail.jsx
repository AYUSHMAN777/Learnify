import React from "react";
import { BadgeInfo, PlayCircle, Lock, BookOpen, BarChart } from "lucide-react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCourseDetailWithPurchaseStatusQuery } from "@/features/api/purchaseApi";
import { Skeleton } from "@/components/ui/skeleton";

const CourseDetail = () => {
    const params = useParams();
    const courseId = params.courseId;
    const navigate = useNavigate();
    const { data: courseDetail, isLoading: courseLoading, isError } = useGetCourseDetailWithPurchaseStatusQuery(courseId);

    const course = courseDetail?.course;
    const isPurchased = courseDetail?.isPurchased;
    const videoUrl = course?.lectures?.[0]?.videoUrl;

    const handleContinueCourse = () => {
        if (isPurchased) {
            navigate(`/course-progress/${courseId}`);
        }
    };

    if (courseLoading) {
        return <CourseDetailSkeleton />;
    }

    if (isError || !course) {
        return <div className="text-center py-20 text-red-500">Error: Course not found.</div>;
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-950">
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-gray-900 text-white pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col gap-3">
                    <h1 className="font-bold text-3xl md:text-4xl">{course.courseTitle}</h1>
                    <p className="text-lg md:text-xl text-blue-200">{course.subTitle}</p>
                    <p>Created By <span className="text-blue-300 underline italic">{course.creator.name}</span></p>
                    <div className="flex items-center gap-4 text-sm mt-2">
                        <div className="flex items-center gap-2">
                            <BadgeInfo size={16} />
                            <span>Last updated {new Date(course.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span>•</span>
                        <span>{course.enrolledStudents.length || 0} students enrolled</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto my-8 px-4 md:px-8 flex flex-col lg:flex-row gap-8">
                {/* Left Column */}
                <div className="w-full lg:w-2/3 space-y-8">
                    {/* Description Section */}
                    <Card className="dark:bg-gray-800 shadow-lg">
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: course.description }} />
                        </CardContent>
                    </Card>

                    {/* Course Content Card Section */}
                    <Card className="dark:bg-gray-800 shadow-lg">
                        <CardHeader>
                            <CardTitle>Course Content</CardTitle>
                            <CardDescription>{course.lectures.length} Lectures</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            {course.lectures.map((lecture, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 border-b dark:border-gray-700 last:border-b-0">
                                    <div className="flex items-center gap-3">
                                        <span>
                                            {isPurchased || lecture.isPreview ? (
                                                <PlayCircle className="text-blue-500" size={18} />
                                            ) : (
                                                <Lock className="text-gray-500" size={18} />
                                            )}
                                        </span>
                                        <span className="font-medium dark:text-gray-200">{lecture.lectureTitle}</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column (Floating Card) */}
                <div className="w-full lg:w-1/3 lg:sticky top-24 h-auto">
                    <Card className="overflow-hidden dark:bg-gray-800 shadow-lg">
                        <CardContent className="p-0 flex flex-col">
                            <div className="w-full aspect-video mt-[-25px] bg-gray-900 flex items-center justify-center text-white rounded-t-lg overflow-hidden">
                                {videoUrl ? (
                                    <video
                                        key={videoUrl}
                                        src={videoUrl}
                                        controls
                                        className="w-full h-full object-cover bg-black "
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <p>No video preview available.</p>
                                )}
                            </div>
                            <div className="p-2 space-y-2">
                                <h2 className="font-semibold truncate text-lg dark:text-white pl-2">
                                    LectureTitle : {course.lectures[0]?.lectureTitle || 'Course Preview'}
                                </h2>
                                <Separator />
                                <h1 className="text-2xl font-bold dark:text-white mb-[-15px] pl-2">
                                    {!isPurchased ? (
                                        <>Price: <span className="text-blue-600">₹{course.coursePrice}</span></>
                                    ) : (
                                        <span className="text-blue-500">Purchased</span>
                                    )}
                                </h1>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center p-4 border-t dark:border-gray-700">
                            {isPurchased ? (
                                <Button onClick={handleContinueCourse} className="w-full bg-blue-600 text-white hover:bg-blue-700">Continue Course</Button>
                            ) : (
                                <BuyCourseButton className="w-full bg-blue-600 text-white hover:bg-blue-700" courseId={courseId} />
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// Skeleton component for loading state
const CourseDetailSkeleton = () => (
    <div>
        <div className="bg-gray-200 dark:bg-gray-800 h-56 w-full pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Skeleton className="h-12 w-3/4 mb-4" />
                <Skeleton className="h-6 w-1/2" />
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
                <div className="lg:col-span-2 space-y-10">
                    <Skeleton className="h-40 w-full rounded-lg" />
                    <Skeleton className="h-64 w-full rounded-lg" />
                </div>
                <div className="mt-10 lg:mt-0">
                    <Skeleton className="h-96 w-full rounded-lg" />
                </div>
            </div>
        </div>
    </div>
);


export default CourseDetail;