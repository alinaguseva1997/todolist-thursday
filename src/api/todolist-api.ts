import axios, {AxiosResponse} from "axios";

const instance = axios.create({
    withCredentials: true,
    baseURL: 'https://social-network.samuraijs.com/api/1.1'
})

export const todolistApi = {
    getTodolist() {
        return instance.get<Array<TodolistType>>('/todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{item: TodolistType}>, AxiosResponse<ResponseType<{item: TodolistType}>>, {title:string}>('/todo-lists',{title: title})
    },
    deleteTodolist(todolistID: string) {
        return instance.delete<ResponseType>( `/todo-lists/${todolistID}`)
    },
    updateTodolistTitle(todolistID: string, newTitle: string) {
        return instance.put<ResponseType>( `/todo-lists/${todolistID}`,{title: newTitle})
    }
}

//types
export type TodolistType = {
    id: string,
    title: string,
    addedDate: string,
    order: number
}
export type ResponseType<T = {}> = {
    data: T
    fieldsError: string[]
    messages: string[]
    resultCode: number
}
