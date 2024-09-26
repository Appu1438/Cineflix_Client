import axiosInstance from "../../api/axiosInstance"
import { addWatchLaterFailure, addWatchLaterStart, addWatchLaterSuccess, fetchWatchLaterFailure, fetchWatchLaterStart, fetchWatchLaterSuccess, removeWatchLaterFailure, removeWatchLaterStart, removeWatchLaterSuccess } from "./WatchLaterAction"

export const get_User_WatchLater = async (id, dispatch) => {
    dispatch(fetchWatchLaterStart())
    try {
        const response = await axiosInstance.get(`users/watch/${id}`)
        console.log(response.data)
        dispatch(fetchWatchLaterSuccess(response.data))
    } catch (error) {
        dispatch(fetchWatchLaterFailure())
        console.log(error)
    }
}
export const add_User_WatchLater = async (data, dispatch) => {
    console.log(data)
    dispatch(addWatchLaterStart())
    try {
        const response = await axiosInstance.post(`users/watch/add`, data)
        console.log(response.data)
        dispatch(addWatchLaterSuccess(response.data))
        return response
    } catch (error) {
        dispatch(addWatchLaterFailure())
        console.log(error)
    }
}
export const remove_User_WatchLater = async (data, dispatch) => {
    console.log(data)
    dispatch(removeWatchLaterStart())
    try {
        const response = await axiosInstance.delete(`users/watch/delete`, {
            params: {
                userId: data.userId,
                movieId: data.movieId,
            },
        });
        console.log(response.data)
        dispatch(removeWatchLaterSuccess(response.data))
        return response
    } catch (error) {
        dispatch(removeWatchLaterFailure())
        console.log(error)
    }
}