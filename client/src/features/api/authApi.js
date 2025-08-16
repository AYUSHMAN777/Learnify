import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { userLoggedIn, userLoggedOut } from '../authslice';
const user_api = 'https://learnify-1-sb4f.onrender.com/api/user/';
export const authApi = createApi({//createApi set up connection to your backend API
    reducerPath: 'api', // key in Redux store
    baseQuery: fetchBaseQuery({
        baseUrl: user_api,
        credentials: 'include'
    }),
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (inputData) => ({
                url: 'register',
                method: 'POST',
                body: inputData,
            }),
        }),

        //A mutation in RTK Query is for creating, updating, or deleting data (anything that modifies data on the server).
        loginUser: builder.mutation({
            query: (inputData) => ({
                url: 'login',
                method: 'POST',
                body: inputData,
            }),
            //             onQueryStarted: A lifecycle handler triggered as soon as the mutation starts.It:

            //             Waits for the query to finish(queryFulfilled).

            // If successful, dispatches userLoggedIn() to update the Redux store.

            // If failed, logs the error
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({ user: result.data.user }));
                } catch (error) {
                    console.log('Login failed:', error);
                }
            },
        }),

        logoutUser: builder.mutation({
            query: () => ({
                url: 'logout',
                method: 'GET',
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    // const result = await queryFulfilled;
                    await queryFulfilled;
                     dispatch(userLoggedOut());
                } catch (error) {
                    console.log('Login failed:', error);
                }
            },
        }),

        loadUser: builder.query({
            query: () => ({
                url: 'profile',
                method: 'GET',
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({ user: result.data.user }));
                } catch (error) {
                    console.log('Login failed:', error);
                }
            },
        }),
        updateUser: builder.mutation({
            query: (formData) => ({
                url: 'profileupdate',
                method: 'PUT',
                body: formData,
                credentials: 'include', // Include cookies in the request
            })
        })
    }),
});

export const { useRegisterUserMutation, useLoginUserMutation, useLoadUserQuery, useUpdateUserMutation, useLogoutUserMutation } = authApi;