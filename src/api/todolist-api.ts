import axios, {AxiosResponse} from "axios";

export type TodolistType = {
    id: string,
    title: string,
    addedDate: string,
    order: number
}

type ResponseType<T = {}> = {
    data: T
    fieldsError: string[]
    messages: string[]
    resultCode: number
}

const instance = axios.create({
    withCredentials: true,
    baseURL: 'https://social-network.samuraijs.com/api/1.1'
})

export const todolistApi = {
    getTodolist() {
        return instance.get<TodolistType[]>('/todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{item: TodolistType}>, AxiosResponse<ResponseType<{item: TodolistType}>>, {title:string}>('/todo-lists',{title: title})
    },
    deleteTodolist(todolistID: string) {
        return instance.delete<ResponseType>( `/todo-lists/${todolistID}`)
    },
    updateTodolistTitle(todolistID: string, newTitle: string) {
        return instance.put<ResponseType, AxiosResponse<ResponseType>,{title:string}>( `/todo-lists/${todolistID}`,{title: newTitle})
    }
}
