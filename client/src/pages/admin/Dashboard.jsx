import React from 'react';
import { useGetAllPurchasedCoursesQuery } from '@/features/api/purchaseApi'; // Assuming this hook fetches all purchase data for the admin
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { DollarSign, ShoppingCart } from 'lucide-react';

const Dashboard = () => {
    // Fetching data
    const { data, isSuccess, isError, isLoading } = useGetAllPurchasedCoursesQuery();

    // Loading and error states
    if (isLoading) return <h1>Loading...</h1>;
    if (isError) return <h1 className="text-red-500">Failed to get purchased courses</h1>;

    // Data processing
    const purchasedCourses = data?.purchasedCourse || [];

    const courseData = purchasedCourses.map((purchase) => ({
        name: purchase.courseId.courseTitle,
        price: purchase.courseId.coursePrice,
    }));

    const totalSales = purchasedCourses.length;
    const totalRevenue = purchasedCourses.reduce((acc, purchase) => acc + purchase.courseId.coursePrice, 0);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                {/* Total Sales Card */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                        <ShoppingCart className="h-5 w-5 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{totalSales}</p>
                    </CardContent>
                </Card>

                {/* Total Revenue Card */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-5 w-5 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-green-600 dark:text-green-400">₹{totalRevenue.toLocaleString()}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Course Prices Chart Card */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow col-span-1 sm:col-span-2 dark:bg-gray-800">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                        Course Prices
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={courseData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis
                                dataKey="name"
                                stroke="#6b7280"
                                angle={-30}
                                textAnchor="end"
                                interval={0}
                                height={70} // Adjust height for rotated labels
                            />
                            <YAxis stroke="#6b7280" />
                            <Tooltip formatter={(value) => [`₹${value}`, 'Price']} />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;