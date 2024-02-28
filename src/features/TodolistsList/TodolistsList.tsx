import {useAppDispatch, useAppSelector} from "../../app/store";
import {
    addTodolistTC,
    changeTodolistFilterAC,
    changeTodolistTitleTC,
    FilterValuesType,
    removeTodolistTC,
    setTodolistsTC,
    TodolistDomainType
} from "./todolists-reducer";
import React, {useCallback, useEffect} from "react";
import {addTasksTC, removeTasksTC, updateTaskTC} from "./tasks-reducer";
import {TaskStatuses} from "../../api/tasks-api";
import Grid from "@mui/material/Grid";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import Paper from "@mui/material/Paper";
import {Todolist} from "./Todolist/Todolist";
import {TasksStateType} from "../../app/App";
import {Navigate} from "react-router-dom";

export const TodolistsList = () => {
    // протипизированный useSelector, который позволяет указывать в типизации только тип данных,
// которые мы хотим получить, без указания первого параметра - типа, каким является наш AppRootStateType
    const todolists = useAppSelector<Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useAppSelector<TasksStateType>(state => state.tasks)
    const isLogged = useAppSelector(state => state.auth.isLogged)
    const dispatch = useAppDispatch(); //протипизированный Dispatch, который помогает понять TS, что dispatch может теперь принимать еще и thunk, а не только action

    useEffect(() => {
        if(!isLogged) return //это нужно для того, чтобы не шел запрос за тудулистами, если мы не авторизованы. Проблема: шел лишний запрос
        dispatch(setTodolistsTC())
    }, [])

    const removeTask = useCallback(function (id: string, todolistId: string) {
        dispatch(removeTasksTC(todolistId, id))
    }, []);
    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(addTasksTC(todolistId, title));
    }, []);
    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        dispatch(updateTaskTC(todolistId, id, {status: status}));
    }, []);
    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        dispatch(updateTaskTC(todolistId, id, {title: newTitle}))
    }, []);
    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        dispatch(changeTodolistFilterAC(todolistId, value))
    }, []);
    const removeTodolist = useCallback(function (id: string) {
        dispatch(removeTodolistTC(id))
    }, []);
    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        dispatch(changeTodolistTitleTC(id, title))
    }, []);
    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch]);

    if(!isLogged) {
        return <Navigate to={'/login'} />
    }

    return (
        <>
            <Grid container style={{padding: '20px'}}>
                <AddItemForm addItem={addTodolist}/>
            </Grid>
            <Grid container spacing={3}>
                {
                    todolists.map(tl => {
                        let allTodolistTasks = tasks[tl.id];
                        return (
                            <Grid item key={tl.id}>
                                <Paper style={{padding: '10px'}}>
                                    <Todolist
                                        id={tl.id}
                                        title={tl.title}
                                        tasks={allTodolistTasks}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeTaskStatus={changeStatus}
                                        filter={tl.filter}
                                        entityStatus={tl.entityStatus}
                                        removeTodolist={removeTodolist}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTodolistTitle={changeTodolistTitle}
                                    />
                                </Paper>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </>
    )
}