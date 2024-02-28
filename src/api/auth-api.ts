import axios, {AxiosResponse} from "axios";
import {ResponseType} from "./todolist-api";
import {LoginDataType} from "../features/Login/Login";

const instance = axios.create({
    withCredentials: true,
    baseURL: 'https://social-network.samuraijs.com/api/1.1'
})

export const authApi = {
    me() {
        return instance.get<ResponseType<AuthResponseDataType>>('/auth/me')
    },
    login(data: LoginDataType) {
       return instance.post<ResponseType<{userId: number}>, AxiosResponse<ResponseType<{userId: number}>>, LoginDataType>('/auth/login', data)
    }
}

//types
type AuthResponseDataType = {
    id: number
    email: string
    login: string
}