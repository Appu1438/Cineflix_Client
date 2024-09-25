import { createContext, useEffect, useReducer } from "react";
import LikesReducer from "./LikesReducer";

const INITIAL_STATE = {
    likes: {},
    isFetching: false,
    error: false
}

export const LikesContext = createContext(INITIAL_STATE)
export const LikesContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(LikesReducer, INITIAL_STATE)
    return (
        <LikesContext.Provider value={{
            likes: state.likes,
            isFetching: state.isFetching,
            error: state.error,
            dispatch
        }}
        >
            {children}
        </LikesContext.Provider>
    )
}