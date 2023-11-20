import {URL} from "./ApiServiceConstant";

export const createSubscription = async (subscription, accessToken) => {
    const url = `${URL}/suscriptions`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(subscription)
    })
    return await response.json()
}

export const deleteSubscription = async (body, accessToken) => {
    const url = `${URL}/suscriptions`
    return fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(body)
    })
}

export const tryPushNotification = async (subscription, accessToken) => {
    const url = `${URL}/push-notifications`
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(subscription)
    })
}