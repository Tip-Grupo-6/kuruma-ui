import React from "react";
import { components } from "react-select";


// Precondicion: cuando se usa CustomSelect cada row debe tener, además de value y label, el campo description
const SingleValueDescription = (props) => {
    // el objeto data recibido por props es una row de la data enviada en el CustomSelect
    const { data } = props

    return (
        <components.SingleValue {...props} >{data.description}</components.SingleValue>
    );
};

export default SingleValueDescription
