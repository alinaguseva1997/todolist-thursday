import {todolistApi, TodolistType} from "../../api/todolist-api";
import {Dispatch} from "redux";

const initialState: TodolistDomainType[] = []

export const todolistsReducer = (state: TodolistDomainType[] = initialState, action: ActionsType):TodolistDomainType[] => {
    switch (action.type) {
        case 'SET-TODOLISTS': {
            return action.todolists.map(tl => ({...tl, filter: 'all'}))
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [{filter: "all", ...action.todolist}, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        }
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
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

//thunks
export const setTodolistsTC = () => (dispatch: Dispatch) => {
    todolistApi.getTodolist()
        .then(res => {
            dispatch(setTodolistsAC(res.data))
        })
}
export const removeTodolistTC = (todolistID: string) => (dispatch: Dispatch) => {
    todolistApi.deleteTodolist(todolistID)
        .then(() => {
            dispatch(removeTodolistAC(todolistID))
        })
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    todolistApi.createTodolist(title)
        .then((res) => {
            dispatch(addTodolistAC(res.data.data.item))
        })
}
export const changeTodolistTitleTC = (todolistID: string, title: string) => (dispatch: Dispatch) => {
    todolistApi.updateTodolistTitle(todolistID, title)
        .then((res) => {
            dispatch(changeTodolistTitleAC(todolistID, title))
        })
}

//types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type SetTodolistActionType = ReturnType<typeof setTodolistsAC>
type ActionsType = RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistActionType