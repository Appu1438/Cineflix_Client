
import axios from 'axios'
import { fetchUserFailure, fetchUserStart, fetchUserSuccess, loginFailure, loginStart, loginSuccess } from './AuthAction'
import axiosInstance from '../../api/axiosInstance'

export const login = async (user, dispatch) => {
    dispatch(loginStart());

    try {
        // Make the login request
        const res = await axiosInstance.post(`auth/login`, user, { withCredentials: true });

        // Log the response from the server
        console.log('Login Response:', res);

        // Dispatch success action with user data
        dispatch(loginSuccess(res.data));
    } catch (error) {
        console.error('Login error:', error); // Log the error details
        dispatch(loginFailure());
    }
};

export const logout = async () => {
    try {

        const response = await axiosInstance.post('auth/logout', {}, { withCredentials: true });
        if (response.status == 200) {
            localStorage.removeItem('user'); // Clear user data
            window.location.href = '/login'; // Redirect to login page
        } else {
            console.log('Failed to logout')
        }

    } catch (error) {
        console.log(error)
    }

}


export const fetchUserDetailsIfOutdated = async (dispatch) => {
    dispatch(fetchUserStart())
    const localUser = JSON.parse(localStorage.getItem('user'));
    if (localUser) {
        try {
            const updatedUserResponse = await axiosInstance.get('auth/profile');
            const updatedProfile = updatedUserResponse.data;
            // Merge the existing access and refresh tokens with the updated profile data
            const mergedUser = {
                ...localUser, // Retain accessToken and refreshToken from localUser
                ...updatedProfile // Override other profile details from updated response
            };

            dispatch(fetchUserSuccess(mergedUser))
            // localStorage.setItem('user', JSON.stringify(mergedUser));
            console.log('Updated user details:', mergedUser);

        } catch (error) {
            dispatch(fetchUserFailure())
            console.log('Error fetching updated user data:', error);
        }
    }
};

export const refresh = async () => {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);

    try {
        console.log('Attempting to refresh token');
        const response = await axios.post('http://localhost:5000/api/auth/refresh', {}, { withCredentials: true });

        const { accessToken } = response.data;
        const updatedUser = { ...user, accessToken };

        localStorage.setItem('user', JSON.stringify(updatedUser));
        return accessToken;

    } catch (error) {
        logout();
        console.error('Error refreshing token:', error);
    }
};
