
import axios from 'axios'
import { loginFailure, loginStart, loginSuccess } from './AuthAction'
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