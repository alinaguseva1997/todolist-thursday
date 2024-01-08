import {v1} from 'uuid';
import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    SetTodolistActionType
} from './todolists-reducer';
import {TasksStateType} from '../App';
import {TaskPriorityes, tasksApi, TaskStatuses, TaskType} from "../api/tasks-api";
import {Dispatch} from "redux";

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
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId];
            const newTasks = tasks.filter(t => t.id != action.taskId);
            stateCopy[action.todolistId] = newTasks;
            return stateCopy;
        }
        case 'ADD-TASK': {
            const stateCopy = {...state}
            const newTask: TaskType = {
                id: v1(),
                title: action.title,
                status: TaskStatuses.New,
                addedDate: '',
                deadline: '',
                order: 0,
                description: '',
                priority: TaskPriorityes.Low,
                startDate: '',
                todoListId: action.todolistId
            }
            const tasks = stateCopy[action.todolistId];
            const newTasks = [newTask, ...tasks];
            stateCopy[action.todolistId] = newTasks;
            return stateCopy;
        }
        case 'CHANGE-TASK-STATUS': {
            let todolistTasks = state[action.todolistId];
            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, isDone: action.status} : t);

            state[action.todolistId] = newTasksArray;
            return ({...state});
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
export const addTaskAC = (title: string, todolistId: string) =>
    ({type: 'ADD-TASK', title, todolistId} as const)
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string)=>
    ({type: 'CHANGE-TASK-STATUS', status, todolistId, taskId} as const)
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string)=>
    ({type: 'CHANGE-TASK-TITLE', title, todolistId, taskId} as const)
export const setTasksAC = (todolistID: string, tasks: TaskType)=>
    ({type: 'SET-TASKS', todolistID, tasks} as const)

export const getTasksTC = (todolistID: string) => (dispatch: Dispatch) => {
    tasksApi.getTasks(todolistID)
        .then((res) => {
            dispatch(setTasksAC(todolistID,res.data))
        })
}