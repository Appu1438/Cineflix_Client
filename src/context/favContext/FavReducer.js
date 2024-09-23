const FavReducer = (state, action) => {

    switch (action.type) {
        case "FETCH_FAV_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "FETCH_FAV_SUCCESS":
            return {
                fav: action.payload,
                isFetching: false,
                error: false
            }
        case "FETCH_FAV_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        case "ADD_FAV_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "ADD_FAV_SUCCESS":
            return {
                fav: action.payload,
                isFetching: false,
                error: false
            }
        case "ADD_FAV_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        case "REMOVE_FAV_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "REMOVE_FAV_SUCCESS":
            return {
                fav: action.payload,
                isFetching: false,
                error: false
            }
        case "REMOVE_FAV_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        default:
            return { ...state }

    }
}


export default FavReducer