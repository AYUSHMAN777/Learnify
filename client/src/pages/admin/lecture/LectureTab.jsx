import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import React, { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";
import axios from 'axios';
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from '@/features/api/courseApi';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, Trash2 } from 'lucide-react';

function LectureTab() {
    const navigate = useNavigate();
    const MEDIA_API = 'https://learnify-1-sb4f.onrender.com/api/media';

    const [lectureTitle, setLectureTitle] = useState('');
    const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
    const [isFree, setIsFree] = useState(false);
    const [mediaProgress, setMediaProgress] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewVideo, setPreviewVideo] = useState("");

    const params = useParams();
    const { courseId, lectureId } = params;

    const [editlecture, { data, isSuccess, isLoading, error }] = useEditLectureMutation();
    const [removeLecture, { isLoading: isLoadingRemove, isSuccess: isSuccessRemove, error: removeError }] = useRemoveLectureMutation();
    const { data: lectureData, isLoading: isLectureLoading, refetch } = useGetLectureByIdQuery(lectureId);

    const lecture = lectureData?.lecture;

    useEffect(() => {
        if (lecture) {
            setLectureTitle(lecture.lectureTitle);
            setUploadVideoInfo({
                videoUrl: lecture.videoUrl,
                publicId: lecture.publicId
            });
            setPreviewVideo(lecture.videoUrl);
            setIsFree(lecture.isPreview);
        }
    }, [lecture]);

    const editlecturehandler = async (e) => {
        e.preventDefault();
        await editlecture({ courseId, lectureId, videoInfo: uploadVideoInfo, isPreviewFree: isFree, lectureTitle });
    };

    const removelecturehandler = async () => {
        if (window.confirm("Are you sure you want to delete this lecture?")) {
            await removeLecture({ lectureId, courseId });
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Lecture updated successfully");
            refetch();
        }
        if (error) {
            toast.error(error?.data?.message || "Error while updating lecture");
        }
    }, [isSuccess, error, data, refetch]);

    useEffect(() => {
        if (isSuccessRemove) {
            toast.success("Lecture removed successfully");
            navigate(`/admin/course/${courseId}/lecture`);
        }
        if (removeError) {
            toast.error(removeError?.data?.message || "Failed to remove lecture");
        }
    }, [isSuccessRemove, removeError, navigate, courseId]);

    const filechangeHandler = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            setMediaProgress(true);
            setUploadProgress(0);
            try {
                const res = await axios.post(
                    `${MEDIA_API}/upload-video`,
                    formData,
                    {
                        onUploadProgress: ({ loaded, total }) => {
                            const percent = Math.round((loaded * 100) / total);
                            setUploadProgress(percent);
                        }
                    }
                );
                if (res.data.success && res.data.data?.url) {
                    setUploadVideoInfo({ videoUrl: res.data.data.url, publicId: res.data.data.public_id });
                    setPreviewVideo(res.data.data.url);
                    // Only show toast if uploadProgress is 100%
                    if (uploadProgress === 100) {
                        toast.success("Video uploaded successfully");
                    } else {
                        // fallback: show toast anyway if backend says success
                        toast.success("Video uploaded successfully");
                    }
                }
            } catch (error) {
                console.error("Error uploading video:", error);
                toast.error("Failed to upload video.");
            } finally {
                setMediaProgress(false);
            }
        }
    };

    if (isLectureLoading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>;
    }

    return (
        <form onSubmit={editlecturehandler} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="dark:bg-gray-800 shadow-lg">
                        <CardHeader>
                            <CardTitle>Lecture Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="lecture-title">Title</Label>
                                <Input
                                    id="lecture-title"
                                    type="text"
                                    placeholder="Enter lecture title"
                                    onChange={(e) => setLectureTitle(e.target.value)}
                                    value={lectureTitle}
                                    className="mt-1 dark:bg-gray-700"
                                />
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                                <Switch checked={isFree} onCheckedChange={setIsFree} id="is-free-switch" />
                                <Label htmlFor="is-free-switch">Free Preview</Label>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1">
                    <Card className="dark:bg-gray-800 shadow-lg">
                        <CardHeader>
                            <CardTitle>Lecture Video</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {previewVideo && (
                                <div className="aspect-video rounded-md overflow-hidden border">
                                    <video src={previewVideo} controls className="w-full h-full object-cover"></video>
                                </div>
                            )}
                            <div>
                                <Label htmlFor="video-upload">Upload Video</Label>
                                <Input
                                    id="video-upload"
                                    type="file"
                                    accept="video/*"
                                    onChange={filechangeHandler}
                                    className="mt-1 w-full file:text-blue-500"
                                />
                            </div>
                            {mediaProgress && (
                                <div className="flex flex-col items-center justify-center py-4">
                                    <Loader2 className="h-4 w-4 animate-spin text-blue-500 mb-2" />
                                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">Uploading video...</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex justify-between items-center gap-4 pt-6 border-t dark:border-gray-700">
                <Button type="button" variant="destructive" onClick={removelecturehandler} disabled={isLoadingRemove}>
                    {isLoadingRemove ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Remove Lecture
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-blue-600 text-white hover:bg-blue-700">
                    {isLoading ? (
                        <>
                            <Loader2 className='animate-spin mr-2 h-4 w-4' />
                            Saving...
                        </>
                    ) : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}

export default LectureTab;