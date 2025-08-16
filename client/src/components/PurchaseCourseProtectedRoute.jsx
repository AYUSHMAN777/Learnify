import { useGetCourseDetailWithPurchaseStatusQuery } from '@/features/api/purchaseApi'
import React from 'react'
import { Navigate, useParams } from 'react-router-dom';

function PurchaseCourseProtectedRoute({children}) {
    const { courseId } = useParams();
    const { data, isLoading } = useGetCourseDetailWithPurchaseStatusQuery(courseId);
    // console.log(data);
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return data?.isPurchased ? children : <Navigate to={`/course-detail/${courseId}`} />;
}

export default PurchaseCourseProtectedRoute
