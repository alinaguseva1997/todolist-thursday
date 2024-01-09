import React, {useEffect, useState} from 'react'
import {todolistApi} from "../api/todolist-api";
import {tasksApi, UpdateTaskModelType} from "../api/tasks-api";

export default {
    title: 'API'
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistID = 'bebf3548-d4bf-4169-9eb7-caa5fccb0865'
        tasksApi.getTasks(todolistID)
            .then((res) => setState(res.data))
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistID = 'c8498aa3-c4b0-4663-b5b4-5009f05b6f03'
        const title = 'butter'
        tasksApi.createTask(todolistID,title)
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistID = 'bebf3548-d4bf-4169-9eb7-caa5fccb0865'
        const taskID = '701fbfa8-16a6-40cf-b5a0-dccddd62de99'
        tasksApi.deleteTask(todolistID, taskID)
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTaskTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistID = 'bebf3548-d4bf-4169-9eb7-caa5fccb0865'
        const taskID = '63018977-bf5c-4add-95a4-3c7586e330d4'
        const model = {
            title: 'Incubator',
            status: 0,
            deadline: '',
            description: '',
            priority: 1,
            startDate: ''
        }
        tasksApi.updateTask(todolistID, taskID, model)
            .then((res)=>{
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}