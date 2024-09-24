const WatchLaterReducer = (state, action) => {

    switch (action.type) {
        case "FETCH_WATCHLATER_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "FETCH_WATCHLATER_SUCCESS":
            return {
                watch: action.payload,
                isFetching: false,
                error: false
            }
        case "FETCH_WATCHLATER_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        case "ADD_WATCHLATER_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "ADD_WATCHLATER_SUCCESS":
            return {
                watch: action.payload,
                isFetching: false,
                error: false
            }
        case "ADD_WATCHLATER_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        case "REMOVE_WATCHLATER_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "REMOVE_WATCHLATER_SUCCESS":
            return {
                watch: action.payload,
                isFetching: false,
                error: false
            }
        case "REMOVE_WATCHLATER_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }

        default:
            return { ...state }

    }
}


export default WatchLaterReducer