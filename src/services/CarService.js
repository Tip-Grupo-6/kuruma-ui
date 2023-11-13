import {URL} from './ApiServiceConstant'
import axios from "axios";

export const fetchCars = async (accessToken) => {
    const url = `${URL}/cars`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    return await response.json()
}

export const fetchCarById = async (id, accessToken) => {
    const url = `${URL}/cars/${id}`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Access-Control-Allow-Origin': '*',
        }
    })
    return await response.json()
}

export const fetchMaintenanceItems = async (accessToken) => {
    const url = `${URL}/maintenance_items`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    return await response.json()
}

export const createCar = async (car, accessToken) => {
    const url = `${URL}/cars`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(car)
    })
    return await response.json()
}

export const updateCar = async (id, car, accessToken) => {
    const url = `${URL}/cars/${id}`
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(car)
    })
    return await response.json()
}

export const patchCar = async (id, car, accessToken) => {
    const url = `${URL}/cars/${id}`
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(car)
    })
    return await response.json()
}

export const findBrands = async (year, accessToken) => {
    const url = `${URL}/v2/car_data/makes?year=${year}`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
    })
    return await response.json()
}

export const findModels = async (year, brand, accessToken) => {
    const url = `${URL}/v2/car_data/models?year=${year}&make_id=${brand}`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
    })
    return await response.json()
}