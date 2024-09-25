export const fetchLikesStart = () => ({
    type: 'FETCH_LIKES_START'
})
export const fetchLikesSuccess = (likes) => ({
    type: 'FETCH_LIKES_SUCCESS',
    payload: likes
})
export const fetchLikesFailure = () => ({
    type: 'FETCH_LIKES_FAILURE'
})
export const addLikesStart = () => ({
    type: 'ADD_LIKES_START'
})
export const addLikesSuccess = (likes) => ({
    type: 'ADD_LIKES_SUCCESS',
    payload: likes
})
export const addLikesFailure = () => ({
    type: 'ADD_LIKES_FAILURE'
})
export const removeLikesStart = () => ({
    type: 'REMOVE_LIKES_START'
})
export const removeLikesSuccess = (likes) => ({
    type: 'REMOVE_LIKES_SUCCESS',
    payload: likes
})
export const removeLikesFailure = () => ({
    type: 'REMOVE_LIKES_FAILURE'
})