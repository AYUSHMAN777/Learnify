import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import Course from './Course';
import { useLoadUserQuery, useUpdateUserMutation } from '@/features/api/authApi';
import { toast } from 'sonner';

const MyProfile = () => {
    const [name, setName] = useState("");
    const [photoUrl, setPhotoUrl] = useState(null);

    const { data, isLoading, refetch } = useLoadUserQuery();
    const [updateUser, { data: updateUserData, isLoading: updateUserisLoading, error, isSuccess, isError }] = useUpdateUserMutation();

    useEffect(() => {
        if (data?.user) {
            setName(data.user.name);
        }
    }, [data]);

    useEffect(() => {
        if (isSuccess) {
            refetch();
            toast.success(updateUserData?.message || "Profile Updated Successfully");
        }
        if (isError) {
            toast.error(error?.data?.message || "Failed to update profile");
        }
    }, [isSuccess, isError, error, updateUserData, refetch]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#101828]">
                <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
            </div>
        );
    }

    const user = data?.user;

    const onChangehandler = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoUrl(file);
        }
    };

    const updateUserhandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        if (photoUrl) {
            formData.append("profilephoto", photoUrl);
        }
        await updateUser(formData);
    };

    return (
        <div className="bg-[#101828] min-h-screen py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-bold text-3xl text-white text-center md:text-left mb-8">My Profile</h1>
                
                <div className="flex flex-col md:flex-row md:items-start gap-8 bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-6">
                    <div className="flex flex-col items-center w-full md:w-auto md:items-start gap-4 md:min-w-[12rem]">
                        <Avatar className="h-36 w-36 border-4 border-blue-500 shadow-md">
                            <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} alt={user?.name} className="rounded-full" />
                            <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="sm" className="w-full md:w-36 bg-blue-600 text-white hover:bg-blue-700">
                                    Edit Profile
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700 text-white">
                                <DialogHeader>
                                    <DialogTitle>Edit Profile</DialogTitle>
                                    <DialogDescription className="text-gray-400">
                                        Make changes to your profile here. Click save when you're done.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={updateUserhandler} className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right text-gray-300">Name</Label>
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="col-span-3 bg-gray-800 border-gray-600 text-white"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="photo" className="text-right text-gray-300">Photo</Label>
                                        <Input
                                            id="photo"
                                            name="profilephoto"
                                            onChange={onChangehandler}
                                            type="file"
                                            className="col-span-3 bg-gray-800 border-gray-600 text-white file:text-blue-400"
                                            accept="image/*"
                                        />
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <Button type="submit" disabled={updateUserisLoading} className="bg-blue-600 text-white hover:bg-blue-700">
                                            {updateUserisLoading ? (
                                                <>
                                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                                    Saving...
                                                </>
                                            ) : "Save Changes"}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="flex-1 w-full flex flex-col justify-center space-y-4 border-t md:border-t-0 md:border-l border-gray-700 pt-6 md:pt-0 md:pl-8">
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-400 text-sm">Full Name</span>
                            <p className="font-medium text-gray-100 text-lg">{user?.name}</p>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-400 text-sm">Email Address</span>
                            <p className="font-medium text-gray-100 text-lg">{user?.email}</p>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-400 text-sm">Role</span>
                            <p className="font-medium text-gray-100 text-lg">{user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="font-bold text-2xl text-white mb-6">Courses Enrolled</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {user?.enrolledCourses?.length > 0 ? (
                            user.enrolledCourses.map((course) => (
                                <Course course={course} key={course._id} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10 bg-gray-900 rounded-lg">
                                <p className="text-gray-400">You haven't enrolled in any courses yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
