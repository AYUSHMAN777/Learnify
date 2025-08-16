import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import Filter from './Filter';
import SearchResult from './SearchResult';
import { useGetSearchCoursesQuery } from '@/features/api/courseApi';

const CourseCardSkeleton = () => {
    return (
        <div className="flex flex-col md:flex-row gap-6 border-b border-gray-700 pb-6 mb-6">
            <Skeleton className="h-40 w-full md:w-64 rounded-lg bg-gray-700" />
            <div className="flex flex-col gap-3 flex-1">
                <Skeleton className="h-6 w-3/4 bg-gray-700" />
                <Skeleton className="h-4 w-1/2 bg-gray-700" />
                <Skeleton className="h-4 w-1/3 bg-gray-700" />
                <Skeleton className="h-8 w-24 mt-2 bg-gray-700" />
            </div>
        </div>
    );
};

const CourseNotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-6 bg-gray-900 rounded-lg shadow-inner">
            <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
            <h1 className="font-bold text-2xl md:text-3xl text-white">Course Not Found</h1>
            <p className="text-lg text-gray-400 mt-2 mb-6">
                Sorry, we couldn’t find any courses matching your search.
            </p>
            <Button asChild variant="link" className="text-blue-400">
                <Link to="/">Browse All Courses</Link>
            </Button>
        </div>
    );
};

const SearchPage = () => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortByPrice, setSortByPrice] = useState('');
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query") || "";

    const handleFilterChange = (newSelectedCategories, newSortByPrice) => {
        setSelectedCategories(newSelectedCategories);
        setSortByPrice(newSortByPrice);
    };

    const { data, isLoading } = useGetSearchCoursesQuery({
        searchQuery: query,
        categories: selectedCategories,
        sortByPrice: sortByPrice
    });

    const isEmpty = !isLoading && data?.courses.length === 0;

    return (
        <div className="bg-[#101828] min-h-screen">
            <div className="max-w-7xl mx-auto p-4 md:p-8">
                <div className="my-6 pt-4">
                    <h1 className="text-3xl font-bold text-white">
                        Results for "{query}"
                    </h1>
                    <p className="text-gray-400 mt-1">
                        {isLoading ? 'Searching...' : `${data?.courses?.length || 0} results found`}
                    </p>
                </div>
                <div className="flex flex-col md:flex-row gap-10">
                    <div className="w-full md:w-80 flex-shrink-0">
                        <Filter handleFilterChange={handleFilterChange} />
                    </div>
                    <div className="flex-1">
                        <div className="space-y-6">
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, idx) => (
                                    <CourseCardSkeleton key={idx} />
                                ))
                            ) : isEmpty ? (
                                <CourseNotFound />
                            ) : (
                                data?.courses?.map((course) => (
                                    <SearchResult key={course._id} course={course} />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
