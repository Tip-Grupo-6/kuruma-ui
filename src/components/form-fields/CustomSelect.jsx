import React, {useEffect, useState} from "react";
import Select from 'react-select'
import SingleValueDefault from "./CustomSelect/SingleValueDefault";
import {makeStyles} from "@material-ui/core/styles";

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

export const CustomSelect = (props) => {
    const { selectedValue, defaultValue, data, placeholder, label, name, singleValue, onFocus, searchable, emptySelectMessage, ...rest } = props
    const singleValueComponent = singleValue || SingleValueDefault

    const classes = styles()
    const [touched, setTouched] = useState(false)

    // useEffect(() => {
    //     if (defaultValue && !selectedValue) {
    //         setValue(defaultValue)
    //     }
    // }, [defaultValue])
    //
    // const onChangeValue = ({value}) => {
    //     const rowSelected = data.find((row) => row.value.toString() === value)
    //     if (rowSelected != null) {
    //         setValue(rowSelected)
    //         onChange && onChange(rowSelected)
    //     }
    // }

    const onBlur = () => {
        setTouched(true)
    }

    return (
        <>
            <Select
                value={selectedValue}
                defaultValue={defaultValue}
                name={name}
                options={data}
                placeholder={placeholder}
                styles={customStyles}
                isSearchable={searchable||false}
                // onChange={onChangeValue}
                components={{
                    IndicatorSeparator: () => null,
                    SingleValue: (props) => singleValueComponent(props)
                }}
                onFocus={onFocus}
                onBlur={onBlur}
                menuPosition="fixed"
                {...rest}

            />
            {/*{emptySelectMessage && touched && !selectedValue && (*/}
            {/*    <div className={classes.flexStart}>*/}
            {/*        <Icon*/}
            {/*            name='error_circle_outline'*/}
            {/*            variant='danger'*/}
            {/*            width={16}*/}
            {/*            height={16}*/}
            {/*        />*/}
            {/*        <Span type='4' variant={'danger'}>{emptySelectMessage}</Span>*/}
            {/*    </div>*/}
            {/*)}*/}
        </>
    )
}