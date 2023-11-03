// Convert from degrees to radians
const degreesToRadians = (degrees) => {
    return (degrees * Math.PI) / 180;
}

export const calcDistance = (originCoords, destinationCoords) => {
    let startingLat = degreesToRadians(originCoords.latitude);
    let startingLong = degreesToRadians(originCoords.longitude);
    let destinationLat = degreesToRadians(destinationCoords.latitude);
    let destinationLong = degreesToRadians(destinationCoords.longitude);

    // Radius of the Earth in kilometers
    let radius = 6571;

    // Haversine equation
    return Math.acos(
        Math.sin(startingLat) * Math.sin(destinationLat) +
        Math.cos(startingLat) * Math.cos(destinationLat) * Math.cos(startingLong - destinationLong)) * radius;
}