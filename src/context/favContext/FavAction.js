export const fetchFavStart = () => ({
    type: 'FETCH_FAV_START'
})
export const fetchFavSuccess = (fav) => ({
    type: 'FETCH_FAV_SUCCESS',
    payload: fav
})
export const fetchFavFailure = () => ({
    type: 'FETCH_FAV_FAILURE'
})
export const addFavStart = () => ({
    type: 'ADD_FAV_START'
})
export const addFavSuccess = (fav) => ({
    type: 'ADD_FAV_SUCCESS',
    payload: fav
})
export const addFavFailure = () => ({
    type: 'ADD_FAV_FAILURE'
})
export const removeFavStart = () => ({
    type: 'REMOVE_FAV_START'
})
export const removeFavSuccess = (fav) => ({
    type: 'REMOVE_FAV_SUCCESS',
    payload: fav
})
export const removeFavFailure = () => ({
    type: 'REMOVE_FAV_FAILURE'
})