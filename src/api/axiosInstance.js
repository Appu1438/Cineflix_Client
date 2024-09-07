import axios from 'axios';

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

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Handle the response data here
        return response;
    },
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Handle unauthorized or forbidden errors
            localStorage.removeItem('user'); // Clear the user item from localStorage
            window.location.href = '/login'; // Navigate to the login page
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
