import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    SetTodolistActionType
} from './todolists-reducer';
import {TaskPriorityes, tasksApi, TaskStatuses, TaskType, UpdateTaskModelType} from "../../api/tasks-api";
import {Dispatch} from "redux";
import {TasksStateType} from "../../app/App";
import {AppRootStateType} from "../../app/store";
import {setAppErrorAC, setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'SET-TODOLISTS': {
            let copyState = {...state}
            action.todolists.forEach((tl)=> {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'SET-TASKS': {
            return {...state, [action.todolistID]: action.tasks}
        }
        case 'REMOVE-TASK': {
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        }
        case 'ADD-TASK': {
            return {...state, [action.task.todoListId]: [action.task,...state[action.task.todoListId]]}
        }
        case 'UPDATE-TASK': {
            return {...state, [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ?  {...t, ...action.model} : t)}
        }
        case 'ADD-TODOLIST': {
            return {...state, [action.todolist.id]: []}
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        default:
            return state;
    }
}

//actions
export const removeTaskAC = (taskId: string, todolistId: string)=>
    ({type: 'REMOVE-TASK', taskId, todolistId} as const)
export const addTaskAC = (task: TaskType) =>
    ({type: 'ADD-TASK', task} as const)
export const updateTaskAC = (taskId: string, model: UpdateTaskDomainModelType, todolistId: string)=>
    ({type: 'UPDATE-TASK', model, todolistId, taskId} as const)
export const setTasksAC = (todolistID: string, tasks: TaskType[])=>
    ({type: 'SET-TASKS', todolistID, tasks} as const)

//thunks
export const getTasksTC = (todolistID: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    tasksApi.getTasks(todolistID)
        .then((res) => {
            dispatch(setTasksAC(todolistID,res.data.items))
            dispatch(setAppStatusAC('succeeded'))
        })
}
export const removeTasksTC = (todolistID: string, taskID: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    tasksApi.deleteTask(todolistID, taskID)
        .then(() => {
            dispatch(removeTaskAC(taskID,todolistID))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((err)=> {
            handleServerNetworkError(dispatch, err)
        })
}
export const addTasksTC = (todolistID: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    tasksApi.createTask(todolistID, title)
        .then((res) => {
            if (res.data.resultCode === ResultCode.succeeded) {
                dispatch(addTaskAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError<{item: TaskType}>(dispatch, res.data)
            }
        })
        .catch((err)=> {
            handleServerNetworkError(dispatch, err)
        })
}
export const updateTaskTC = (todolistID: string, taskID: string, domainModel: UpdateTaskDomainModelType) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    dispatch(setAppStatusAC('loading'))
    const task = getState().tasks[todolistID].find(t => t.id === taskID)
    console.log(task)
    if (task) {
        const apiModel: UpdateTaskModelType = {
            title: task.title,
            status: task.status,
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            ...domainModel
        }
        tasksApi.updateTask(todolistID, taskID, apiModel)
            .then((res) => {
                if (res.data.resultCode === ResultCode.succeeded) {
                    dispatch(updateTaskAC(taskID, domainModel, todolistID))
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    if(res.data.messages.length) {
                        dispatch(setAppErrorAC(res.data.messages[0]))
                    } else {
                        dispatch(setAppErrorAC('some Error'))
                    }
                    dispatch(setAppStatusAC('failed'))
                }
            })
            .catch((err)=> {
                handleServerNetworkError(dispatch, err)
            })
    }
}

//types
enum ResultCode {
    succeeded = 0,
    failed = 1,
    recaptcha_failed = 10
}
export type UpdateTaskDomainModelType = {
    title?: string,
    description?: string,
    status?: TaskStatuses,
    priority?: TaskPriorityes,
    startDate?: string,
    deadline?: string,
}
type ActionsType = ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistActionType
    | ReturnType<typeof setTasksAC>