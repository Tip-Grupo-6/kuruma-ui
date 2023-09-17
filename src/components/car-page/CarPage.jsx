import {makeStyles} from "@material-ui/core/styles";
import React, {useEffect, useState} from "react";
import {AnimatedCard} from "./AnimatedCard";
import {useParams} from "react-router-dom";
import {fetchCarById} from "../../services/CarService";
import {
    Alert, AlertTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
} from "@mui/material";

import WaterDropIcon from '@mui/icons-material/WaterDrop';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import TireRepairIcon from '@mui/icons-material/TireRepair';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import {StatusAlert} from "./StatusAlert";


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
    },
    carStatus: {
        display: "flex",
        flexDirection: "column-reverse",
        [theme.breakpoints.up("sm")]: {
            display: "block",
        }
    },
    statusTable: {
        right: "70px",
        [theme.breakpoints.up("sm")]: {
            position: "absolute",
            paddingTop: "25px"
        }
    },
    tableBody: {
        display: "flex !important",
        [theme.breakpoints.up("sm")]: {
            display: "block !important"
        }
    },
    tableRow: {
        "&:not(:last-child)": {
            borderRight: "2px solid rgb(210, 210, 210)",
        },
        [theme.breakpoints.up("sm")]: {
            "&:not(:last-child)": {
                borderRight: 0,
            },
            '&:last-child td, &:last-child th': {
                border: 0
            }
        }
    }
}))

export const CarPage = (props) => {
    const classes = styles()
    const { id } = useParams();
    const [ car, setCar] = useState(null)
    const [ status, setStatus] = useState(null)
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if(!id) {
            setCar(null)
        }
        fetchCarById(id).then(data => {
            if(!data.status) {
                setCar(data)
            }
        }).catch(e => console.log(e))
    }, [id])

    const getDataMaintenance = () => {
        return [
            { name: "aceite", status: !car.maintenance_values?.oil_change_due, component: <LocalGasStationIcon />,
                last_change: car.last_oil_change, next_change_due: car.maintenance_values?.next_oil_change_due},

            { name: "agua", status: !car.maintenance_values?.water_check_due, component: <WaterDropIcon />,
                last_change: car.last_water_check, next_change_due: car.maintenance_values?.next_water_check_due},

            { name: "presión de los neumáticos", status: !car.maintenance_values?.tire_pressure_check_due, component: <TireRepairIcon />,
                last_change: car.last_tire_pressure_check, next_change_due: car.maintenance_values?.next_tire_pressure_check_due},
        ]
    }

    const openAlert = (status) => {
        setOpen(true)
        setStatus(status)
    }

    return (
        <div className={classes.card}>
            {car && (
            <div className={classes.carStatus}>
                <StatusAlert status={status} open={open} onClose={() => setOpen(false)}/>
                <div className={classes.statusTable}>
                    <TableContainer component={Paper} >
                        <Table  aria-label="simple table">
                            <TableBody className={classes.tableBody}>
                                {getDataMaintenance().map((row) => (
                                    <TableRow key={row.name}
                                        className={classes.tableRow}
                                        onClick={() => openAlert(row)}
                                        style={{cursor: "pointer"}}
                                    >
                                        <TableCell component="th" scope="row">{row.component}</TableCell>
                                        <TableCell align="right">
                                            {row.status
                                                ? <CheckCircleOutlineIcon style={{color: "green"}}/>
                                                : <CancelIcon style={{color: "red"}}/> }
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
            )}
            <AnimatedCard car={car} />
        </div>
    )
}