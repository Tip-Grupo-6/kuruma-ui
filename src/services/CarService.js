import {URL} from './ApiServiceConstant'
import apiClient from "./ApiClient";

export const fetchCars = async (accessToken) => {
    const url = `${URL}/cars`
    return apiClient.get(url, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
}

export const fetchCarById = async (id, accessToken) => {
    const url = `${URL}/cars/${id}`
    return apiClient.get(url, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
}

export const fetchMaintenanceItems = async (accessToken) => {
    const url = `${URL}/maintenance_items`
    return apiClient.get(url, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
}

export const createCar = async (car, accessToken) => {
    const url = `${URL}/cars`
    return apiClient.post(url, car, {
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
}

export const updateCar = async (id, car, accessToken) => {
    const url = `${URL}/cars/${id}`
    return apiClient.put(url, car, {
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
}

export const patchCar = async (id, car, accessToken) => {
    const url = `${URL}/cars/${id}`
    return apiClient.patch(url, car, {
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
    })
}

export const findBrands = async (year, accessToken) => {
    const url = `${URL}/v2/car_data/makes?year=${year}`
    return apiClient.get(url, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
}

export const findModels = async (year, brand, accessToken) => {
    const url = `${URL}/v2/car_data/models?year=${year}&make_id=${brand}`
    return apiClient.get(url, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
}

export const findCarInfo = async (year, brand, model, accessToken) => {
    const url = `${URL}/v2/car_data/model_details?year=${year}&make_id=${brand}&model_id=${model}`
    return apiClient.get(url, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
}