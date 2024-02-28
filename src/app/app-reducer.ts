export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type ActionsType = setAppStatusActionType | setAppErrorActionType | setIsInitializedAppActonType

export type setAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type setAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type setIsInitializedAppActonType = ReturnType<typeof setIsInitializedAppAC>

const initialState = {
    error: null as null | string,
    status: 'loading' as RequestStatusType,
    isInitialized: false
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS': {
            return {...state, status: action.status}
        }
        case 'APP/SET-ERROR': {
            return {...state, error: action.error}
        }
        case 'APP/IS-INITIALIZED-APP': {
            return {...state, isInitialized: action.isInitialized}
        }
        default: {
            return state
        }
    }
}

export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppErrorAC = (error: null | string) => ({type: 'APP/SET-ERROR', error} as const)
export const setIsInitializedAppAC = (isInitialized: boolean) => ({type: 'APP/IS-INITIALIZED-APP', isInitialized} as const)