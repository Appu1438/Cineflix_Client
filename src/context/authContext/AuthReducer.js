const AuthReducer = (state, action) => {

    switch (action.type) {
        case "LOGIN_START":
            return {
                user: null,
                isFetching: true,
                error: false
            }
        case "LOGIN_SUCCESS":
            return {
                user: action.payload,
                isFetching: false,
                error: false
            }
        case "LOGIN_FAILURE":
            return {
                user: null,
                isFetching: false,
                error: true
            }
        case "UPDATE_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "UPDATE_SUCCESS":
            return {
                user: action.payload,
                isFetching: false,
                error: false
            }
        case "UPDATE_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        case "FETCH_USER_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "FETCH_USER_SUCCESS":
            return {
                user: action.payload,
                isFetching: false,
                error: false
            }
        case "FETCH_USER_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        default:
            return { ...state }

    }
}


export default AuthReducer