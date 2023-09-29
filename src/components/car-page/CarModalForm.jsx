import {Button, Dialog, DialogActions, DialogContent, DialogTitle, styled, useTheme} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from '@mui/material/useMediaQuery';

import React, {useEffect, useState} from "react";
import {createCar, fetchMaintenanceItems, updateCar} from "../../services/CarService";
import {CustomSelect} from "../form-fields/CustomSelect";
import {InputLabel} from "../form-fields/InputLabel";
import {makeStyles} from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es';
import dayjs from "dayjs";
import {useFormik} from "formik";
import * as yup from 'yup';
import {getIconByCode} from "../../utils/MaintenanceItemsUtils";


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
   formLabels: {
       display: "grid",
       gridTemplateColumns: "1fr",
       gap: "15px",
       [theme.breakpoints.up("sm")]: {
           gridTemplateColumns: "1fr 1fr 1fr",
       }
   }
}))


const validationSchema = yup.object({
    brand: yup
        .string('Marca')
        .required('La marca es requerida'),
    model: yup
        .string('Modelo')
        .required('El modelo es requerido'),
    year: yup
        .string('Año')
        .required('El año es requerido'),
    color: yup
        .string("Color")
        .required('El color es requerido'),
    kilometers: yup
        .string('Kilometros')
        .required('Los kilometros son requeridos'),
    maintenance_values: yup.array()
        .of(yup.object({
            code: yup
                .string('Código'),
            last_change: yup
                .string()
                .required('El campo es requerido')
                .matches(
                    /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
                    "Debe ingresar una fecha valida"
                )
        }))
});

export const CarModalForm = ({car, open, closeModal}) => {

    const classes = styles()
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [maintenanceItems, setMaintenanceItems] = useState([])
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            brand: '',
            model: '',
            year: '',
            color: '#000000',
            kilometers: '',
            maintenance_values: []
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if(!car?.id) {
                createCar(values).then(data => {
                    navigate(`/${data.id}`) //redirecciono
                    navigate(0); //recargo la pagina para que actualice el render del auto
                });
            } else {
                updateCar(car.id, values).then(() => {
                    navigate(0); //recargo la pagina para que actualice el render del auto
                })
            }
        },
    });

    useEffect(() => {
        if(car) {
            formik.setValues(
                {
                    brand: car.brand,
                    model: car.model,
                    year: car.year,
                    color: car.color,
                    kilometers: car.kilometers,
                    maintenance_values: car.maintenance_values.map(item => (
                        {code: item.code, last_change: item.last_change, description: item.name}
                    ))
                }
            )
        }
    }, [car])

    useEffect(() => {
        fetchMaintenanceItems().then(data => {
            setMaintenanceItems(data)
        })
    }, [])

    const convertData = () => {
        return maintenanceItems.map(item => (
            { value: `${item.code}`, label: optionItem(item), description: item.description }
        ));
    }

    const optionItem = (item) => {
        return (
            <div style={{display: 'flex', alignItems: 'center'}}>{getIconByCode(item.code)}<span style={{marginLeft: '5px'}}>{item.description}</span></div>
        )
    }

    const onChangeMultiSelect = (itemsSelected) => {
        const selected = itemsSelected.map(item => {
            const lastChange = findMaintenanceByCode(item.value)?.last_change || null;
            return {code: item.value, last_change: lastChange, description: item.description}
        })
        formik.setFieldValue("maintenance_values", selected)
    }

    const findMaintenanceByCode = (code) => {
        return formik.values.maintenance_values.find(carItem => carItem.code === code)
    }

    const getItemsSelected = () => {
        return convertData().filter(option => formik.values.maintenance_values.some(carItem => carItem.code === option.value))
    }

    const getMaintenanceValueLastChange = (index) => {
        const item = formik.values.maintenance_values?.[index]
        return item?.last_change ? dayjs(item.last_change) : null
    }

    const onChangeMaintenanceValueLastChange = (index, value) => {
        if(value != null) {
            formik.setFieldValue(`maintenance_values[${index}].last_change`, value.format('YYYY-MM-DD'))
        }
    }

    const hasMaintenanceValueError = (index) => {
        return formik.touched.maintenance_values?.[index]?.last_change
                && Boolean(formik.errors.maintenance_values?.[index]?.last_change)
    }

    const getMaintenanceValueError = (index) => {
        return formik.touched.maintenance_values?.[index]?.last_change
                && formik.errors.maintenance_values?.[index]?.last_change
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
                    {!car ? 'Agregar auto': 'Editar auto'}
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
                        <div className={classes.formLabels}>
                            <InputLabel id={'input-brand'} label={"Marca *"} name={'brand'}
                                        value={formik.values.brand}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.brand && Boolean(formik.errors.brand)}
                                        helperText={formik.touched.brand && formik.errors.brand} />
                            <InputLabel id={'input-model'} label={"Modelo *"} name={'model'}
                                        value={formik.values.model}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.model && Boolean(formik.errors.model)}
                                        helperText={formik.touched.model && formik.errors.model} />
                            <InputLabel id={'input-year'} label={"Año *"} name={'year'}
                                        value={formik.values.year}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.year && Boolean(formik.errors.year)}
                                        helperText={formik.touched.year && formik.errors.year} />
                            <InputLabel id={'input-kms'} label={"Kilometros *"} name={'kilometers'}
                                        value={formik.values.kilometers}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.kilometers && Boolean(formik.errors.kilometers)}
                                        helperText={formik.touched.kilometers && formik.errors.kilometers} />
                            <InputLabel id={'input-color'} label={'Color *'} type={'color'} name={'color'}
                                        value={formik.values.color}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.color && Boolean(formik.errors.color)}
                                        helperText={formik.touched.color && formik.errors.color} />
                        </div>
                        <h3>Mantenimiento</h3>
                        <CustomSelect
                            placeholder={"Selecciona un item"}
                            data={convertData()}
                            onChange={onChangeMultiSelect}
                            selectedValue={getItemsSelected()}
                            isDisabled={maintenanceItems.length === 0}
                            isMulti
                        />
                        { formik.values.maintenance_values.length > 0 && (
                        <>
                            <h3>Último chequeo:</h3>
                            <div className={classes.formLabels}>
                            {formik.values.maintenance_values.map((item, index) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"es"} key={`input-last-change-${item.code}`} >
                                    <DatePicker id={`input-last-change-${item.code}`}
                                                label={item.description}
                                                format="DD-MM-YYYY"
                                                value={getMaintenanceValueLastChange(index)}
                                                onChange={(value) => onChangeMaintenanceValueLastChange(index, value)}
                                                onBlur={formik.handleBlur}
                                                error={() => hasMaintenanceValueError(index)}
                                                slotProps={{
                                                    textField: {
                                                        helperText: getMaintenanceValueError(index),
                                                    },
                                                }}
                                    />
                                </LocalizationProvider>
                            ))}
                            </div>
                        </>
                        )}
                    </DialogContent>
                <DialogActions>
                    <Button onClick={closeModal}>Cancelar</Button>
                    <Button type="submit">Guardar</Button>
                </DialogActions>
            </form>
        </BootstrapDialog>
    )
}