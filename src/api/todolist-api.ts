import axios from "axios";

const instance = axios.create({
    withCredentials: true,
    baseURL: 'https://social-network.samuraijs.com/api/1.1'
})

export const todolistApi = {
    getTodolist() {
        return instance.get('/todo-lists')
    },
    createTodolist(title: string) {
        return instance.post('/todo-lists',{title: title})
    },
    deleteTodolist(todolistID: string) {
        return instance.delete( `/todo-lists/${todolistID}`)
    },
    updateTodolistTitle(todolistID: string, newTitle: string) {
        return instance.put( `/todo-lists/${todolistID}`,{title: newTitle})
    }
}
