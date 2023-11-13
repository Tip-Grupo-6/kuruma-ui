import {makeStyles} from "@material-ui/core/styles";
import React, {useEffect, useState} from "react";
import {AnimatedCard} from "./AnimatedCard";
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
import {TripButton} from "./TripButton";
import {useUserLogged} from "../context/UserLogged";
import {jwtDecode} from "jwt-decode";
import {redirect} from "react-router-dom";


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
        "& th": {
          width: '100%'
        },
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
    },
    button: {
        marginBottom: '5px !important',
        width: "100%",
        display: 'block',
        [theme.breakpoints.up("sm")]: {
            width: '180px'
        }
    }
}))

export const MaintenanceItemContext = React.createContext({
    maintenance_item_code: null
})


export const CarPage = (props) => {
    const classes = styles()
    const [ car, setCar] = useState(null)
    const [ status, setStatus] = useState(null)
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = React.useState(false);
    const [maintenanceItemSelected, setMaintenanceItemSelected] = useState(null)
    const accessToken = localStorage.getItem("accessToken")

    useEffect(() => {
        const tokenData = jwtDecode(accessToken)
        const carId = tokenData?.user?.car_id || car.id
        if(carId) {
            fetchCarById(tokenData.user.car_id, accessToken).then(data => {
                if(!data.status) {
                    setCar(data)
                }
            }).catch(e => console.log(e))
        }
    }, [])

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

    const onCarCreation = (id) => {
        fetchCarById(id, accessToken).then(data => {
            if(!data.status) {
                setCar(data)
                redirect(0) // redirecciono
            }
        }).catch(e => console.log(e))
    }



    return (
        <div className={classes.card}>
            <MaintenanceItemContext.Provider value={{maintenanceItemSelected}}>
            <div className={classes.carStatus}>
                { car && (
                <StatusAlert status={status} open={open} onClose={closeAlert}/>
                )}
                <div className={classes.statusTable}>
                    { car && (
                    <TripButton car={car}/>
                    )}
                    <Button variant="outlined" onClick={openFormModal} className={classes.button}>
                        {car ? "Editar" : "Nuevo"}
                    </Button>
                    <CarModalForm car={car} open={openModal} closeModal={() => setOpenModal(false)} onCreation={onCarCreation}/>

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