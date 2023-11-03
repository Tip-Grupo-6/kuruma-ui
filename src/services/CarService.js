const URL_IP = 'http://192.168.0.10:8080'
const URL = 'http://localhost:8080'
// const URL = URL_IP

export const fetchCars = async () => {
    const url = `${URL}/cars`
    const response = await fetch(url)
    return await response.json()
}

export const fetchCarById = async (id) => {
    const url = `${URL}/cars/${id}`
    const response = await fetch(url)
    return await response.json()
}

export const fetchMaintenanceItems = async () => {
    const url = `${URL}/maintenance_items`
    const response = await fetch(url)
    return await response.json()
}

export const createCar = async (car) => {
    const url = `${URL}/cars`
    const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(car)
    })
    return await response.json()
}

export const updateCar = async (id, car) => {
    const url = `${URL}/cars/${id}`
    const response = await fetch(url, {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(car)
    })
    return await response.json()
}

export const patchCar = async (id, car) => {
    const url = `${URL}/cars/${id}`
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(car)
    })
    return await response.json()
}

export const findBrands = async (year) => {
    const url = `${URL}/v2/car_data/makes?year=${year}`
    const response = await fetch(url)
    return await response.json()
}

export const findModels = async (year, brand) => {
    const url = `${URL}/v2/car_data/models?year=${year}&make_id=${brand}`
    const response = await fetch(url)
    return await response.json()
}