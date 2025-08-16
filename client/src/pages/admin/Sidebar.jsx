import { ChartNoAxesColumn, SquareLibrary, Menu } from "lucide-react";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
    return (
        <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-950">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex flex-col w-[250px] border-r border-gray-200 dark:border-gray-700 dark:bg-gray-900 bg-gray-50 h-screen sticky top-0 pt-16">
                <div className="flex flex-col gap-2 p-4">
                    <Link to='dashboard' className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-800 p-3 rounded-lg transition-colors duration-200">
                        <ChartNoAxesColumn size={22} />
                        <span className="text-base font-medium">Dashboard</span>
                    </Link>
                    <Link to='course' className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-800 p-3 rounded-lg transition-colors duration-200">
                        <SquareLibrary size={22} />
                        <span className="text-base font-medium">Courses</span>
                    </Link>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1">
                {/* Mobile Header with Hamburger Menu */}
                <header className="flex h-16 items-center gap-4 border-b bg-white dark:bg-gray-900 px-6 lg:hidden sticky top-16 z-10">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col dark:bg-gray-900">
                            <SheetHeader className="sr-only">
                                <SheetTitle>Navigation Menu</SheetTitle>
                                <SheetDescription>
                                    Links to navigate through the admin dashboard sections.
                                </SheetDescription>
                            </SheetHeader>
                            <nav className="grid gap-2 text-lg font-medium mt-16">
                                <Link to='dashboard' className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600">
                                    <ChartNoAxesColumn className="h-5 w-5" />
                                    Dashboard
                                </Link>
                                <Link to='course' className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600">
                                    <SquareLibrary className="h-5 w-5" />
                                    Courses
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                     <h1 className="font-semibold text-lg">Admin Dashboard</h1>
                </header>
                
                <main className="flex-1 p-6 md:p-8 pt-24 lg:pt-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Sidebar;