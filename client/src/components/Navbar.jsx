import { Menu, School } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import React, { useEffect } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuShortcut
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import DarkMode from '../DarkMode'
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { useLoadUserQuery, useLogoutUserMutation } from '@/features/api/authApi';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

function Navbar() {

    const { user } = useSelector(state => state.auth);

    const [logoutUser, { data, isSuccess, }] = useLogoutUserMutation();
    // const [isLoading]=useLoadUserQuery();

    const logoutHandler = async () => {
        await logoutUser();
    };

    const navigate = useNavigate();
    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message || `User logged out successfully!`)
            navigate('/login');
        };
    }, [isSuccess]);

    return (
        <div className='h-16 dark:bg-gray-900 bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10 '>
            {/*/Desktop Navbar */}
            <div className='max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 p-5'>
                <Link to="/">
                    <div className='flex items-center gap-2'>
                        <School size={"30"} className="text-blue-600" />
                        <h1 className='text-2xl font-extrabold hidden md:block text-gray-800 dark:text-white'>E-Learning</h1>
                    </div>
                </Link>
                <div className='flex items-center gap-5'>
                    {user ? (
                        <DropdownMenu>

                            <DropdownMenuTrigger asChild>
                                <Avatar >
                                    <AvatarImage className='w-10 h-10 cursor-pointer rounded-full' src={user?.photoUrl || "https://github.com/shadcn.png"} alt="@shadcn" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem><Link to="/my-learning">My Learning</Link></DropdownMenuItem>
                                <DropdownMenuItem><Link to="/profile">Edit Profile</Link></DropdownMenuItem>

                                <DropdownMenuItem onClick={logoutHandler} >Log out</DropdownMenuItem>
                                {(user?.role === 'instructor' || user?.role === 'student') && (
                                    <DropdownMenuItem><Link to="/admin/dashboard">DashBoard</Link></DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>) : (
                        <div className='flex items-center gap-2'>
                            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white" onClick={() => navigate("/login")}>Login</Button>
                            <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => navigate("/login")}>Signup</Button>
                        </div>
                    )}
                    <DarkMode />
                </div>
            </div>
            {/* Mobile Navbar */}
            <div className=' md:hidden flex justify-between items-center h-full px-4'>
                <Link to='/' className='font-extrabold text-2xl'>E-Learning</Link>
                <MobileNavbar user={user} />
            </div>
        </div>


    )
}
function MobileNavbar({ user }) {

    const navigate = useNavigate();
    const [logoutUser, { data, isSuccess, }] = useLogoutUserMutation();


    const logoutHandler = async () => {
        await logoutUser();
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size='icon' className='rounded-full hover:bg-gray-200 dark:hover:bg-gray-800' variant='outline'>
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent className=" flex flex-col h-full p-0 dark:bg-gray-900">
                {/* Top Section */}
                <div>
                    <div className="flex flex-col gap-2 px-4 pt-4 pb-2 border-b dark:border-gray-800">
                        <h1 className="font-extrabold text-2xl" onClick={() => navigate("/")} cursor-pointer>E-Learning</h1>
                        <DarkMode />
                    </div>
                    {/* Menu Items */}
                    <div className="flex flex-col gap-2 px-4 pt-6">
                        <Button variant="ghost" className="justify-start w-full" > <Link to='/my-learning'>My Learning</Link></Button>
                        <Button variant="ghost" className="justify-start w-full"><Link to='/profile'>Edit Profile</Link></Button>
                        <Button variant="ghost" className="justify-start w-full" onClick={logoutHandler}>Log out</Button>
                        {(user?.role === 'instructor' || user?.role === 'student' )&& (
                            <Button className="justify-start w-full" variant="default"><Link to="/admin/dashboard">Dashboard</Link></Button>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
export default Navbar;