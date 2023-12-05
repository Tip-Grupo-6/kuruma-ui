import {
    Alert,
    AlertTitle, Button, CircularProgress,
    Collapse,
    Drawer,
    Switch
} from "@mui/material";
import Box from "@mui/material/Box";
import * as React from "react";
import {jwtDecode} from "jwt-decode";
import {createSubscription, deleteSubscription, tryPushNotification} from "../../services/SubscriptionService";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {makeStyles} from "@material-ui/core/styles";
import {useEffect, useState} from "react";

const styles = makeStyles(theme => ({
    drawerBox: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        width: '250px',
        margin: '20px',
        marginBottom: '25px'
    },
    buttonActions: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    button: {
        marginBottom: '5px !important',
        width: "100% !important",
        display: 'block',
    },
    boxAlert: {
        padding: "10px 10px 0 10px",
        [theme.breakpoints.up("sm")]: {
            padding: "25px",
            position: "absolute"
        }
    },
    statusAlert: {
        width: "300px",
    },
    infoButtonTry: {
        fontSize: '10px',
        margin: '15px 0'
    }
}))

export const NotificationConfigurationSideSheet = ({open, onClose}) => {

    const classes = styles()
    const accessToken = localStorage.getItem("accessToken")
    const [enabled, setEnabled] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)
    const [severityAlert, setSeverityAlert] = useState("success")
    const [timeoutAlert, setTimeoutAlert] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        checkIsSubscribed()
    }, [])

    const saveNotification = () => {
        if(enabled) {
            addSubscription()
        } else {
            removeSubscription()
        }
    }

    const checkIsSubscribed = async () => {
        if ('serviceWorker' in navigator || navigator.serviceWorker) {
            let sw = await navigator.serviceWorker.ready;
            const subscription = await sw.pushManager.getSubscription()
            setEnabled(subscription?.endpoint !== undefined)
            console.log('is subscribed: ', subscription?.endpoint !== undefined)
        }
    }

    const addSubscription = async () => {
        setLoading(true)
        if (!'serviceWorker' in navigator || !navigator.serviceWorker) {
            return alert('Notificaciones push no disponible')
        }
        let sw = await navigator.serviceWorker.ready;
        let push = await sw.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey:
                'BB_54eE5xN6sw3AsPj4Wz7OlyEeX5qbBoZxgM5lvahdu2VIPIJLzKXq0xBUt4N4LtCQyH72xD6oHkhJ5_7-CLGg'
        });
        const tokenData = jwtDecode(accessToken)
        const userId = tokenData?.user?.user_id
        const subscription = {
            user_id: userId,
            auth: arrayBufferToBase64(push.getKey('auth')),
            key: arrayBufferToBase64(push.getKey('p256dh')),
            endpoint: push.endpoint
        }
        createSubscription(subscription, accessToken)
            .then(() => {
                setSeverityAlert("success")
            })
            .catch(() => {
                setSeverityAlert("error")
            })
            .then(() => {
                closeConfigAndShowAlert()
                setLoading(false)
            })
    }

    const removeSubscription = async () => {
        setLoading(true)
        let sw = await navigator.serviceWorker.ready;
        const subscription = await sw.pushManager.getSubscription()
        if(!subscription) {
            setSeverityAlert("success")
            setLoading(false)
            return closeConfigAndShowAlert()
        }
        const tokenData = jwtDecode(accessToken)
        const userId = tokenData?.user?.user_id
        const subscriptionBody = {
            user_id: userId,
            endpoint: subscription.endpoint
        }
        deleteSubscription(subscriptionBody, accessToken)
            .then(() => {
                subscription.unsubscribe()
            })
            .then(() => {
                setSeverityAlert("success")
            })
            .catch(() => {
                setSeverityAlert("error")
            })
            .then(() => {
                closeConfigAndShowAlert()
                setLoading(false)
            })
    }

    const closeConfigAndShowAlert = () => {
        onClose()
        setOpenAlert(true)

        if (timeoutAlert) clearTimeout(timeoutAlert)
        const delay = setTimeout(handleClose, 2000)
        setTimeoutAlert(delay)
    }

    const tryNotification = async () => {
        if (!'serviceWorker' in navigator || !navigator.serviceWorker) {
            return alert('Notificaciones push no disponible')
        }
        let sw = await navigator.serviceWorker.ready;
        let push = await sw.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey:
                'BB_54eE5xN6sw3AsPj4Wz7OlyEeX5qbBoZxgM5lvahdu2VIPIJLzKXq0xBUt4N4LtCQyH72xD6oHkhJ5_7-CLGg'
        });
        const subscription = {
            message: 'Notificación de prueba',
            auth: arrayBufferToBase64(push.getKey('auth')),
            key: arrayBufferToBase64(push.getKey('p256dh')),
            endpoint: push.endpoint
        }
        await tryPushNotification(subscription, accessToken)
    }

    const arrayBufferToBase64 = ( buffer ) => {
        let binary = '';
        const bytes = new Uint8Array( buffer );
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[ i ]);
        }
        return window.btoa(binary);
    }

    const switchNotificationEnabled = () => {
        setEnabled((prevState) => !prevState)
    }

    const handleClose = () => {
        setOpenAlert(false)
    }

    return (
        <>
            <Drawer
                anchor={"right"}
                open={open}
                onClose={onClose}
            >
                <Box
                    className={classes.drawerBox}
                    role="presentation"
                >
                    <div>
                        <h3>Configuración de alertas</h3>
                        <div>
                            Habilitar: <Switch checked={enabled} onChange={switchNotificationEnabled}/>
                        </div>
                    </div>
                    <div className={classes.buttonActions}>
                        <p className={classes.infoButtonTry}>
                            Puede probar la notificación clickeando en el botón 'Probar'. Puede tardar unos segundos.
                        </p>
                        <Button variant="outlined" className={classes.button} disabled={!enabled} onClick={tryNotification}>
                            Probar
                        </Button>
                        <Button variant="outlined" className={classes.button} onClick={saveNotification} disabled={loading}>
                            {loading && <>Guardando <CircularProgress style={{width: "24px", height: "24px", color: "rgb(100, 113, 128)", marginLeft: '10px'}}/></>}
                            {!loading && <>Guardar</>}
                        </Button>
                    </div>
                </Box>
            </Drawer>

            {/* Alert success or error */}
            <Box sx={{width: '100%'}} className={classes.boxAlert}>
                <Collapse in={openAlert} data-testid={"collapse"}>
                    <Alert data-testid={"alert"} severity={severityAlert} size={"small"}
                           onClose={handleClose}
                           className={classes.statusAlert}
                           action={
                               <IconButton
                                   aria-label="close"
                                   color="inherit"
                                   size="small"
                                   onClick={handleClose}
                               >
                                   <CloseIcon fontSize="inherit"/>
                               </IconButton>
                           }>
                        <AlertTitle>
                            {severityAlert === 'success'
                                ? 'Configuración guardada'
                                : 'Ha ocurrido un error en el guardado de la configuración. Intente de nuevo'
                            }
                        </AlertTitle>
                    </Alert>
                </Collapse>
            </Box>
        </>
    )
}