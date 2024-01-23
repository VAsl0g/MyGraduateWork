import {
    $authHost,
    $host
} from "./index";
import jwt_decode from "jwt-decode"

export const registration = async (email, login, password) => {
    const results = await $host.post('/api/auth/registration', {
            email,
            login,
            password
        }).then(({
            data
        }) => {
            localStorage.setItem('token', data.token)
            return jwt_decode(data.token)
        })
        .catch((error) => {
            if (error.response) {
                console.log(error.response.data)
                return error.response.data;
            }
        })
    return results
}

export const login = async (email, password) => {
    const results = await $host.post('/api/auth/login', {
            email,
            password
        }).then(({
            data
        }) => {
            localStorage.setItem('token', data.token)
            return jwt_decode(data.token)
        })
        .catch((error) => {
            if (error.response) {
                return error.response.data;
            }
        })
    return results
}

export const check = async () => {
    const {
        data
    } = await $authHost.get('/api/auth/auth')
    console.log(data)
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const getUser = async (id) => {
    const {
        data
    } = await $host.get('/api/user/' + id)
    return data
}

export const changeUser = async (userData) => {
    const {
        data
    } = await $authHost.put('/api/user', userData)
    return data
}


export const blockedUser = async (id) => {
    const { data } = await $authHost.put('/api/user/blocked/'+id)
    return data
}