import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import {makeStyles} from "@material-ui/core/styles";
import {Link} from "react-router-dom";
import {useState} from "react";
import {SideBar} from "./SideBar";

const styles = makeStyles(theme => ({
    appbar: {
        backgroundColor: "var(--color-white) !important",
        color: "#000000 !important"
    },
    nameApp: {
        "fontFamily": "Altone Trial, Raleway, sans-serif",
        "textTransform": "uppercase",
        "fontWeight": "bold",
        "display": "flex",
        "alignItems": "center"
    },
    linkIcon: {
        display: "flex",
        justifyContent: "center",
        height: "96px",
        width: "96px",
        textDecoration: "none",
        color: "inherit",
        [theme.breakpoints.up("sm")]: {
            justifyContent: "normal",
        }
    },
    iconContainer: {
        display: "flex",
        justifyContent: "center",
        [theme.breakpoints.up("sm")]: {
            justifyContent: "start",
        }
    },
    icon: {
        width: "96px",
        height: "96px"
    }
}))

export default function Navbar() {
    const classes = styles()

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [showMenu, setShowMenu] = useState(false)

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" className={classes.appbar}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => setShowMenu(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className={classes.iconContainer}>

                        <Link reloadDocument to={"/"} className={classes.linkIcon}>
                            <div className={classes.nameApp}>
                                Kuruma
                            </div>
                            <img src={"icon.png"} alt={"icon"} className={classes.icon}/>
                        </Link>
                    </Typography>
                    <div>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>Perfil</MenuItem>
                            <MenuItem onClick={handleClose}>Cerrar sesion</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            <SideBar open={showMenu} onClose={() => setShowMenu(false)}/>
        </Box>
    );
}