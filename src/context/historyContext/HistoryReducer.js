const HistoryReducer = (state, action) => {

    switch (action.type) {
        case "FETCH_HISTORY_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "FETCH_HISTORY_SUCCESS":
            return {
                history: action.payload,
                isFetching: false,
                error: false
            }
        case "FETCH_HISTORY_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        case "ADD_HISTORY_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "ADD_HISTORY_SUCCESS":
            return {
                history: action.payload,
                isFetching: false,
                error: false
            }
        case "ADD_HISTORY_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        
        default:
            return { ...state }

    }
}


export default HistoryReducer