import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const purchaseApi = createApi({
    reducerPath: 'purchaseApi',
    tagTypes: ['PurchasedCourses'],
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://learnify-1-sb4f.onrender.com/api/purchase',
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        createCheckoutSession: builder.mutation({
            query: ({ courseId }) => ({
                url: '/create-checkout-session',
                method: 'POST',
                body: { courseId },
            }),
        }),
         // Query to get all courses purchased by the user
        getAllPurchasedCourses: builder.query({
            query: () => '/purchased-courses', // This matches the route in purchase.route.js
            method:'GET',
            providesTags: ['PurchasedCourses'],
        }),
        
        // Query to get a single course with its purchase status
        getCourseDetailWithPurchaseStatus: builder.query({
            query: (courseId) => `/course/${courseId}/detail-with-status`, // Matches the route in purchase.route.js
            method:'GET',
            
            providesTags: (result, error, courseId) => [{ type: 'PurchasedCourses', id: courseId }],
        }),
          
    }),
});

export const { useCreateCheckoutSessionMutation, useGetAllPurchasedCoursesQuery, useGetCourseDetailWithPurchaseStatusQuery } = purchaseApi;
// export default purchaseApi.reducer;