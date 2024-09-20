
import axios from 'axios'
import { fetchUserFailure, fetchUserStart, fetchUserSuccess, loginFailure, loginStart, loginSuccess } from './AuthAction'
import axiosInstance from '../../api/axiosInstance'


export const login = async (user, dispatch) => {
    dispatch(loginStart())
    try {
        const res = await axiosInstance.post(`auth/login`, user)
        console.log(res)
        dispatch(loginSuccess(res.data))
    } catch (error) {
        dispatch(loginFailure())
    }
}

export const logout = async () => {
    localStorage.removeItem('user'); // Clear user data
    window.location.href = '/login'; // Redirect to login page
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
        // Request a new access token and updated user details using the refresh token
        const response = await axios.post('http://localhost:3001/api/auth/refresh', { refreshToken: user.refreshToken });

        // Destructure accessToken, refreshToken, and the rest of the user data
        const { accessToken } = response.data;
        const updatedUser = { ...user, accessToken };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('New access token:', accessToken);
        return accessToken;

    } catch (error) {
        logout();
        console.error('Error refreshing token:', error);
    }
};
