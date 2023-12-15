import React, {useEffect, useState} from 'react'
import {todolistApi} from "../api/todolist-api";
import {tasksApi} from "../api/tasks-api";

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
        const taskID = '977964f7-7bb8-4f21-be31-dcce61bbef79'
        const newTitle = 'Incubator'
        tasksApi.updateTaskTitle(todolistID, taskID, newTitle)
            .then((res)=>{
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}