import axios, {AxiosResponse} from "axios";
import {ResponseType} from "./todolist-api";
import {RequestStatusType} from "../app/app-reducer";

const instance = axios.create({
    withCredentials: true,
    baseURL: 'https://social-network.samuraijs.com/api/1.1'
})

export const authApi = {
    login(data: any) {
        instance.post('/auth/login', {data})
    }
}