import {Button, Dialog, DialogActions, DialogContent, DialogTitle, styled, useTheme} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {CustomSelect} from "../form-fields/CustomSelect";
import {InputLabel} from "../form-fields/InputLabel";
import React, {useEffect, useState} from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useFormik} from "formik";
import * as yup from "yup";
import {useNavigate} from "react-router-dom";
import {getIconByCode} from "../../utils/MaintenanceItemsUtils";
import {makeStyles} from "@material-ui/core/styles";
import {createNotification, updateNotification} from "../../services/NotificationService";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
        margin: '10px'
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));


const styles = makeStyles(theme => ({
    maintenanceSelect: {
        marginBottom: "10px",
    }
}))

const validationSchema = yup.object({
    frequency: yup
        .number('Frecuencia')
        .required('La frecuencia es requerida'),
    message: yup
        .string('Mensaje de alerta')
});

export const NotificationModal = ({car, notification, open, closeModal}) => {

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const classes = styles()
    const navigate = useNavigate();
    const [itemSelected, setItemSelected] = useState(null)

    const formik = useFormik({
        initialValues: {
            car_id: '',
            car_item_id: '',
            frequency: '',
            message: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const body = { ...values, car_id: car.id }
            if(!notification?.id) {
                createNotification(body).then(data => {
                    navigate(0); //recargo la pagina para que actualice el render del auto
                });
            } else {
                updateNotification(notification.id, body).then(() => {
                    navigate(0); //recargo la pagina para que actualice el render del auto
                })
            }
        },
    });

    useEffect(() => {
        if(notification) {
            formik.setFieldValue("car_item_id", notification.car_item_id)
            formik.setFieldValue("frequency", notification.frequency)
            formik.setFieldValue("message", notification.message)
            setItemSelected(findItemSelected())
        } else {
            formik.setFieldValue("car_item_id", '')
            formik.setFieldValue("frequency", 0)
            formik.setFieldValue("message", '')
            setItemSelected(null)
        }
    }, [notification])

    const convertData = () => {
        return car?.maintenance_values.map(item => (
            { value: `${item.id}`, label: optionItem(item), description: item.name }
        ));
    }

    const optionItem = (item) => {
        return (
            <div style={{display: 'flex', alignItems: 'center'}}>{getIconByCode(item.code)}<span style={{marginLeft: '5px'}}>{item.name}</span></div>
        )
    }

    const onChangeMaintenanceItems = (itemSelected) => {
        formik.setFieldValue("car_item_id", itemSelected.value)
        setItemSelected(itemSelected)
    }

    const onChangeFrequency = (input) => {
        formik.setFieldValue("frequency", input.target.value)
    }

    const findItemSelected = () => {
        return convertData()?.find(option => option.value === notification?.car_item_id.toString())
    }

    return (
        <BootstrapDialog
            onClose={closeModal}
            aria-labelledby="customized-dialog-title"
            open={open}
            maxWidth={'md'}
            fullScreen={fullScreen}
            style={{margin: "10px"}}
        >
            <form onSubmit={formik.handleSubmit}>
                <DialogTitle sx={{ m: 0, p: 2 }} id="modal-form-title" data-testid={"modal-form-title"} >
                    {!notification ? 'Agregar notificación': 'Editar notificación'}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={closeModal}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <CustomSelect
                        className={classes.maintenanceSelect}
                        placeholder={"Selecciona un item"}
                        data={convertData()}
                        onChange={onChangeMaintenanceItems}
                        value={itemSelected}
                        isDisabled={car?.maintenance_values.length === 0}
                    />
                    <InputLabel id={'input-frecuency'} label={'Frecuencia de dias *'} type={'number'} name={'frecuency'}
                                value={formik.values.frequency}
                                onChange={onChangeFrequency}
                                onBlur={formik.handleBlur}
                                error={formik.touched.frequency && Boolean(formik.errors.frequency)}
                                helperText={formik.touched.frequency && formik.errors.frequency} />
                    <InputLabel id={'input-message'} label={'Mensaje'} type={'text'} name={'message'}
                                value={formik.values.message}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.message && Boolean(formik.errors.message)}
                                helperText={formik.touched.message && formik.errors.message} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeModal}>Cancelar</Button>
                    <Button type="submit">Guardar</Button>
                </DialogActions>
            </form>
        </BootstrapDialog>
    )
}