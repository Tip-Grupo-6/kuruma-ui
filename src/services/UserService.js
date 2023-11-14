import {URL} from './ApiServiceConstant'
import axios from "axios";

export const onboarding = async (user) => {
    const url = `${URL}/auth/register`
    const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(user)
    })
    return await response.json()
}

export const login = async (loginRequest) => {
    const url = `${URL}/auth/login`
    return axios.post(url, loginRequest, {
        headers: {'Content-Type':'application/json'},
    })
}
