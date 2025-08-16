import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const course_api = 'http://localhost:5000/api/course';
export const courseApi = createApi({//createApi set up connection to your backend API
    reducerPath: 'courseApi', // key in Redux store
    tagTypes: ['Refetch_Courses'],
    baseQuery: fetchBaseQuery({
        baseUrl: course_api,
        credentials: 'include'
    }),
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: ({ courseTitle, category }) => ({
                url: '',
                method: 'POST',
                body: { courseTitle, category },

            }),
            invalidatesTags: ['Refetch_Courses'],
        }),

        // A mutation in RTK Query is for creating, updating, or deleting data (anything that modifies data on the server).

        // 🆕 Fetch all courses created by the logged-in admin
        getAllAdminCourses: builder.query({
            query: () => ({
                url: '',
                method: 'GET',
            }),
            providesTags: ['Refetch_Courses'],
        }),

        //getAllAdminCourses
        getPublishedCourses: builder.query({
            query: () => '/published', // Calls the GET /api/course/published route
            providesTags: ['Refetch_Courses'], // Uses the general course tag
        }),

        // A mutation in RTK Query is for creating, updating, or deleting data (anything that modifies data on the server).
        editCourse: builder.mutation({
            query: ({ formData, courseId }) => ({
                url: `/${courseId}`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: ['Refetch_Courses'],
        }),
        // 🆕 Fetch a single course by its ID
        getCourseById: builder.query({
            query: (courseId) => ({
                url: `/${courseId}`,
                method: 'GET',
            }),
            providesTags: (result, error, courseId) => [{ type: 'Refetch_Courses', id: courseId }],
        }),
        removeCourse: builder.mutation({
            query: (courseId) => ({
                url: `/${courseId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Refetch_Courses'],
        }),

        createLecture: builder.mutation({
            query: ({ courseId, lectureTitle }) => ({
                url: `${courseId}/lecture`,
                method: 'POST',
                body: { lectureTitle },
            }),
            invalidatesTags: (result, error, { courseId }) => [{ type: 'Refetch_Courses', id: courseId }],
        }),
        getCourseLecture: builder.query({
            query: (courseId) => ({
                url: `/${courseId}/lecture`,
                method: 'GET',
            }),
            providesTags: (result, error, courseId) => [{ type: 'Refetch_Courses', id: courseId }],
        }),
        // This is the new mutation for editing a lecture
        editLecture: builder.mutation({
            query: ({ courseId, lectureId, videoInfo, isPreviewFree, lectureTitle }) => ({
                url: `/${courseId}/lecture/${lectureId}`,
                method: 'POST', // Your route is defined as POST
                body: { lectureTitle, videoInfo, isPreviewFree },
            }),
            // Invalidate both the course (to refetch the lecture list) and the specific lecture
            invalidatesTags: (result, error, { courseId, lectureId }) => [
                { type: 'Refetch_Courses', id: courseId },
                { type: 'Lecture', id: lectureId }
            ],
        }),
        // This is the new mutation for removing a lecture
        removeLecture: builder.mutation({
            query: ({ lectureId }) => ({
                url: `/lecture/${lectureId}`,
                method: 'DELETE',
            }),
            // Invalidate the course tag to refetch the lecture list
            invalidatesTags: (result, error, { courseId }) => [{ type: 'Refetch_Courses', id: courseId }],
        }),
        getLectureById: builder.query({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: 'GET',
            }),
            providesTags: (result, error, lectureId) => [{ type: 'Lecture', id: lectureId }],
        }),
        // New mutation for toggling publish status
        togglePublishCourse: builder.mutation({
            query: ({ courseId, query }) => ({
                url: `/${courseId}?publish=${query}`,
                method: 'PATCH',
                // params: { query }, // This adds ?publish=true or ?publish=false to the URL
            }),
            // Invalidate the specific course tag to refetch its data
            invalidatesTags: (result, error, { courseId }) => [{ type: 'Refetch_Courses', id: courseId }],
        }),

        getSearchCourses: builder.query({
            query: ({ searchQuery, categories, sortByPrice }) => {
                let queryString = `/search?query=${encodeURIComponent(searchQuery)}`
                if (categories && categories.length > 0) {
                    const categoriesString = categories.map(encodeURIComponent).join(',');
                    queryString += `&categories=${categoriesString}`
                }
                if (sortByPrice) {
                    queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`
                }
                return {
                    url: queryString,
                    method: 'GET',

                }
            },
            providesTags: ['Refetch_Courses'],
        })
    }),

});
export const { useCreateCourseMutation, useGetPublishedCoursesQuery, useGetAllAdminCoursesQuery, useEditCourseMutation, useGetCourseByIdQuery, useRemoveCourseMutation, useCreateLectureMutation, useGetCourseLectureQuery, useEditLectureMutation, useRemoveLectureMutation, useGetLectureByIdQuery, useTogglePublishCourseMutation, useGetSearchCoursesQuery } = courseApi;