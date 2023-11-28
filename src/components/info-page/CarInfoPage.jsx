import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {findBrands, findCarInfo, findModels} from "../../services/CarService";
import {CustomSelect} from "../form-fields/CustomSelect";
import {CarInfoTable} from "./CarInfoTable";

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
    searchForm: {
        display: "grid",
        gap: "1rem",
        [theme.breakpoints.up("sm")]: {
            gridTemplateColumns: "1fr 1fr 1fr",
        }
    }
}));

const years = []
for(let i = 1994; i < 2024; i++) {
    years.push({value: i, label: i})
}

export const CarInfoPage = () => {
    const classes = styles()
    const [form, setForm] = useState(null)
    const [brands, setBrands] = useState([])
    const [models, setModels] = useState([])
    const [carInfo, setCarInfo] = useState(null)
    const [loadingBrands, setLoadingBrands] = useState(false)
    const [loadingModels, setLoadingModels] = useState(false)
    const [width, setWidth] = useState(window.innerWidth);
    const accessToken = localStorage.getItem("accessToken")

    const onChangeYear = (year) => {
        setForm({year: year})
        setLoadingBrands(true)
        setBrands([])
        setModels([])
        findBrands(year, accessToken).then(response => {
            setBrands(response.data.map(brand => ({value: brand.id, label: brand.description})))
        })
        .catch(e => console.log(e))
        .finally(() => setLoadingBrands(false))
    }

    const onChangeBrand = (option) => {
        setForm(prevState => ({...prevState, brand: option, model: null}))
        setModels([])
        setLoadingModels(true)
        findModels(form.year, option.value, accessToken).then(response => {
            setModels(response.data.map(brand => ({value: brand.id, label: brand.description})))
         })
        .catch(e => console.log(e))
        .finally(() => setLoadingModels(false))
    }

    const onChangeModel = (option) => {
        setForm(prevState => ({...prevState, model: option}))
        findCarInfo(form.year, form.brand.value, option.value, accessToken).then(response => {
            setCarInfo(response.data)
        })
        .catch(e => console.log(e))
    }

    const isDesktop = width > 768

    return (
        <div className={classes.card}>
            <h2 className={classes.title}>Información del auto</h2>
            <h3>Seleccioná un auto</h3>

            <div className={classes.searchForm}>
                <CustomSelect
                    name={'year'}
                    placeholder={"Selecciona un Año *"}
                    data={years}
                    onChange={(option) => onChangeYear(option.value)}
                    searchable={isDesktop}
                />
                <CustomSelect
                    name={'brand'}
                    placeholder={"Selecciona una Marca *"}
                    data={brands}
                    onChange={(option) => onChangeBrand(option)}
                    isDisabled={brands.length === 0 || loadingBrands}
                    value={form?.brand || ''}
                    loading={loadingBrands}
                    searchable={isDesktop}
                />
                <CustomSelect
                    name={'model'}
                    placeholder={"Selecciona una Modelo *"}
                    data={models}
                    onChange={(option) => onChangeModel(option)}
                    isDisabled={models.length === 0 || loadingModels}
                    value={form?.model || ''}
                    loading={loadingModels}
                    searchable={isDesktop}
                />
            </div>
            {carInfo && (
            <div>
                <h3>Modelos</h3>
                <CarInfoTable models={carInfo} />
            </div>
            )}
        </div>
    )
}