import axios from 'axios';

// const storedUser = JSON.parse(localStorage.getItem('user'));
// if (!storedUser || !storedUser.accessToken) {
//     throw new Error("No user token found");
// }

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001/api/', // Set the base URL
    headers: {
        'Content-Type': 'application/json', // Set common headers
        'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YTc4MWIzNjQ3YzEzNjYyNzVjNjkwOCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcyNTM1NDIwMSwiZXhwIjoxNzI1Nzg2MjAxfQ.AeGYBnfSjeBzIrGANKrBnq-0O8XIieSesHFDf6ck7AE",
    }
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Modify the request config before sending it
        // You can add or modify headers here if needed
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
            // localStorage.removeItem('user'); // Clear the user item from localStorage
            // window.location.href = '/login'; // Navigate to the login page
        }
        return Promise.reject(error);
    }
);
export default axiosInstance;
