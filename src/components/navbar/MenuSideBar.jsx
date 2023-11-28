import * as React from "react";

import Box from "@mui/material/Box";
import {Drawer, List} from "@mui/material";
import MailIcon from '@mui/icons-material/Mail';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import InfoIcon from '@mui/icons-material/Info';
import {ItemMenu} from "./ItemMenu";

export const MenuSideBar = ({open, onClose}) => {

    return (
        <Drawer
            anchor={"left"}
            open={open}
            onClose={onClose}
        >
            <Box sx={{ width: 250 }} role="presentation" >
                <List>
                    <ItemMenu label={"Tu auto"} path={"/"} icon={<DirectionsCarIcon />} onClose={onClose} />
                    <ItemMenu label={"Notificaciones"} path={"/notificaciones"} icon={<MailIcon />} onClose={onClose} />
                    <ItemMenu label={"Más información"} path={"/informacion-de-auto"} icon={<InfoIcon />} onClose={onClose} />
                </List>
            </Box>
        </Drawer>
    )
}