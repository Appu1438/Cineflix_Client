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
        // Handle the error before sending the request
        return Promise.reject(error);
    }
);


axiosInstance.interceptors.response.use(
    (response) => {
        // console.log('Response:', response); // Log the response
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is due to invalid access token and retry flag is not set
        if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const accessToken = await refresh()
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.log('Error in refreshing token:', refreshError);
                logout()
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
