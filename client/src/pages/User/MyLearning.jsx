import React from 'react';
import Course from './Course';
import { useLoadUserQuery } from '@/features/api/authApi';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen } from 'lucide-react';

// Updated skeleton loader for courses
const MyLearningSkeleton = () => (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        {[...Array(3)].map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-40 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700" />
                </div>
            </div>
        ))}
    </div>
);

const MyLearning = () => {
    const { data, isLoading } = useLoadUserQuery();
    const myLearningCourses = data?.user?.enrolledCourses || [];

    return (
        <div className='dark:bg-[#101828] max-w-7xl mx-auto my-24 px-4 sm:px-6 lg:px-8'>
            <h1 className='font-bold text-3xl text-gray-800 dark:text-white mb-8'>My Learning</h1>
            <div className='my-5'>
                {
                    isLoading ? (
                        <MyLearningSkeleton />
                    ) : myLearningCourses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <BookOpen className="h-16 w-16 text-blue-500 mb-4" />
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">Your learning journey awaits!</h2>
                            <p className="text-gray-600 dark:text-gray-400">You are not enrolled in any courses yet.</p>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                            {myLearningCourses.map((course) => (
                                <Course key={course._id} course={course} />
                            ))}
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default MyLearning;