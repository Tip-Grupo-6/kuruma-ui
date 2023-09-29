import {makeStyles} from "@material-ui/core/styles";
import React, {useEffect, useState} from "react";
import {AnimatedCard} from "./AnimatedCard";
import {useParams} from "react-router-dom";
import {fetchCarById} from "../../services/CarService";
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow
} from "@mui/material";

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import {StatusAlert} from "./StatusAlert";
import {CarModalForm} from "./CarModalForm";
import {getIconByCode} from "../../utils/MaintenanceItemsUtils";


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
    const [openModal, setOpenModal] = React.useState(false);

    useEffect(() => {
        if(!id) {
            setCar(null)
        }
        if(id) {
            fetchCarById(id).then(data => {
                if(!data.status) {
                    setCar(data)
                }
            }).catch(e => console.log(e))
        }
    }, [id])

    const getMaintenanceData = () => {
        return car?.maintenance_values.map(car_item => {
            return { ...car_item, component: getIconByCode(car_item.code) }
        }) || []
    }

    const openAlert = (status) => {
        setOpen(true)
        setStatus(status)
    }

    const openFormModal = () => {
        setOpen(false)
        setOpenModal(true)
    }

    return (
        <div className={classes.card}>
            <div className={classes.carStatus}>
                { car && (
                <StatusAlert status={status} open={open} onClose={() => setOpen(false)}/>
                )}
                <div className={classes.statusTable}>
                    <Button variant="outlined" onClick={openFormModal} style={{marginBottom: '5px', width: "100%"}}>
                        {car ? "Editar" : "Nuevo"}
                    </Button>
                    <CarModalForm car={car} open={openModal} closeModal={() => setOpenModal(false)} />

                    <TableContainer component={Paper} >
                        <Table  aria-label="simple table">
                            <TableBody className={classes.tableBody}>
                                {getMaintenanceData().map((row) => (
                                    <TableRow key={row.name}
                                        className={classes.tableRow}
                                        onClick={() => openAlert(row)}
                                        style={{cursor: "pointer"}}
                                    >
                                        <TableCell component="th" scope="row">{row.component}</TableCell>
                                        <TableCell align="right">
                                            {!row.due_status
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
            <AnimatedCard car={car} />
        </div>
    )
}