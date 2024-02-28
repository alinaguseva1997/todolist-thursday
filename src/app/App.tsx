import React, {useEffect} from 'react'
import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {Menu} from '@mui/icons-material';
import {TaskType} from "../api/tasks-api";
import {TodolistsList} from "../features/TodolistsList/TodolistsList";
import LinearProgress from "@mui/material/LinearProgress";
import {useAppDispatch, useAppSelector} from "./store";
import {RequestStatusType} from "./app-reducer";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Login} from "../features/Login/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import {logOutTC, meTC} from "../features/Login/auth-reducer";
import {CircularProgress} from "@mui/material";

export type TasksStateType = {
    [key: string]: TaskType[]
}

function App() {

    const dispatch = useAppDispatch()
    const status = useAppSelector<RequestStatusType>(state => state.app.status)
    const isInitialized = useAppSelector(state => state.app.isInitialized)
    const isLogged = useAppSelector(state => state.auth.isLogged)

    useEffect(() => {
        dispatch(meTC())
    }, []);

    if (!isInitialized) {
       return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    const logOut = () => {
        dispatch(logOutTC())
    }

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu">
                        <ErrorSnackbar />
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    { isLogged && <Button onClick={logOut} color="inherit">LOG OUT</Button>}
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgress color="info" />}
            <Container fixed>
                <Routes>
                    <Route path={'/'} element={<TodolistsList/>}/>
                    <Route path={'/login'} element={<Login/>}/>
                    <Route path={'/404'} element={<h4>404: PAGE NOT FOUND</h4>}/>
                    <Route path={'*'} element={<Navigate to={'/404'}/>}/> //при попадании на любой несуществующий путь мы делаем перенаправление на 404
                </Routes>
            </Container>
        </div>
    );
}

export default App;