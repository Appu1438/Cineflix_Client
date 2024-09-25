const LikesReducer = (state, action) => {

    switch (action.type) {
        case "FETCH_LIKES_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "FETCH_LIKES_SUCCESS":
            return {
                likes: action.payload,
                isFetching: false,
                error: false
            }
        case "FETCH_LIKES_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        case "ADD_LIKES_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "ADD_LIKES_SUCCESS":
            return {
                likes: action.payload,
                isFetching: false,
                error: false
            }
        case "ADD_LIKES_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        case "REMOVE_LIKES_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "REMOVE_LIKES_SUCCESS":
            return {
                likes: action.payload,
                isFetching: false,
                error: false
            }
        case "REMOVE_LIKES_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        default:
            return { ...state }

    }
}


export default LikesReducer