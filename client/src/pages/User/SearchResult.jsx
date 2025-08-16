import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const SearchResult = ({ course }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 p-4 transition-shadow hover:shadow-lg">
            <div className="flex flex-col md:flex-row items-start gap-6">
                <Link to={`/course-detail/${course._id}`} className="w-full md:w-64 flex-shrink-0">
                    <img
                        src={course.courseThumbnail || "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20230725210922/dsa-self-paced-thumbnail.png"}
                        alt={course.courseTitle}
                        className="h-40 w-full object-fit rounded-lg hover:opacity-90 transition-opacity"
                    />
                </Link>
                <div className="flex-1 flex flex-col gap-1">
                    <Link to={`/course-detail/${course._id}`}>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white hover:text-blue-600 transition-colors">
                            {course.courseTitle}
                        </h1>
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{course.subTitle}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Instructor: {course.creator.name}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="border-blue-500 text-blue-600">{course.courseLevel}</Badge>
                    </div>
                </div>
                <div className='mt-4 md:mt-0 md:text-right w-full md:w-auto'>
                    <h1 className='text-2xl font-semibold text-gray-800 dark:text-white'>₹{course.coursePrice}</h1>
                </div>
            </div>
        </div>
    );
};

export default SearchResult;