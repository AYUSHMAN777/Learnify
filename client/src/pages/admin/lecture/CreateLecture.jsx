import { Button } from '@/components/ui/button';
import { useCreateLectureMutation, useGetCourseLectureQuery } from '@/features/api/courseApi';
import { Loader2, PlusCircle, ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Lecture from './Lecture';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CreateLecture = () => {
    const [lectureTitle, setLectureTitle] = useState("");
    const params = useParams();
    const courseId = params.courseId;
    const navigate = useNavigate();

    const [createLecture, { data, isLoading, isSuccess, error }] = useCreateLectureMutation();
    const { data: lectureData, isLoading: isLectureLoading, isError: isLectureError, refetch } = useGetCourseLectureQuery(courseId);

    const createLectureHandler = async (e) => {
        e.preventDefault();
        if (!lectureTitle) {
            toast.error("Please enter a lecture title");
            return;
        }
        await createLecture({ courseId, lectureTitle });
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Lecture created successfully");
            setLectureTitle(""); // Clear input after successful creation
            refetch(); // Refetch the lecture list
        }
        if (error) {
            toast.error(error?.data?.message || "Failed to create lecture");
        }
    }, [isSuccess, error, data, refetch]);

    return (
        <div className="space-y-8 md:mt-15">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Lectures</h1>
                <Button variant='outline' onClick={() => navigate(`/admin/course/${courseId}`)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Course Settings
                </Button>
            </div>

            {/* Create Lecture Card */}
            <Card className="dark:bg-gray-800 shadow-md">
                <CardHeader>
                    <CardTitle>Create a New Lecture</CardTitle>
                    <CardDescription>Enter a title for your new lecture below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={createLectureHandler} className="space-y-4">
                        <div>
                            <Label htmlFor="lectureTitle" className="font-medium pb-1">Lecture Title</Label>
                            <Input
                                type="text"
                                id="lectureTitle"
                                value={lectureTitle}
                                onChange={(e) => setLectureTitle(e.target.value)}
                                placeholder="e.g., Introduction to React"
                                className="w-full mt-1 dark:bg-gray-700"
                            />
                        </div>
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 text-white hover:bg-blue-700">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Create Lecture
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Existing Lectures List */}
            <Card className="dark:bg-gray-800 shadow-md">
                <CardHeader>
                    <CardTitle>Existing Lectures</CardTitle>
                    <CardDescription>View and manage lectures for this course.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='space-y-2'>
                        {isLectureLoading ? (
                            <p>Loading lectures...</p>
                        ) : isLectureError ? (
                            <p className="text-red-500">Failed to load lectures.</p>
                        ) : lectureData?.lectures?.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400">No lectures have been added to this course yet.</p>
                        ) : (
                            lectureData?.lectures?.map((lecture, index) => (
                                <Lecture key={lecture._id} index={index} courseId={courseId} lecture={lecture} />
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateLecture;