import axios from 'axios';
import { logout, refresh } from '../context/authContext/apiCalls';

const storedUser = JSON.parse(localStorage.getItem('user'));

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: "http://192.168.1.4:5000/api", // Set the base URL
    // baseURL: process.env.REACT_APP_API_URL, // Set the base URL
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
           
                try {
                    console.log('Attempting to refresh token');

                    const accessToken = await refresh()

                    console.log('New access token:', accessToken);


                    // Retry the original request with the new access token
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                    return axiosInstance(originalRequest);

                } catch (refreshError) {
                    logout()
                    return Promise.reject(refreshError);
                }
            }

        return Promise.reject(error);
    }
);



export default axiosInstance;
