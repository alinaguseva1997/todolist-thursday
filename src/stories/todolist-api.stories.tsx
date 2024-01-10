import React, {useEffect, useState} from 'react'
import {todolistApi} from "../api/todolist-api";
import {changeTodolistTitleTC} from "../features/TodolistsList/todolists-reducer";

export default {
    title: 'API'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistApi.getTodolist()
            .then((res)=> {
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const title = 'Alina'
        todolistApi.createTodolist(title)
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistID = "8e860116-1642-4320-8aae-d2f5967e1785"
        todolistApi.deleteTodolist(todolistID)
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistID = "c8498aa3-c4b0-4663-b5b4-5009f05b6f03"
        const newTitle = 'DIMYCH'
        todolistApi.updateTodolistTitle(todolistID,newTitle)
            .then((res)=>{
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}