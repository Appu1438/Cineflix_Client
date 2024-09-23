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



let isRefreshing = false;
let failedQueue = [];

// Subscribe to token refresh
const subscribeTokenRefresh = (cb) => {
    failedQueue.push(cb);
};

// Notify all subscribers about the new token
const onRefreshed = (newAccessToken) => {
    failedQueue.forEach((cb) => cb(newAccessToken));
    failedQueue = [];
};


// Axios response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response; // Return response if successful
    },
    async (error) => {
        const originalRequest = error.config;

        // Check for 401 or 403 error and if this request hasn't been retried
        if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;
            // If not already refreshing the token
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    console.log('Attempting to refresh token');

                    const accessToken = await refresh()

                    console.log('New access token:', accessToken);

                    isRefreshing = false;
                    onRefreshed(accessToken); // Notify all subscribers with the new token

                    // Retry the original request with the new access token
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                    return axiosInstance(originalRequest);

                } catch (refreshError) {
                    logout()
                    isRefreshing = false;
                    return Promise.reject(refreshError);
                }
            }

            // If token is being refreshed, queue the request until the new token is available
            return new Promise((resolve, reject) => {
                subscribeTokenRefresh((newAccessToken) => {
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    resolve(axiosInstance(originalRequest));
                });
            });
        }

        return Promise.reject(error);
    }
);


// axiosInstance.interceptors.response.use(
//     (response) => {
//         // console.log('Response:', response); // Log the response
//         return response;
//     },
//     async (error) => {
//         const originalRequest = error.config;
//         // Check if the error is due to invalid access token and retry flag is not set
//         if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
//             originalRequest._retry = true;
//             try {
//                 const accessToken = await refresh()
//                 originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
//                 return axiosInstance(originalRequest);
//             } catch (refreshError) {
//                 console.log('Error in refreshing token:', refreshError);
//                 logout()
//                 return Promise.reject(refreshError);
//             }
//         }
//         return Promise.reject(error);
//     }
// );

export default axiosInstance;
