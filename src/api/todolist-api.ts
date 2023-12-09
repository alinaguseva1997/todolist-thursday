import axios from "axios";

type TodolistType = {
    id: string,
    title: string,
    addedDate: Date,
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
        return instance.get<Array<TodolistType>>('/todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{item: TodolistType}>>('/todo-lists',{title: title})
    },
    deleteTodolist(todolistID: string) {
        return instance.delete<ResponseType>( `/todo-lists/${todolistID}`)
    },
    updateTodolistTitle(todolistID: string, newTitle: string) {
        return instance.put<ResponseType>( `/todo-lists/${todolistID}`,{title: newTitle})
    }
}
