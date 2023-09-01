export const fetchCars = async () => {
    const url = 'http://localhost:8080/cars'
    const response = await fetch(url)
    return await response.json()
}

export const fetchCarById = async (id) => {
    const url = `http://localhost:8080/cars/${id}`
    const response = await fetch(url)
    return await response.json()
}