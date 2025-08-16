import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetAllAdminCoursesQuery } from "@/features/api/courseApi";
import { Edit, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CourseTable() {
    const navigate = useNavigate();
    const { data, isLoading, error, refetch } = useGetAllAdminCoursesQuery();

    // Refetch when the component mounts or data changes
    useEffect(() => {
        refetch();
    }, [refetch]);

    if (isLoading) return <div className="text-center py-10"><h1>Loading...</h1></div>;
    if (error) return <div className="text-center py-10"><h1 className="text-red-500">Failed to load courses</h1></div>;

    return (
        <div className="space-y-8 h-[calc(100vh-4rem)] flex flex-col mt-16 z-1">
            {/* Top Bar (no sticky, but with z-index and background) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 z-1 p-6 rounded-2xl shadow">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Your Courses</h1>
                <Button onClick={() => navigate(`create`)} className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Course
                </Button>
            </div>
            
            {/* Scrollable Table/List */}
            <div className="flex-1 overflow-y-auto">
                {/* Desktop Table */}
                <Card className="hidden md:block dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle>All Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Title</th>
                                        <th scope="col" className="px-6 py-3">Price</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                        <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.courses.map((course) => (
                                        <tr key={course._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {course?.courseTitle}
                                            </td>
                                            <td className="px-6 py-4">
                                                ₹{course?.coursePrice || "Free"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={course?.isPublished ? "default" : "secondary"} className={course?.isPublished ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                                                    {course?.isPublished ? "Published" : "Draft"}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button size='sm' variant='ghost' onClick={() => navigate(`${course._id}`)} className="text-blue-600 hover:text-blue-800">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Mobile Card List */}
                <div className="grid gap-4 md:hidden">
                    {data?.courses.map((course) => (
                        <Card key={course._id} className="dark:bg-gray-800">
                            <CardHeader>
                                <CardTitle>{course?.courseTitle}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400 font-medium">Price:</span>
                                    <span>₹{course?.coursePrice || "Free"}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 dark:text-gray-400 font-medium">Status:</span>
                                    <Badge variant={course?.isPublished ? "default" : "secondary"} className={course?.isPublished ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                                        {course?.isPublished ? "Published" : "Draft"}
                                    </Badge>
                                </div>
                                <Button size='sm' variant='outline' onClick={() => navigate(`${course._id}`)} className="w-full mt-4 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                                    <Edit className="mr-2 h-4 w-4" /> Edit Course
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}