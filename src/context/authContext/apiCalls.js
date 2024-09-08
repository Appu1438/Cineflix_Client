
import axios from 'axios'
import { loginFailure, loginStart, loginSuccess, logoutFailure, logoutStart, logoutSuccess } from './AuthAction'
import axiosInstance from '../../api/axiosInstance'


export const login = async (user, dispatch) => {
    dispatch(loginStart())
    try {
        const res = await axiosInstance.post(`auth/login`, user)
       dispatch(loginSuccess(res.data))
    } catch (error) {
        dispatch(loginFailure())
    }

}
export const logout = async (userId,dispatch) => {
    dispatch(logoutStart())
    try {
        const res = await axiosInstance.post(`auth/logout`, {userId:userId})
       dispatch(logoutSuccess())
    } catch (error) {
        dispatch(logoutFailure())
    }

}