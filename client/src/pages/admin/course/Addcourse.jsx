import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import { Loader2, PlusCircle, ArrowLeft } from 'lucide-react';
import { useCreateCourseMutation } from '@/features/api/courseApi';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Addcourse = () => {
    const [courseTitle, setCourseTitle] = useState("");
    const [category, setCategory] = useState("");
    const navigate = useNavigate();

    const [createCourse, { data, isLoading, error, isSuccess }] = useCreateCourseMutation();

    const createCoursehandler = async (e) => {
        e.preventDefault();
        if (!courseTitle || !category) {
            toast.error("Please provide both a title and a category.");
            return;
        }
        await createCourse({ courseTitle, category });
    };

    const getselectCategory = (value) => {
        setCategory(value);
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Course Created Successfully");
            navigate('/admin/course');
        }
        if (error) {
            toast.error(error?.data?.message || "Something went wrong");
        }
    }, [isSuccess, error, data, navigate]);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Create New Course</h1>
            </div>

            <Card className="max-w-2xl mx-auto dark:bg-gray-800 shadow-lg">
                <CardHeader>
                    <CardTitle>Course Details</CardTitle>
                    <CardDescription>Enter the title and category to start creating your course.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={createCoursehandler} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="courseTitle" className="font-medium">Course Title</Label>
                            <Input
                                id="courseTitle"
                                type="text"
                                value={courseTitle}
                                onChange={(e) => setCourseTitle(e.target.value)}
                                placeholder="e.g., The Ultimate React Masterclass"
                                className="dark:bg-gray-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category" className="font-medium">Category</Label>
                            <Select onValueChange={getselectCategory} value={category}>
                                <SelectTrigger className="w-full dark:bg-gray-700">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Web Development</SelectLabel>
                                        <SelectItem value="nextjs">Next.js</SelectItem>
                                        <SelectItem value="react">React</SelectItem>
                                        <SelectItem value="mern-stack">MERN Stack</SelectItem>
                                        <SelectItem value="frontend">Frontend</SelectItem>
                                        <SelectItem value="backend">Backend</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='flex items-center gap-4 pt-4'>
                            <Button type="button" variant='outline' onClick={() => navigate('/admin/course')}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading} className="bg-blue-600 text-white hover:bg-blue-700">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Create Course
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Addcourse;