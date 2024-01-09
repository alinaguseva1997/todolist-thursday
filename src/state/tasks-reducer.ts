import {v1} from 'uuid';
import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    SetTodolistActionType
} from './todolists-reducer';
// import {TasksStateType} from '../App';
import {TaskPriorityes, tasksApi, TaskStatuses, TaskType, UpdateTaskModelType} from "../api/tasks-api";
import {Dispatch} from "redux";
import {TasksStateType} from "../App";
import {AppRootStateType} from "./store";

type ActionsType = ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistActionType
    | ReturnType<typeof setTasksAC>

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
        case 'CHANGE-TASK-STATUS': {
            return {...state, [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ?  {...t, isDone: action.status} : t)}
        }
        case 'CHANGE-TASK-TITLE': {
            let todolistTasks = state[action.todolistId];
            // найдём нужную таску:
            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, title: action.title} : t);

            state[action.todolistId] = newTasksArray;
            return ({...state});
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolistId]: []
            }
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

export const removeTaskAC = (taskId: string, todolistId: string)=>
    ({type: 'REMOVE-TASK', taskId, todolistId} as const)
export const addTaskAC = (task: TaskType) =>
    ({type: 'ADD-TASK', task} as const)
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string)=>
    ({type: 'CHANGE-TASK-STATUS', status, todolistId, taskId} as const)
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string)=>
    ({type: 'CHANGE-TASK-TITLE', title, todolistId, taskId} as const)
export const setTasksAC = (todolistID: string, tasks: TaskType[])=>
    ({type: 'SET-TASKS', todolistID, tasks} as const)



export const getTasksTC = (todolistID: string) => (dispatch: Dispatch) => {
    tasksApi.getTasks(todolistID)
        .then((res) => {
            dispatch(setTasksAC(todolistID,res.data.items))
        })
}
export const removeTasksTC = (todolistID: string, taskID: string) => (dispatch: Dispatch) => {
    tasksApi.deleteTask(todolistID, taskID)
        .then(() => {
            dispatch(removeTaskAC(taskID,todolistID))
        })
}
export const addTasksTC = (todolistID: string, title: string) => (dispatch: Dispatch) => {
    tasksApi.createTask(todolistID,title)
        .then((res) => {
            dispatch(addTaskAC(res.data.data.item))
        })
}
/*export const updateTaskTitleTC = (todolistID: string, title: string) => (dispatch: Dispatch) => {
}*/
export const updateTaskStatusTC = (todolistID: string, taskID: string, status: TaskStatuses) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todolistID].find(t => t.id === taskID)
    console.log(task)
    if (task) {
        const model: UpdateTaskModelType = {
            title: task.title,
            status: status,
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate
        }
        tasksApi.updateTask(todolistID,taskID, model)
            .then(() => {
                dispatch(changeTaskStatusAC(taskID, status, todolistID))
            })
    }
}