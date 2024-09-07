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


axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response:', response); // Log the response
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is due to invalid access token and retry flag is not set
        if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            let id;
            const storedUser = JSON.parse(localStorage.getItem('user'));

            if (storedUser && storedUser._id) {
                id = storedUser._id;
            } else {
                console.log("No user ID found");
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                console.log('Attempting to refresh token');
                // Request a new access token using the user ID
                const response = await axios.post('http://localhost:3001/api/auth/refresh', { id: id });

                const { accessToken } = response.data;
                updateAccessToken(accessToken);
                console.log('New access token:', accessToken);

                // Retry the original request with the new access token
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                // originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            } catch (refreshError) {
                console.log('Error in refreshing token:', refreshError);
                localStorage.removeItem('user'); // Clear user data
                window.location.href = '/login'; // Redirect to login page
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);


// Function to update the access token in localStorage
const updateAccessToken = (newAccessToken) => {
    const userString = localStorage.getItem('user');
    if (userString) {
        const user = JSON.parse(userString);
        user.accessToken = newAccessToken;
        localStorage.setItem('user', JSON.stringify(user));
    }
};

export default axiosInstance;
