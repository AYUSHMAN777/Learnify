import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, CirclePlay, Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useGetCourseProgressQuery, useMarkAsCompletedMutation, useMarkAsIncompleteMutation, useUpdateLectureProgressMutation } from '@/features/api/courseProgressApi';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const CourseProgress = () => {
    const { courseId } = useParams();
    const [currentLecture, setCurrentLecture] = useState(null);

    const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);
    const [updateLectureProgress] = useUpdateLectureProgressMutation();
    const [markAsCompleted, { isLoading: isCompleting }] = useMarkAsCompletedMutation();
    const [markAsIncomplete, { isLoading: isIncompleting }] = useMarkAsIncompleteMutation();

    useEffect(() => {
        if (data?.data && !currentLecture) {
            setCurrentLecture(data.data.courseDetails?.lectures?.[0] || null);
        }
    }, [data, currentLecture]);

    useEffect(() => {
        refetch();
    }, [courseId, refetch]);

    if (isLoading) {
        return <CourseProgressSkeleton />;
    }
    if (isError || !data?.data) {
        return <div className="text-center py-20 text-red-500">Error loading course progress.</div>;
    }

    const { courseDetails, progress, completed } = data.data;

    const isLectureCompleted = (lectureId) => {
        return progress.some((lp) => lp.lectureId === lectureId && lp.viewed);
    };

    const handleSelectLecture = (lecture) => {
        setCurrentLecture(lecture);
        if (!isLectureCompleted(lecture._id)) {
            updateLectureProgress({ courseId, lectureId: lecture._id });
        }
    };

    const handleMarkAsCompleted = async () => {
        try {
            await markAsCompleted(courseId).unwrap();
            toast.success("Course marked as complete!");
        } catch (err) {
            toast.error("Failed to mark course as complete.");
        }
    };

    const handleMarkAsIncomplete = async () => {
        try {
            await markAsIncomplete(courseId).unwrap();
            toast.info("Course progress has been reset.");
        } catch (err) {
            toast.error("Failed to reset course progress.");
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen mt-15">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">{courseDetails?.courseTitle}</h1>
                    {completed ? (
                        <Button variant="outline" onClick={handleMarkAsIncomplete} disabled={isIncompleting}>
                            {isIncompleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Mark as Incomplete
                        </Button>
                    ) : (
                        <Button onClick={handleMarkAsCompleted} disabled={isCompleting} className="bg-blue-600 text-white hover:bg-blue-700">
                            {isCompleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Mark as Completed
                        </Button>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content: Video Player */}
                    <div className="flex-1 lg:w-3/4">
                        <div className="sticky top-20">
                            <div className="aspect-video bg-black rounded-lg shadow-lg flex items-center justify-center text-white">
                                {currentLecture?.videoUrl ? (
                                    <video
                                        key={currentLecture._id}
                                        src={currentLecture.videoUrl}
                                        controls
                                        autoPlay
                                        width="100%"
                                        height="100%"
                                        className="rounded-lg"
                                    />
                                ) : (
                                    <p>No video available for this lecture.</p>
                                )}
                            </div>
                            <h3 className="font-bold text-xl lg:text-2xl mt-4 dark:text-white">
                                Lecture Title :   {currentLecture?.lectureTitle}
                            </h3>
                        </div>
                    </div>

                    {/* Sidebar: Lecture List */}
                    <div className="w-full lg:w-1/4">
                        <Card className="dark:bg-gray-800 shadow-lg">
                            <CardHeader>
                                <CardTitle>Course Lectures</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col overflow-y-auto max-h-[60vh] p-2">
                                {courseDetails?.lectures?.map((lecture) => {
                                    const isCompleted = isLectureCompleted(lecture._id);
                                    const isActive = currentLecture?._id === lecture._id;
                                    return (
                                        <div
                                            onClick={() => handleSelectLecture(lecture)}
                                            key={lecture._id}
                                            className={`flex items-center justify-between p-3 mb-2 rounded-lg cursor-pointer transition-colors duration-200 ${isActive
                                                ? 'bg-blue-100 dark:bg-blue-900'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {isCompleted ? (
                                                    <CheckCircle2 size={20} className="text-green-500" />
                                                ) : (
                                                    <CirclePlay size={20} className="text-gray-500" />
                                                )}
                                                <span className={`font-medium ${isActive ? 'text-blue-700 dark:text-blue-300' : 'dark:text-gray-200'}`}>{lecture.lectureTitle}</span>
                                            </div>
                                            {isCompleted && (
                                                <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                                    Done
                                                </Badge>
                                            )}
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Skeleton Loader
const CourseProgressSkeleton = () => (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Skeleton className="h-10 w-3/4 mb-6" />
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 lg:w-3/4">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <Skeleton className="h-8 w-1/2 mt-4" />
            </div>
            <div className="w-full lg:w-1/4">
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default CourseProgress;