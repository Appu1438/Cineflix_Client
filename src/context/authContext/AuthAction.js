export const loginStart = () => ({
    type: 'LOGIN_START'
})

export const loginSuccess = (user) => ({
    type: 'LOGIN_SUCCESS',
    payload: user
})

export const loginFailure = () => ({
    type: 'LOGIN_FAILURE',
})

export const updateStart = () => ({
    type: 'UPDATE_START'
})

export const updateSuccess = (user) => ({
    type: 'UPDATE_SUCCESS',
    payload: user
})

export const updateFailure = () => ({
    type: 'UPDATE_FAILURE',
})

export const fetchUserStart = () => ({
    type: 'FETCH_USER_START'
})

export const fetchUserSuccess = (user) => ({
    type: 'FETCH_USER_SUCCESS',
    payload: user
})

export const fetchUserFailure = () => ({
    type: 'FETCH_USER_FAILURE',
})

