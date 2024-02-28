import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from "formik";
import {getIsLoggedTC} from "./auth-reducer";
import {useAppDispatch, useAppSelector} from "../../app/store";
import {Navigate} from "react-router-dom";

type FormikErrorType = {
    email? : string
    password? : string
    rememberMe? : boolean
}

export type LoginDataType = {
    email: string
    password: string
    rememberMe: boolean
}

export const Login = () => {
    const dispatch = useAppDispatch()
    const isLogged = useAppSelector(state => state.auth.isLogged)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate: (values) => {
            const errors: FormikErrorType = {}
            if (!values.email) {
                errors.email = 'Required'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }
            if (!values.password) {
                errors.password = 'Required'
            } else if(values.password.length <= 3) {
                errors.password = 'Must be more three symbols'
            }
            return errors
        },
        onSubmit: values => {
            dispatch(getIsLoggedTC(values))
            formik.resetForm()
        },
    })

    if(isLogged) {
        return <Navigate to={'/'}/>
    }

    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <FormControl>
                <form onSubmit={formik.handleSubmit}>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'}> here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField label="Email"
                                   margin="normal"
                                   error = {!!formik.errors.email}
                                   helperText={formik.touched.email && formik.errors.email }
                                   {...formik.getFieldProps('email')}
                        />
                        <TextField type="password"
                                   label="Password"
                                   margin="normal"
                                   error = {!!formik.errors.password}
                                   {...formik.getFieldProps('password')}
                        />
                        {formik.touched.password && formik.errors.password ? <div style={{color: 'red'}}>{formik.errors.password}</div> : null}
                        <FormControlLabel label={'Remember me'}
                                          control={<Checkbox
                                              name={'rememberMe'}
                                              checked={formik.values.rememberMe}
                                              onChange={formik.handleChange}/>}
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>
                            Login
                        </Button>
                    </FormGroup>
                </form>
            </FormControl>
        </Grid>
    </Grid>
}