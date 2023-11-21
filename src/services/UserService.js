import {URL} from './ApiServiceConstant'
import apiClient from "./ApiClient";

export const onboarding = async (user) => {
    const url = `${URL}/auth/register`
    return apiClient.post(url, user, {
        headers: {'Content-Type':'application/json'},
    })
}

export const login = async (loginRequest) => {
    const url = `${URL}/auth/login`
    return apiClient.post(url, loginRequest, {
        headers: {'Content-Type':'application/json'},
    })
}
