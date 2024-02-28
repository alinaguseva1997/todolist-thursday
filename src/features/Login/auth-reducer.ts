import {Dispatch} from "redux";
import {authApi} from "../../api/auth-api";
import {setAppStatusAC, setIsInitializedAppAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {LoginDataType} from "./Login";

const initialState =  {
    isLogged: false
}

export const authReducer = (state = initialState, action: ActionsType) => {
    switch (action.type) {
        case 'SET-IS-LOGGED': {
            return {...state, isLogged: action.isLogged}
        }
        default:
            return state;
    }
}

//actions
export const setIsLoggedAC = (isLogged:boolean)=>
    ({type: 'SET-IS-LOGGED', isLogged} as const)

//thunks
export const getIsLoggedTC = (loginData: LoginDataType) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC("loading"))
    try {
        const res = await authApi.login(loginData)
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedAC(true))
            dispatch(setAppStatusAC("succeeded"))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (err) {
        handleServerNetworkError(dispatch, err as { message: string })
    }
}
export const logOutTC = () => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC("loading"))
    try {
        const res = await authApi.logOut()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedAC(false))
            dispatch(setAppStatusAC("succeeded"))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (err) {
        handleServerNetworkError(dispatch, err as { message: string })
    }
}
export const meTC = () => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC("loading"))
    try {
        const res = await authApi.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedAC(true))
            dispatch(setAppStatusAC("succeeded"))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (err) {
        handleServerNetworkError(dispatch, err as { message: string })
    } finally{
        dispatch(setIsInitializedAppAC(true))
    }
}

type ActionsType = ReturnType<typeof setIsLoggedAC>