import axios from "axios";

type TaskType = {
    id: string,
    title: string,
    description: string,
    todoListId: string,
    order: number,
    status: number,
    priority: number,
    startDate: Date,
    deadline: Date,
    addedDate: Date
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
        return instance.post<ResponseType<TaskType>>(`/todo-lists/${todolistID}/tasks`,{title: title})
    },
    deleteTask(todolistID: string, taskID: string) {
        return instance.delete<ResponseType>( `/todo-lists/${todolistID}/tasks/${taskID}`)
    },
    updateTaskTitle(todolistID: string, taskID: string, newTitle: string) {
        return instance.put<ResponseType<TaskType>>( `/todo-lists/${todolistID}/tasks/${taskID}`,{title: newTitle})
    }
}
