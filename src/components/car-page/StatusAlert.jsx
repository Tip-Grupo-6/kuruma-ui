import Box from "@mui/material/Box";
import {Alert, AlertTitle, Collapse} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const styles = makeStyles(theme => ({
    boxAlert: {
        padding: "10px 10px 0 10px",
        [theme.breakpoints.up("sm")]: {
            padding: "25px",
            position: "absolute"
        }
    },
    statusAlert: {
        width: "300px",
    },
}));

export const StatusAlert = ({status, open, onClose}) => {
    const classes = styles()

    const severityStatus = () => {
        switch (status?.status_color) {
            case "red":
                return "error";
            case "yellow":
                return "warning";
            default:
                return "success";
        }
    }

    return (
        <Box sx={{ width: '100%' }} className={classes.boxAlert}>
            <Collapse in={open} data-testid={"collapse"}>
                <Alert data-testid={"alert"} severity={severityStatus()} className={classes.statusAlert} action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={onClose}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }>
                    <AlertTitle>Chequeo de {status?.name}</AlertTitle>
                    Último chequeo: {status?.last_change}<br/>
                    Próximo chequeo: {status?.next_change_due}
                </Alert>
            </Collapse>
        </Box>
    )
}