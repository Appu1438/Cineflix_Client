import axiosInstance from "../../api/axiosInstance"
import { addHistoryFailure, addHistoryStart, addHistorySuccess, fetchHistoryFailure, fetchHistoryStart, fetchHistorySuccess } from "./HistoryAction"

export const get_User_History = async (id, dispatch) => {
    dispatch(fetchHistoryStart())
    try {
        const response = await axiosInstance.get(`users/history/${id}`)
        console.log(response.data)
        dispatch(fetchHistorySuccess(response.data))
    } catch (error) {
        dispatch(fetchHistoryFailure())
        console.log(error)
    }
}
export const add_User_History = async (data, dispatch) => {
    dispatch(addHistoryStart())
    try {
        const response = await axiosInstance.post(`users/history/${data.userId}`, data)
        console.log(response.data)
        dispatch(addHistorySuccess(response.data))
    } catch (error) {
        dispatch(addHistoryFailure())
        console.log(error)
    }
}