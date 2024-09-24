export const fetchWatchLaterStart = () => ({
    type: 'FETCH_WATCHLATER_START'
})
export const fetchWatchLaterSuccess = (watch) => ({
    type: 'FETCH_WATCHLATER_SUCCESS',
    payload: watch
})
export const fetchWatchLaterFailure = () => ({
    type: 'FETCH_WATCHLATER_FAILURE'
})
export const addWatchLaterStart = () => ({
    type: 'ADD_WATCHLATER_START'
})
export const addWatchLaterSuccess = (watch) => ({
    type: 'ADD_WATCHLATER_SUCCESS',
    payload: watch
})
export const addWatchLaterFailure = () => ({
    type: 'ADD_WATCHLATER_FAILURE'
})
export const removeWatchLaterStart = () => ({
    type: 'REMOVE_WATCHLATER_START'
})
export const removeWatchLaterSuccess = (watch) => ({
    type: 'REMOVE_WATCHLATER_SUCCESS',
    payload: watch
})
export const removeWatchLaterFailure = () => ({
    type: 'REMOVE_WATCHLATER_FAILURE'
})
