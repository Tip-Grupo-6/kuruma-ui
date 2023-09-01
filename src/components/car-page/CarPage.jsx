import {useParams} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import {useEffect, useState} from "react";
import {fetchCarById} from "../../services/CarService";
import WaterDamageIcon from '@mui/icons-material/WaterDamage';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import TireRepairIcon from '@mui/icons-material/TireRepair';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import {List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";

const styles = makeStyles(theme => ({
    card: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "auto",
        height: "500px",
        backgroundColor: "#FFFFFF",
        borderRadius: "5px",
        padding: "20px",
        margin: "20px",
        [theme.breakpoints.up("sm")]: {
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
        }
    },
    carrousel: {
        display: "flex",
        justifyContent: "center"
    },
    cardImage: {
        width: "auto",
        height: "471px",
        borderRadius: "5px"
    },
    carTitle: {
        display: "flex",
        alignItems: "center",
        marginTop: "0"
    }
}))

export const CarPage = () => {
    const classes = styles()
    const { id } = useParams();
    const [ car, setCar] = useState([])

    useEffect(() => {
        fetchCarById(id).then(data => {
            setCar(data)
        })
    }, [id])



    return (
        <div className={classes.card}>
            <div className={classes.carrousel}>
                {/*<img src={"/images/peugeot_208_perfil.jpg"} alt={"peugeot 208"} className={classes.cardImage}/>*/}
                <img src={`/images/${car.image}`} alt={"peugeot 208"} className={classes.cardImage}/>
            </div>
            <div style={{padding: "10px"}}>
                <h1 className={classes.carTitle}>{car.brand} {car.model}<DirectionsCarIcon fontSize={'large'} style={{marginLeft: "10px", color: car.car_status}}/></h1>
                <h2 style={{marginTop: 0}}>{car.years}</h2>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <WaterDamageIcon fontSize={'large'} style={{color: car.car_status}}/>
                            </ListItemIcon>
                            <ListItemText primary="Cambio de agua" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <LocalGasStationIcon fontSize={'large'} style={{color: car.car_status}}/>
                            </ListItemIcon>
                            <ListItemText primary="Cambio de aceite" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton >
                            <ListItemIcon>
                                <TireRepairIcon fontSize={'large'} style={{color: car.car_status}}/>
                            </ListItemIcon>
                            <ListItemText primary="Ruedas" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </div>
        </div>
    )
}