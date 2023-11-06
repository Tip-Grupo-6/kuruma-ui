import * as React from "react";

import Box from "@mui/material/Box";
import {Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import MailIcon from '@mui/icons-material/Mail';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import {Link} from "react-router-dom";

export const SideBar = ({open, onClose}) => {

    return (
        <Drawer
            anchor={"left"}
            open={open}
            onClose={onClose}
        >
            <Box
                sx={{ width: "left" === 'top' || "left" === 'bottom' ? 'auto' : 250 }}
                role="presentation"
                onClick={() => console.log("click menu")}
                onKeyDown={() => console.log("key down menu")}
            >
                <List>
                    <ListItem key={"Tu auto"} disablePadding>
                        <ListItemButton>
                            <Link to="/1" onClick={onClose} style={{display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit'}}>
                                <ListItemIcon>
                                    <DirectionsCarIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Tu auto"} />
                            </Link>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"Notificaciones"} disablePadding>
                        <ListItemButton>
                            <Link to="/notificaciones" onClick={onClose} style={{display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit'}}>
                                <ListItemIcon>
                                    <MailIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Notificaciones"} />
                            </Link>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    )
}