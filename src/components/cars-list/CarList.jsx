import {makeStyles} from "@material-ui/core/styles";
import {CarItem} from "./CarItem";
import {useEffect, useState} from "react";
import { fetchCars } from "../../services/CarService";

const styles = makeStyles(theme => ({
    cardList: {
        display: "grid",
        gridTemplateColumns: "repeat(1, minmax(0,1fr))",
        gap: "1rem",
        margin: "20px",
        boxSizing: "content-box",
        [theme.breakpoints.up("sm")]: {
            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
        },
        [theme.breakpoints.up("md")]: {
            gridTemplateColumns: "repeat(4, minmax(0,1fr))",
        }
    }
}))

export const CarList = () => {

    const classes = styles()
    const [cars, setCars] = useState([])

    useEffect(() => {
        fetchCars().then(data => {
            setCars(data)
        })
    }, [])

    return (
        <div className={classes.cardList}>
            {cars.map(car => (
                <CarItem key={`car-${car.id}`} name={car.name} urlImage={car.url} />
            ))}
        </div>
    )
}