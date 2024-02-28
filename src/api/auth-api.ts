import axios, {AxiosResponse} from "axios";
import {ResponseType} from "./todolist-api";
import {LoginDataType} from "../features/Login/Login";

const instance = axios.create({
    withCredentials: true,
    baseURL: 'https://social-network.samuraijs.com/api/1.1'
})

export const authApi = {
    me() {
        return instance.get<ResponseType<UserDataType>>('/auth/me')
    },
    login(data: LoginDataType) {
       return instance.post<ResponseType<{userId: number}>, AxiosResponse<ResponseType<{userId: number}>>, LoginDataType>('/auth/login', data)
    },
    logOut() {
        return instance.delete<ResponseType>('/auth/login')
    }
}

//types
type UserDataType = {
    id: number
    email: string
    login: string
}