import axiosInstance from "../../api/axiosInstance"
import { addLikesFailure, addLikesStart, addLikesSuccess, fetchLikesFailure, fetchLikesStart, fetchLikesSuccess, removeLikesFailure, removeLikesStart, removeLikesSuccess } from "./LikesAction"

export const get_User_Likes = async (id, dispatch) => {
    dispatch(fetchLikesStart())
    try {
        const response = await axiosInstance.get(`users/likes/${id}`)
        console.log('likes', response.data)
        dispatch(fetchLikesSuccess(response.data))
    } catch (error) {
        dispatch(fetchLikesFailure())
        console.log(error)
    }
}

export const add_User_Likes = async (data, dispatch) => {
    console.log(data)
    dispatch(addLikesStart())
    try {
        const response = await axiosInstance.post(`movies/likes/${data.userId}`, data)
        console.log(response.data)
        dispatch(addLikesSuccess(response.data))
    } catch (error) {
        dispatch(addLikesFailure())
        console.log(error)
    }
}
export const remove_User_Likes = async (data, dispatch) => {
    console.log(data)
    dispatch(removeLikesStart())
    try {
        const response = await axiosInstance.delete(`movies/likes/${data.userId}`, {
            params: {
                movieId: data.movieId,
            }
        },)
        console.log(response.data)
        dispatch(removeLikesSuccess(response.data))
    } catch (error) {
        dispatch(removeLikesFailure())
        console.log(error)
    }
}