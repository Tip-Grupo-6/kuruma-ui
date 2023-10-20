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

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
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

export const MaintenanceItemContext = React.createContext({
    maintenance_item_code: null
})


export const CarPage = (props) => {
    const classes = styles()
    const { id } = useParams();
    const [ car, setCar] = useState(null)
    const [ status, setStatus] = useState(null)
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = React.useState(false);
    const [maintenanceItemSelected, setMaintenanceItemSelected] = useState(null)

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
        setMaintenanceItemSelected(status.code)
    }

    const closeAlert = () => {
        setOpen(false)
        setMaintenanceItemSelected(null)
    }

    const openFormModal = () => {
        setOpen(false)
        setOpenModal(true)
    }

    const getStatusIcon = (statusColor) => {
        switch (statusColor) {
            case "red":
                return <ErrorOutlineIcon style={{color: "red"}}/>;
            case "yellow":
                return <WarningAmberIcon style={{color: "rgb(237, 108, 2)"}}/>;
            default:
                return <TaskAltIcon style={{color: "green"}}/>;
        }
    }

    return (
        <div className={classes.card}>
            <MaintenanceItemContext.Provider value={{maintenanceItemSelected}}>
            <div className={classes.carStatus}>
                { car && (
                <StatusAlert status={status} open={open} onClose={closeAlert}/>
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
                                            {getStatusIcon(row.status_color)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
            <AnimatedCard car={car} />
            </MaintenanceItemContext.Provider>
        </div>
    )
}