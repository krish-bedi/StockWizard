import { fetchBaseQuery, createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { clearCredentials } from './authSlice';

// API Slice: Handle HTTP requests to our backend

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : process.env.REACT_APP_API_URL,
    // Include cookies in request
    credentials: 'include'
});

// Custom query function that handles access token refresh on every request
export const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
    // Try the original request
    let result = await baseQuery(args, api, extraOptions);

    // If the request failed with a 401 status code
    if (result?.error?.status === 401) {
        // Only try refresh if we have cookies (are logged in)
        if (document.cookie.includes('refreshToken')) {
            // Try to refresh token
            const refreshResult = await baseQuery(
                { 
                    url: '/api/users/refresh',
                    method: 'POST',
                    credentials: 'include'
                }, 
                api, 
                extraOptions
            );

            // If refresh was successful
            if (refreshResult.data) {
                // Retry original query
                result = await baseQuery(args, api, extraOptions);
            } else {
                // If refresh failed, log the user out
                api.dispatch(clearCredentials());
                return {
                    error: {
                        status: 401,
                        data: { message: 'Session expired' }
                    }
                };
            }
        }
    }

    return result;
};

// Create base API slice with no endpoints
// Endpoints will be added in separate slices using 'apiSlice.injectEndpoints()'

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User"],
    endpoints: builder => ({}),
});