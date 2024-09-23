import { createContext, useEffect, useReducer } from "react";
import HistoryReducer from "./HistoryReducer";


const INITIAL_STATE = {
    history: {},
    isFetching: false,
    error: false
}

export const HistoryContext = createContext(INITIAL_STATE)
export const HistoryContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(HistoryReducer, INITIAL_STATE)
    return (
        <HistoryContext.Provider value={{
            history: state.history,
            isFetching: state.isFetching,
            error: state.error,
            dispatch
        }}
        >
            {children}
        </HistoryContext.Provider>
    )
}