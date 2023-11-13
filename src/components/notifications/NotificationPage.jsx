import {makeStyles} from "@material-ui/core/styles";
import {Button, Card, CardContent} from "@mui/material";
import React, {useEffect, useState} from "react";
import {NotificationModal} from "./NotificationModal";
import {ConfirmModal} from "../modal/ConfirmModal";
import Typography from "@mui/material/Typography";
import {deleteNotification, fetchNotifications} from "../../services/NotificationService";
import {getIconByCode} from "../../utils/MaintenanceItemsUtils";
import {fetchCarById} from "../../services/CarService";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const styles = makeStyles(theme => ({
    card: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "auto",
        height: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: "5px",
        padding: "20px",
        margin: "20px",
    },
    title: {
        fontFamily: 'Altone Trial, Raleway, sans-serif',
        marginBottom: 0
    },
    flexRight: {
      display: 'flex',
      justifyContent: 'right'
    },
    button: {
        marginBottom: '5px !important',
        width: "100%",
        display: 'block',
        [theme.breakpoints.up("sm")]: {
            width: '180px'
        }
    },
    notificationList: {
        display: "grid",
        gridTemplateColumns: "repeat(1, minmax(0,1fr))",
        gap: "1rem",
        margin: "20px",
        boxSizing: "content-box",
        [theme.breakpoints.up("sm")]: {
            gridTemplateColumns: "repeat(2, minmax(0,1fr))",
        },
        [theme.breakpoints.up("md")]: {
            gridTemplateColumns: "repeat(4, minmax(0,1fr))",
        }
    },
    titleCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
    },
    titleCardDescription: {
        marginLeft: '10px'
    },
    iconEdit: {
        color: "rgb(255, 255, 255)",
        backgroundColor: "rgb(25, 118, 210)",
        borderRadius: '5px',
        cursor: 'pointer',
        margin: '5px'
    },
    iconDelete: {
        color: "rgb(255, 255, 255)",
        backgroundColor: "red",
        borderRadius: '5px',
        cursor: 'pointer',
        margin: '5px'
    }
}))

export const NotificationPage = () => {

    const classes = styles()
    const [openModal, setOpenModal] = useState(false)
    const [openConfirmModal, setOpenConfirmModal] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [car, setCar] = useState(null)
    const id = 1
    const navigate = useNavigate();
    const [notificationSelected, setNotificationSelected] = useState(null)
    const accessToken = localStorage.getItem("accessToken")

    useEffect(() => {
        if(!id) {
            setCar(null)
        }
        if(id) {
            fetchCarById(id, accessToken).then(data => {
                if(!data.status) {
                    setCar(data)
                }
            }).catch(e => console.log(e))
        }
    }, [id])

    useEffect(() => {
        if(car) {
            fetchNotifications(car.id, accessToken)
                .then(data => setNotifications(data))
                .catch(e => console.log(e))
        }
    }, [car])

    const openFormModal = () => setOpenModal(true)

    const getIconForItem = (notification) => {
        const maintenanceItem = car.maintenance_values?.find(maintenanceItem => maintenanceItem.id === notification.maintenance_item_id)
        return getIconByCode(maintenanceItem.code)
    }

    const getDescriptionForItem = (notification) => {
        const maintenanceItem = car.maintenance_values?.find(maintenanceItem => maintenanceItem.id === notification.maintenance_item_id)
        return maintenanceItem.name
    }

    const editNotification = (notification) => {
        setNotificationSelected(notification)
        setOpenModal(true)
    }

    const closeModal = () => {
        setOpenModal(false)
        setNotificationSelected(null)
    }

    const openModalDeleteNotification = (notification) => {
        setNotificationSelected(notification)
        setOpenConfirmModal(true)
    }

    const confirmDelete = () => {
        deleteNotification(notificationSelected.id, accessToken)
            .then(() => navigate(0) /* recargo la pagina*/)
        setOpenConfirmModal(false)
    }

    return (
        <div className={classes.card}>
            <h2 className={classes.title}>Notificaciones</h2>
            <div className={classes.flexRight}>
                <Button variant="outlined" onClick={openFormModal} className={classes.button}>
                    Nuevo
                </Button>
            </div>
            <NotificationModal car={car} notification={notificationSelected} open={openModal} closeModal={closeModal} />
            <ConfirmModal open={openConfirmModal} onClose={() => setOpenConfirmModal(false)}
                          onConfirm={confirmDelete}
                          title={'¿Desea borrar la notificación?'}
            />
            <div className={classes.notificationList}>
                {notifications?.map(notification => (
                <div key={notification.id}>
                <Card sx={{ minWidth: 275 }} >
                    <CardContent>
                        <div className={classes.titleCard}>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                {getIconForItem(notification)}<span className={classes.titleCardDescription}>{getDescriptionForItem(notification)}</span>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <EditIcon className={classes.iconEdit} onClick={() => editNotification(notification)}/>
                                <DeleteForeverIcon className={classes.iconDelete} onClick={() => openModalDeleteNotification(notification)}/>
                            </div>
                        </div>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            Frecuencia: {notification.frequency} <br/>
                            Mensaje: {notification.message}
                        </Typography>
                    </CardContent>
                </Card>
                </div>
                ))}
            </div>
        </div>
    )
}