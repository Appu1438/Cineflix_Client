import axios from 'axios';
import { logout, refresh } from '../context/authContext/apiCalls';

const storedUser = JSON.parse(localStorage.getItem('user'));

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001/api/', // Set the base URL
    headers: {
        'Content-Type': 'application/json', // Set common headers
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Conditionally add the Authorization header if the token is available
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.accessToken) {
            config.headers['Authorization'] = `Bearer ${storedUser.accessToken}`;
        } else {
            console.log("No user token found");
        }
        // Example of adding another custom header
        config.headers['X-Custom-Header'] = 'customHeaderValue';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let refreshTokenPromise = null;

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if error is due to an expired token (401/403)
        if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            // If there's already a refresh in progress, return the same promise to avoid multiple refresh calls
            if (!refreshTokenPromise) {
                refreshTokenPromise = refresh(); // Refresh the token
            }

            try {
                const accessToken = await refreshTokenPromise; // Await the refresh operation

                // Once resolved, reset the token refresh promise
                refreshTokenPromise = null;

                // Update Authorization header and retry the original request
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                // Handle refresh token error and log out if necessary
                refreshTokenPromise = null;
                console.log('Error refreshing token:', refreshError);
                logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


export default axiosInstance;
