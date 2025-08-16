import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { Badge } from "@/components/ui/badge"
import { Link } from 'react-router-dom'

function Course({ course }) {
    return (
        <Link to={`/course-detail/${course._id}`}>
            <Card className="overflow-hidden pt-0 rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                <div className='relative'>
                    {/* Image at the top */}
                    <img
                        src={course.courseThumbnail || "https://via.placeholder.com/250x125.png?text=Course+Thumbnail"}
                        alt="Course Thumbnail"
                        className="w-full h-32 object-fit"
                    />
                </div>
                <CardContent className="px-4 pb-2">
                    <h1 className="font-bold truncate text-lg mb-2 text-gray-800 dark:text-white">
                        {course.courseTitle}
                    </h1>
                    {/* Teacher info row */}
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                            <Avatar className='h-8 w-8'>
                                <AvatarImage className='w-8 h-8 cursor-pointer rounded-full' src={course.creator?.photoUrl || "https://via.placeholder.com/32x32.png?text=User"} alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <h1 className="font-medium text-sm  text-gray-600 dark:text-white">{course.creator?.name || "Unknown"}</h1>
                        </div>
                        <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                        >
                            {course?.courseLevel}
                        </Badge>
                    </div>
                    <div className='text-lg font-bold text-gray-800 dark:text-white mt-2'>
                        <span>&#8377; {course?.coursePrice || 0}</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default Course