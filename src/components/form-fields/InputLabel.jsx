import { styled, TextField } from "@mui/material";
import React from "react";


const TextFieldCustom = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
        height: "40px",
        borderRadius: "30px"
    },
    '& .MuiInputLabel-root': {
        top: '-8px'
    }
}));


export const InputLabel = (props) => {

    const {id, label, type = undefined, name, value, ...rest } = props

    return (
        <TextFieldCustom
            id={id}
            label={label}
            type={type}
            name={name}
            value={value}
            style={{minWidth: "100px", margin: "5px", position: 'relative'}}
            {...rest}
        />
    )
}