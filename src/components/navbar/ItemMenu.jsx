import {ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {Link} from "react-router-dom";
import * as React from "react";

export const ItemMenu = ({label, path, icon, onClose}) => {

    return (
        <ListItem key={label} disablePadding>
            <ListItemButton>
                <Link to={path} onClick={onClose} style={{display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit'}}>
                    <ListItemIcon>
                        {icon}
                    </ListItemIcon>
                    <ListItemText primary={label} />
                </Link>
            </ListItemButton>
        </ListItem>
    )
}