import React from 'react';
import { useGetInstructorDashboardDataQuery } from '@/features/api/purchaseApi';
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
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
    const { data, isError, isLoading } = useGetInstructorDashboardDataQuery();

    if (isLoading) return <DashboardSkeleton />;
    if (isError) return <h1 className="text-red-500">Failed to fetch dashboard data.</h1>;

    const { totalSales = 0, totalRevenue = 0, chartData = [] } = data || {};

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                <Card className="shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                        <ShoppingCart className="h-5 w-5 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{totalSales}</p>
                    </CardContent>
                </Card>

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

            <Card className="shadow-lg hover:shadow-xl transition-shadow col-span-1 sm:col-span-2 dark:bg-gray-800">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                        Course Prices Overview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#6b7280"
                                    angle={-45}
                                    textAnchor="end"
                                    interval={0}
                                    height={80}
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
                    ) : (
                        <div className="text-center py-10 text-gray-500">No sales data to display in the chart yet.</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

const DashboardSkeleton = () => (
    <div className="space-y-8 animate-pulse">
        <Skeleton className="h-9 w-48" />
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
            <Card className="shadow-lg dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                    <ShoppingCart className="h-5 w-5 text-gray-400" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-1/4" />
                </CardContent>
            </Card>
            <Card className="shadow-lg dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-5 w-5 text-gray-400" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-1/3" />
                </CardContent>
            </Card>
        </div>
        <Card className="shadow-lg col-span-1 sm:col-span-2 dark:bg-gray-800">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Course Prices Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[250px] w-full" />
            </CardContent>
        </Card>
    </div>
);

export default Dashboard;