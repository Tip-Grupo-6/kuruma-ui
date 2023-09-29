import React from "react";
import {OIL, TIRE_PRESSURE, WATER} from "../constants/CarItemConst";
import {Icon} from "@mui/material";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import TireRepairIcon from "@mui/icons-material/TireRepair";

export const getIconByCode = (code) => {
    switch (code) {
        case OIL:
            return (<Icon>
                <img src="/assets/icons/engine-oil.svg" alt={"icon"} style={{width: "24px", height: "24px"}}/>
            </Icon>)
        case WATER:
            return <WaterDropIcon />
        case TIRE_PRESSURE:
            return <TireRepairIcon />
        default:
            return null
    }
}