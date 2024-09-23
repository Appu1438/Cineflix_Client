export const fetchHistoryStart = () => ({
    type: 'FETCH_HISTORY_START'
})
export const fetchHistorySuccess = (history) => ({
    type: 'FETCH_HISTORY_SUCCESS',
    payload: history
})
export const fetchHistoryFailure = () => ({
    type: 'FETCH_HISTORY_FAILURE'
})
export const addHistoryStart = () => ({
    type: 'ADD_HISTORY_START'
})
export const addHistorySuccess = (history) => ({
    type: 'ADD_HISTORY_SUCCESS',
    payload: history
})
export const addHistoryFailure = () => ({
    type: 'ADD_HISTORY_FAILURE'
})
