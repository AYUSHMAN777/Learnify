import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Use environment variable for baseUrl
// const baseUrl = import.meta.env.VITE_API_URL + '/progress';

// Define a new API slice for course progress
export const courseProgressApi = createApi({
    reducerPath: 'courseProgressApi',
    tagTypes: ['CourseProgress'], // A specific tag for progress data
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://learnify-1-sb4f.onrender.com/api/progress', // Assuming your progress routes are under /api/progress
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        // Query to get the progress for a specific course
        getCourseProgress: builder.query({
            query: (courseId) => `/${courseId}`,
            method: 'GET',
            providesTags: (result, error, courseId) => [{ type: 'CourseProgress', id: courseId }],
        }),

        // Mutation to update the progress of a single lecture
        updateLectureProgress: builder.mutation({
            query: ({ courseId, lectureId }) => ({
                url: `/${courseId}/lectures/${lectureId}/view`,
                method: 'POST', // Using POST for updates
            }),
            invalidatesTags: (result, error, { courseId }) => [{ type: 'CourseProgress', id: courseId }],
        }),

        // Mutation to mark the entire course as completed
        markAsCompleted: builder.mutation({
            query: (courseId) => ({
                url: `/${courseId}/complete`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, courseId) => [{ type: 'CourseProgress', id: courseId }],
        }),

        // Mutation to mark the entire course as incomplete
        markAsIncomplete: builder.mutation({
            query: (courseId) => ({
                url: `/${courseId}/incomplete`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, courseId) => [{ type: 'CourseProgress', id: courseId }],
        }),
    }),
});

// Export the auto-generated hooks
export const {
    useGetCourseProgressQuery,
    useUpdateLectureProgressMutation,
    useMarkAsCompletedMutation,
    useMarkAsIncompleteMutation,
} = courseProgressApi;