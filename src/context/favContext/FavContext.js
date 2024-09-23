import { createContext, useEffect, useReducer } from "react";
import FavReducer from "./FavReducer";


const INITIAL_STATE = {
    fav: {},
    isFetching: false,
    error: false
}

export const FavContext = createContext(INITIAL_STATE)
export const FavContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(FavReducer, INITIAL_STATE)
    return (
        <FavContext.Provider value={{
            fav: state.fav,
            isFetching: state.isFetching,
            error: state.error,
            dispatch
        }}
        >
            {children}
        </FavContext.Provider>
    )
}