import { tasksReducer } from '../features/TodolistsList/tasks-reducer';
import { todolistsReducer } from '../features/TodolistsList/todolists-reducer';
import {AnyAction, applyMiddleware, combineReducers, createStore} from 'redux';
import {thunk, ThunkDispatch} from "redux-thunk";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})
// непосредственно создаём store
export const store = createStore(rootReducer, applyMiddleware(thunk));
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

//это типизация для useDispatch, когда появляется ошибка:
// Argument of type '(dispatch: Dispatch) => void' is not assignable to parameter of type 'AnyAction' в App
type AppDispatchType = ThunkDispatch<AppRootStateType, unknown, AnyAction>
export const useAppDispatch = useDispatch<AppDispatchType>;
export const useAppSelector: TypedUseSelectorHook<AppRootStateType>  = useSelector // типизация useSelector, которая нужна для того, чтобы указать TS, откуда берутся данные(сокращение типизации)

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
