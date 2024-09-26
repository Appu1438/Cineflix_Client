import axiosInstance from "../../api/axiosInstance"
import { addFavFailure, addFavStart, addFavSuccess, fetchFavFailure, fetchFavStart, fetchFavSuccess, removeFavFailure, removeFavStart, removeFavSuccess } from "./FavAction"

export const get_User_Fav = async (id, dispatch) => {
    dispatch(fetchFavStart())
    try {
        const response = await axiosInstance.get(`users/fav/${id}`)
        console.log(response.data)
        dispatch(fetchFavSuccess(response.data))
    } catch (error) {
        dispatch(fetchFavFailure())
        console.log(error)
    }
}
export const add_User_Fav = async (data, dispatch) => {
    console.log(data)
    dispatch(addFavStart())
    try {
        const response = await axiosInstance.post(`users/fav/add`, data)
        console.log(response.data)
        dispatch(addFavSuccess(response.data))
        return response

    } catch (error) {
        dispatch(addFavFailure())
        console.log(error)
    }
}
export const remove_User_Fav = async (data, dispatch) => {
    console.log(data)
    dispatch(removeFavStart())
    try {
        const response = await axiosInstance.delete(`users/fav/delete`, {
            params: {
                userId: data.userId,
                movieId: data.movieId,
            },
        });
        console.log(response.data)
        dispatch(removeFavSuccess(response.data))
        return response

    } catch (error) {
        dispatch(removeFavFailure())
        console.log(error)
    }
}