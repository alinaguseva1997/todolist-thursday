import {todolistApi, TodolistType} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from "../../app/app-reducer";
import {handleServerNetworkError} from "../../utils/error-utils";

const initialState: TodolistDomainType[] = []

export const todolistsReducer = (state: TodolistDomainType[] = initialState, action: ActionsType):TodolistDomainType[] => {
    switch (action.type) {
        case 'SET-TODOLISTS': {
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: "idle"}))
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [{filter: "all", entityStatus: "idle", ...action.todolist}, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        }
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        }
        case 'TODOLIST/SET-ENTITY-STATUS': {
            return state.map(tl => tl.id === action.todolistId ? {...tl, entityStatus: action.entityStatus} : tl)
        }
        default:
            return state;
    }
}

//actions
export const removeTodolistAC = (id: string) =>
    ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (todolist: TodolistType) =>
    ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', id, title} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
    ({type: 'CHANGE-TODOLIST-FILTER', id, filter} as const)
export const setTodolistsAC = (todolists: TodolistType[]) =>
({type: 'SET-TODOLISTS', todolists} as const)
export const setTodolistEntityStatusAC = (todolistId: string, entityStatus: RequestStatusType) =>
({type: 'TODOLIST/SET-ENTITY-STATUS', todolistId, entityStatus} as const)

//thunks
export const setTodolistsTC = () => (dispatch: Dispatch) => {
    todolistApi.getTodolist()
        .then(res => {
            dispatch(setTodolistsAC(res.data))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch(err => {
            handleServerNetworkError(dispatch, err)
        })
}
export const removeTodolistTC = (todolistID: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(setTodolistEntityStatusAC(todolistID,"loading" ))
    todolistApi.deleteTodolist(todolistID)
        .then(() => {
            dispatch(removeTodolistAC(todolistID))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((err)=>{
            dispatch(setTodolistEntityStatusAC(todolistID,"idle" ))
            handleServerNetworkError(dispatch, err.message)
        })
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistApi.createTodolist(title)
        .then((res) => {
            dispatch(addTodolistAC(res.data.data.item))
            dispatch(setAppStatusAC('succeeded'))
        })
}
export const changeTodolistTitleTC = (todolistID: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistApi.updateTodolistTitle(todolistID, title)
        .then((res) => {
            dispatch(changeTodolistTitleAC(todolistID, title))
            dispatch(setAppStatusAC('succeeded'))
        })
}

//types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type SetTodolistActionType = ReturnType<typeof setTodolistsAC>
type ActionsType = RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistActionType
    | ReturnType<typeof setTodolistEntityStatusAC>