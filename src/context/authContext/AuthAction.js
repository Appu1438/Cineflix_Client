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

export const logoutStart = () => ({
    type: 'LOGOUT_START',
})
export const logoutSuccess = () => ({
    type: 'LOGOUT_SUCCESS',
})
export const logoutFailure = () => ({
    type: 'LOGOUT_FAILURE',
})
