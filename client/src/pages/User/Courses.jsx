import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import Course from './Course';
import { useGetPublishedCoursesQuery } from '@/features/api/courseApi';

// const courses = [1, 2, 3, 4, 5, 6, 7, 8];
const Courses = () => {
    // const isLoading = false;
    const { data, isLoading, isSuccess, isError } = useGetPublishedCoursesQuery();
    if (isError) {
        return <div className='text-red-500 text-center'>Error fetching courses</div>
    }
    // console.log(data);
    return (
        <div className='bg-gray-50 dark:bg-gray-900'>
            <div className='max-w-7xl mx-auto p-8'>
                <h2 className='font-bold text-3xl text-center mb-10 text-gray-800 dark:text-white'>Our Courses</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
                    {
                        isLoading ? Array.from({ length: 8 }).map((_, index) => (
                            <CourseSkeleton key={index} />
                        )) : (
                            data?.courses.map((course, index) => (
                                  <Course key={index} course={course} />
                            ))
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Courses;



export function CourseSkeleton() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-40 w-full rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    )
}