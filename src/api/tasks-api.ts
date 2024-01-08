import axios, {AxiosResponse} from "axios";

export type TaskType = {
    id: string,
    title: string,
    description: string,
    todoListId: string,
    order: number,
    status: TaskStatuses,
    priority: TaskPriorityes,
    startDate: string,
    deadline: string,
    addedDate: string
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorityes {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

type ResponseType<T = {}> = {
    resultCode: number
    messages: string[],
    data: T
}

const instance = axios.create({
    withCredentials: true,
    baseURL: 'https://social-network.samuraijs.com/api/1.1'
})

export const tasksApi = {
    getTasks(todolistID: string) {
        return instance.get<TaskType[]>(`/todo-lists/${todolistID}/tasks`)
    },
    createTask(todolistID: string,title: string) {
        return instance.post<ResponseType<{item: TaskType}>,AxiosResponse<ResponseType<{item: TaskType}>>, {title: string}>(`/todo-lists/${todolistID}/tasks`,{title: title})
    },
    deleteTask(todolistID: string, taskID: string) {
        return instance.delete<ResponseType>( `/todo-lists/${todolistID}/tasks/${taskID}`)
    },
    updateTaskTitle(todolistID: string, taskID: string, newTitle: string) {
        return instance.put<ResponseType<{item: TaskType}>,AxiosResponse<ResponseType<{item: TaskType}>>, {title: string}>( `/todo-lists/${todolistID}/tasks/${taskID}`,{title: newTitle})
    }
}
