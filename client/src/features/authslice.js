// src/slices/authSlice.js

import { createSlice } from '@reduxjs/toolkit';

// Initial state with persisted token from localStorage
const initialState = {
    user: null,
    isAuthenticated: false,
    // token: localStorage.getItem('token') || null,
};


// Create the slice
const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {  //how to update the state
        // When login/register is successful
        userLoggedIn: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = true
        },
        // For logging out the user
        userLoggedOut: (state, action) => {
            state.user = null;
            state.isAuthenticated = false;

        },

        // logout: (state) => {
        //     state.user = null;
        //     state.token = null;

        //     // Clear token from localStorage
        //     localStorage.removeItem('token');
    
    },
});

// Export actions
export const { userLoggedIn, userLoggedOut } = authSlice.actions;

// Export reducer to plug into store
export default authSlice.reducer;
