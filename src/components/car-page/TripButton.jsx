import {
    Button, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useTheme
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {calcDistance} from "../../utils/CoordinateUtils";
import useMediaQuery from "@mui/material/useMediaQuery";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {InputLabel} from "../form-fields/InputLabel";
import {makeStyles} from "@material-ui/core/styles";
import {patchCar} from "../../services/CarService";
import {useNavigate} from "react-router-dom";

const styles = makeStyles(theme => ({
    iconCircularProgress: {
        width: "20px !important",
        height: "20px !important",
        marginLeft: '10px',
        color: "rgb(100, 113, 128)"
    },
    startTrip: {
        display: 'flex',
        justifyContent: 'center'
    },
    iconStartTrip: {
        height: '60px !important',
        width: '60px !important',
        color: "green"
    },
    tripButton: {
        display: 'flex !important',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '5px !important',
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: '180px'
        }
    }
}))

const newTrip = {start: null, end: null}

export const TripButton = ({car}) => {
    const theme = useTheme();
    const classes = styles()
    const [isOnTrip, setIsOnTrip] = useState(false)
    const [trip, setTrip] = useState(newTrip)
    const [kilometers, setKilometers] = useState(0)
    const [endingTrip, setEndingTrip] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [openModalStartTrip, setOpenModalStartTrip] = useState(false)
    const navigate = useNavigate();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const onTrip = localStorage.getItem("onTrip");
        if(onTrip === 'true') {
            setIsOnTrip(true)
            const tripFromStorage = localStorage.getItem("trip");
            if(tripFromStorage === 'undefined') {
                resetTrip()
            } else {
                setTrip(JSON.parse(tripFromStorage))
            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("trip", JSON.stringify(trip))
        if(trip.start && trip.end) {
            setKilometers(Math.ceil(calcDistance(trip.start, trip.end)))
        }
    }, [trip])

    useEffect(() => {
        localStorage.setItem("onTrip", isOnTrip)
    }, [isOnTrip] )

    const startTrip = () => {
        if (!navigator.geolocation) {
            return alert('La geoubicación no es soportada por el navegador');
        }
        setOpenModalStartTrip(true)
        setIsOnTrip(true);
        getLocation()
            .then(position => {
                setTrip({
                    start: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                })
            })
            .catch((err) => {
                setIsOnTrip(false);
                alert(err)
            })
    }

    const resetTrip = () => {
        setTrip(newTrip)
    }

    const endTrip = () => {
        setEndingTrip(true)
        getLocation()
            .then(position => {
                setIsOnTrip(false)
                setOpenModal(true)
                setTrip(prevState => ({
                    ...prevState,
                    end: {
                        latitude: position.coords.latitude,
                        longitude: (position.coords.longitude + 1)
                    }
                }))
            })
            .catch((err) => {
                alert(err)
            })
            .finally(() => setEndingTrip(false))
    }

    const getLocation = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition((position) => {
                resolve(position)
            }, () => {
                reject('No se puede acceder a su ubicación, compruebe que tiene el gps activado')
            });
        })
    }

    const patchKilometers = () => {
        setOpenModal(false)
        const kilometersTraveled = Number(car.kilometers) + kilometers
        patchCar(car.id, { kilometers: kilometersTraveled })
            .then(() => navigate(0)) //recargo la pagina para que actualice el render del auto
    }

    const updateKilometers = (val) => {
        setKilometers(Number(val.target.value))
    }


    return (
        <>
            {!isOnTrip && (
            <Button variant="outlined" onClick={startTrip} className={classes.tripButton}>
                Comenzar viaje
            </Button>
            )}
            {isOnTrip && (
            <Button variant="outlined" onClick={endTrip} className={classes.tripButton}>
                {endingTrip
                    ? <div>Finalizando viaje <CircularProgress className={classes.iconCircularProgress}/></div>
                    : 'Finalizar viaje'
                }
            </Button>
            )}
            <Dialog
                open={openModalStartTrip}
                onClose={() => setOpenModalStartTrip(false)}
                aria-labelledby="customized-dialog-title"
                maxWidth={'md'}
                fullScreen={fullScreen}
                style={{margin: "10px"}}
            >
                <DialogTitle id="alert-dialog-title">
                    Viaje iniciado
                </DialogTitle>
                <DialogContent className={classes.startTrip}>
                    <CheckCircleOutlineIcon className={classes.iconStartTrip}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModalStartTrip(false)} autoFocus>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openModal}
                onClose={patchKilometers}
                aria-labelledby="customized-dialog-title"
                maxWidth={'md'}
                fullScreen={fullScreen}
                style={{margin: "10px"}}
            >
                <DialogTitle id="alert-dialog-title">
                    Viaje finalizado
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" style={{marginBottom: '20px'}}>
                        Realizó un viaje aproximado de {kilometers} km. <br/>
                        Su auto tiene {car.kilometers} km actualmente recorridos. <br/>
                        Con el viaje realizado en total tendría {Number(car.kilometers) + kilometers} km. <br/>
                        Si desea puede ajustar la cantidad de kilometros recorridos.
                    </DialogContentText>
                    <InputLabel id={'input-kilometers'} label={"Kilometros"} name={'kilometros'}
                                type={'number'}
                                value={kilometers}
                                onChange={updateKilometers}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={patchKilometers} autoFocus>
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}