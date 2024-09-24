import { createContext, useEffect, useReducer } from "react";
import WatchLaterReducer from "./WatchLaterReducer";


const INITIAL_STATE = {
    watch: {},
    isFetching: false,
    error: false
}

export const WatchLaterContext = createContext(INITIAL_STATE)
export const WatchLaterContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(WatchLaterReducer, INITIAL_STATE)
    return (
        <WatchLaterContext.Provider value={{
            watch: state.watch,
            isFetching: state.isFetching,
            error: state.error,
            dispatch
        }}
        >
            {children}
        </WatchLaterContext.Provider>
    )
}