import {URL} from './ApiServiceConstant'

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
    const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        // mode: "no-cors",
        body: JSON.stringify(loginRequest)
    })
    return await response.json()
}
