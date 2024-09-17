
import axios from 'axios'
import { loginFailure, loginStart, loginSuccess } from './AuthAction'
import axiosInstance from '../../api/axiosInstance'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const login = async (user, dispatch) => {
    dispatch(loginStart())
    try {
        const res = await axiosInstance.post(`auth/login`, user)
        toast.success('Login successful!');
        dispatch(loginSuccess(res.data))
    } catch (error) {
        console.log(error.response);  // Log the error response here
        // Show the error message coming directly from the backend
        const errorMessage = error.response?.data?.message || error.response?.data || 'Something went wrong. Please try again.';
        toast.error(errorMessage);
        dispatch(loginFailure())
    }

}
export const logout = async () => {
    localStorage.removeItem('user'); // Clear user data
    window.location.href = '/login'; // Redirect to login page
}

export const refresh = async () => {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);

    try {
        console.log('Attempting to refresh token');
        // Request a new access token and updated user details using the refresh token
        const response = await axios.post('http://localhost:3001/api/auth/refresh', { refreshToken: user.refreshToken });

        // Destructure accessToken, refreshToken, and the rest of the user data
        const { accessToken, refreshToken, ...updatedUser } = response.data;

        // Update the user object with the new tokens and user info
        updatedUser.accessToken = accessToken;
        updatedUser.refreshToken = refreshToken;
        
        // Store the updated user info in localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));

        console.log('New access token:', accessToken);
        return accessToken;
    } catch (error) {
        logout();
        console.error('Error refreshing token:', error);
    }
};
