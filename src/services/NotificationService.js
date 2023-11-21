import {URL} from './ApiServiceConstant'
import apiClient from "./ApiClient";


export const fetchNotifications = async (car_id, accessToken) => {
    const url = `${URL}/notifications`
    return apiClient.get(url, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
}

export const createNotification = async (notification, accessToken) => {
    const url = `${URL}/notifications`
    return apiClient.post(url, notification, {
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
}

export const updateNotification = async (id, notification, accessToken) => {
    const url = `${URL}/notifications/${id}`
    return apiClient.put(url, notification, {
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
}

export const deleteNotification = async (id, accessToken) => {
    const url = `${URL}/notifications/${id}`
    return apiClient.delete(url, {
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
}