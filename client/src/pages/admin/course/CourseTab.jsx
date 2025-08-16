import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEditCourseMutation, useGetCourseByIdQuery, useRemoveCourseMutation, useTogglePublishCourseMutation } from "@/features/api/courseApi";
import { Loader2, Trash2, Eye, EyeOff, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseTab = () => {
    const [input, setInput] = useState({
        courseTitle: "",
        subTitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: "",
        courseThumbnail: "",
    });
    const params = useParams();
    const courseId = params.courseId;
    const [previewthumbnail, setPreviewThumbnail] = useState("");
    const [editCourse, { data, isLoading, isSuccess, error }] = useEditCourseMutation();
    const { data: courseByIdData, isLoading: isCourseByIdLoading, refetch } = useGetCourseByIdQuery(courseId);
    const [togglePublishCourse] = useTogglePublishCourseMutation();
    const navigate = useNavigate();
    const [removeCourse, { isLoading: isRemovingCourse }] = useRemoveCourseMutation();
    const course = courseByIdData?.course || {};

    useEffect(() => {
        if (course) {
            setInput({
                courseTitle: course.courseTitle || "",
                subTitle: course.subTitle || "",
                description: course.description || "",
                category: course.category || "",
                courseLevel: course.courseLevel || "",
                coursePrice: course.coursePrice || "",
                courseThumbnail: course.courseThumbnail || "",
            });
            setPreviewThumbnail(course.courseThumbnail);
        }
    }, [course]);

    const publishStatusHandler = async (action) => {
        try {
            await togglePublishCourse({ courseId, query: action }).unwrap();
            toast.success(`Course ${action === "true" ? "published" : "unpublished"} successfully`);
            refetch(); // Refetch course data to update the UI
        } catch (err) {
            toast.error("Failed to update course status");
            console.error(err);
        }
    };

    const changeEventhandler = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setInput((prev) => ({ ...prev, [name]: value }));
    };

    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput((prev) => ({ ...prev, courseThumbnail: file }));
            const fileReader = new FileReader();
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
            fileReader.readAsDataURL(file);
        }
    };

    const updatehandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(input).forEach(key => {
            formData.append(key, input[key]);
        });
        await editCourse({ formData, courseId });
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Course updated successfully");
        }
        if (error) {
            toast.error(error?.data?.message || "Error updating course");
        }
    }, [isSuccess, error, data]);

    if (isCourseByIdLoading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6 mt-2 md:mt-17">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Manage Lectures</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Add or edit the lectures for this course.</p>
                </div>
                <Button asChild className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto">
                    <Link to={`/admin/course/${courseId}/lecture/`}>
                       <PlusCircle className="mr-2 h-4 w-4"/> Go to Lectures
                    </Link>
                </Button>
            </div>
            <Card className="dark:bg-gray-800 shadow-lg">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle>Course Information</CardTitle>
                        <CardDescription>Edit the details of your course below.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant={course?.isPublished ? "outline" : "default"}
                            disabled={course?.lectures?.length === 0}
                            onClick={() => publishStatusHandler(course.isPublished ? "false" : "true")}
                            className={course?.isPublished ? "border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white" : "bg-green-600 text-white hover:bg-green-700"}
                        >
                            {course?.isPublished ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                            {course?.isPublished ? "Unpublish" : "Publish"}
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={isRemovingCourse}
                            onClick={async () => {
                                if (window.confirm("Are you sure you want to remove this course?")) {
                                    try {
                                        await removeCourse(courseId).unwrap();
                                        toast.success("Course removed successfully");
                                        navigate("/admin/course");
                                    } catch (err) {
                                        toast.error("Failed to remove course");
                                    }
                                }
                            }}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Remove
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={updatehandler} className="space-y-8 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <div>
                                    <Label htmlFor="courseTitle">Title</Label>
                                    <Input id="courseTitle" type="text" value={input.courseTitle} onChange={changeEventhandler} placeholder="Enter course title" name='courseTitle' className="mt-1 dark:bg-gray-700" />
                                </div>
                                <div>
                                    <Label htmlFor="subTitle">Subtitle</Label>
                                    <Input id="subTitle" type="text" placeholder="e.g., Become a Full Stack Developer" name='subTitle' value={input.subTitle} onChange={changeEventhandler} className="mt-1 dark:bg-gray-700" />
                                </div>
                                <div >
                                    <Label className="pb-2" >Description</Label>
                                    <RichTextEditor input={input} setInput={setInput} />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <Label>Category</Label>
                                        <Select value={input.category} onValueChange={(value) => handleSelectChange('category', value)}>
                                            <SelectTrigger className="mt-1 dark:bg-gray-700"><SelectValue placeholder="Select a category" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="nextjs">NextJs</SelectItem>
                                                    <SelectItem value="react">React</SelectItem>
                                                    <SelectItem value="mern-stack">MERN Stack</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Course Level</Label>
                                        <Select value={input.courseLevel} onValueChange={(value) => handleSelectChange('courseLevel', value)}>
                                            <SelectTrigger className="mt-1 dark:bg-gray-700"><SelectValue placeholder="Select level" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="beginner">Beginner</SelectItem>
                                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                                    <SelectItem value="advance">Advance</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="coursePrice">Price (INR)</Label>
                                    <Input id="coursePrice" type="number" name="coursePrice" value={input.coursePrice} onChange={changeEventhandler} placeholder="Enter price in INR" className="mt-1 dark:bg-gray-700" />
                                </div>
                                <div>
                                    <Label>Course Thumbnail</Label>
                                    <Input type="file" name="courseThumbnail" accept="image/*" onChange={selectThumbnail} className="mt-1 file:text-blue-500" />
                                    {previewthumbnail && (
                                        <div className="mt-4">
                                            <img src={previewthumbnail} alt="Thumbnail Preview" className="w-full h-40 object-cover rounded-md border" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end items-center gap-4 pt-6 border-t dark:border-gray-700">
                            <Button type="button" variant='outline' onClick={() => navigate("/admin/course")}>Cancel</Button>
                            <Button type="submit" disabled={isLoading} className="bg-blue-600 text-white hover:bg-blue-700">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                    </>
                                ) : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CourseTab;