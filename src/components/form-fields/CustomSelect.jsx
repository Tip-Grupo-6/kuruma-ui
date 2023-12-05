import React from "react";
import Select, {components} from 'react-select'
import SingleValueDefault from "./CustomSelect/SingleValueDefault";
import {makeStyles} from "@material-ui/core/styles";
import {CircularProgress} from "@mui/material";

const styles = makeStyles(theme => ({
    labelSelect: {
        padding: "4px 4px 4px 16px",
        display: "flex"
    },
    errorSelect: {
        fontSize: '0.75rem',
        color: '#d32f2f',
        marginTop: "3px",
        marginRight: "14px",
        marginBottom: 0,
        marginLeft: "14px"
    }
}))

const DropdownIndicator = ({ children, ...props }, loading) => {

    return (
        <components.DropdownIndicator {...props}>
            {loading
                ? <CircularProgress style={{width: "24px", height: "24px", color: "rgb(100, 113, 128)"}}/>
                : <components.DownChevron>{children}</components.DownChevron>}
        </components.DropdownIndicator>
    )
}

export const CustomSelect = (props) => {
    const { data, placeholder, label, name, singleValue, searchable, errorMessage, helperText, loading, value, ...rest } = props
    const singleValueComponent = singleValue || SingleValueDefault

    const classes = styles()

    const customStyles = {
        control: (baseStyles, state) => ({
            ...baseStyles,
            color: state.isDisabled ? "rgb(100, 113, 128)" : baseStyles.color,
            background: state.isDisabled ? "rgb(240, 245, 251)" : "#FFFFFF",
            border: errorMessage ? '1px solid red' : (state.isFocused ? 0 : "1px solid #B6C5D5"),
            borderRadius: "100px",
            boxShadow: errorMessage ? 0 : state.isFocused ? "rgb(26, 170, 173) 0px 0px 0px 1px inset" : 0,
            '&:hover': {
                boxShadow: errorMessage ? 0 : state.isFocused ? "rgb(26, 170, 173) 0px 0px 0px 1px inset" : 0,
            }
        }),
        placeholder: (baseStyles, state) => {
            return {
                ...baseStyles,
                paddingLeft: '6px',
                color: state.isDisabled ? "rgb(100, 113, 128)" : "#000000",
            };
        },
        dropdownIndicator: (provided, state) => ({
            ...provided,
            transform: state.selectProps.menuIsOpen && "rotate(180deg)", //así rotamos el icono de arrow cuando se abre o cierra el select
            color: "#000000"
        }),
        menuPortal: (base) =>({ ...base, zIndex: 9999 }),
        option: (base) => ({
            ...base,
            paddingLeft: '16px',
            zIndex: '99999999'
        }),
        singleValue: (base) => ({
            ...base,
            paddingLeft: "6px"
        }),
        multiValue: (styles, { data }) => {
            return {
                ...styles,
                borderRadius: '50px',
                margin: "5px"
            };
        },
        multiValueLabel: (styles, { data }) => ({
            ...styles,
            borderRadius: '50px',
            '& > div': {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }
        }),
    }


    return (
        <div>
            <Select
                name={name}
                value={value}
                options={data}
                placeholder={placeholder}
                styles={customStyles}
                isSearchable={searchable||false}
                // onChange={onChangeValue}
                components={{
                    IndicatorSeparator: () => null,
                    SingleValue: (props) => singleValueComponent(props),
                    DropdownIndicator: (props) => DropdownIndicator(props, loading)
                }}
                menuPosition="fixed"
                menuPortalTarget={document.body}
                {...rest}
            />
            {errorMessage && helperText && !value && (
            <p className={classes.errorSelect}>
                {helperText}
            </p>
            )}
        </div>
    )
}