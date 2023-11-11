import {URL} from './ApiServiceConstant'

export const fetchNotifications = async (car_id) => {
    const url = `${URL}/notifications`
    const response = await fetch(url)
    return await response.json()
}

export const createNotification = async (notification) => {
    const url = `${URL}/notifications`
    const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(notification)
    })
    return await response.json()
}

export const updateNotification = async (id, notification) => {
    const url = `${URL}/notifications/${id}`
    const response = await fetch(url, {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(notification)
    })
    return await response.json()
}

export const deleteNotification = async (id) => {
    const url = `${URL}/notifications/${id}`
    return await fetch(url, {
        method: 'DELETE',
        headers: {'Content-Type':'application/json'}
    })
}