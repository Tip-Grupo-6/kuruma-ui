export const fetchCars = async () => {
    return Promise.resolve([
        {id: 1, name: "Peugeot 208", url: "/images/peugeot-208.jpg"},
        {id: 2, name: "Peugeot 209", url: "/images/peugeot-208.jpg"},
        {id: 3, name: "Peugeot 210", url: "/images/peugeot-208.jpg"},
        {id: 4, name: "Peugeot 308", url: "/images/peugeot-208.jpg"},
    ])
}