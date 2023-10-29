import React, {useEffect, useState} from "react";
import Select, {components} from 'react-select'
import SingleValueDefault from "./CustomSelect/SingleValueDefault";
import {makeStyles} from "@material-ui/core/styles";
import {CircularProgress, Icon} from "@mui/material";

const customStyles = {
    control: (baseStyles, state) => ({
        ...baseStyles,
        color: state.isDisabled ? "rgb(100, 113, 128)" : baseStyles.color,
        background: state.isDisabled ? "rgb(240, 245, 251)" : "#FFFFFF",
        border: state.isFocused ? 0 : "1px solid #B6C5D5",
        borderRadius: "100px",
        boxShadow: state.isFocused ? "rgb(26, 170, 173) 0px 0px 0px 1px inset" : 0,
        '&:hover': {
            boxShadow: state.isFocused ? "rgb(26, 170, 173) 0px 0px 0px 1px inset" : 0,
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
            // display: 'flex',
            // justifyContent: 'center',
            // alignItems: 'center',
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
    })
}

const styles = makeStyles(theme => ({
    labelSelect: {
        padding: "4px 4px 4px 16px",
        display: "flex"
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
    const { data, placeholder, label, name, singleValue, searchable, errorMessage, loading, ...rest } = props
    const singleValueComponent = singleValue || SingleValueDefault

    const classes = styles()


    return (
        <>
            <Select
                name={name}
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
                {...rest}
            >
            {errorMessage  && !props.value && (
                <div className={classes.flexStart}>
                    <Icon
                        name='error_circle_outline'
                        variant='danger'
                        width={16}
                        height={16}
                    />
                    <span type='4' variant={'danger'}>{errorMessage}</span>
                </div>
            )}
            </Select>
        </>
    )
}