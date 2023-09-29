import React from "react";
import { components } from "react-select";

const SingleValueDefault = (props) => {
    const { children } = props

    return (
        <components.SingleValue {...props} >{children}</components.SingleValue>
    );
}

export default SingleValueDefault