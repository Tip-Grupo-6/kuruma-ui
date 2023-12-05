import {Button, Dialog, DialogActions, DialogContent, DialogTitle, styled, useTheme} from "@mui/material";
import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
        margin: '10px'
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));


export const ConfirmModal = ({open, onClose, onConfirm, title, message}) => {

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <BootstrapDialog
            onClose={onClose}
            aria-labelledby="modal-confirm-dialog-title"
            open={open}
            maxWidth={'md'}
            fullScreen={fullScreen}
            style={{margin: "10px"}}
        >
            <DialogTitle sx={{ m: 0, p: 2 }} id="modal-confirm" data-testid={"modal-confirm"}>
                {title}
            </DialogTitle>
            {message && (
            <DialogContent dividers>
                {message}
            </DialogContent>
            )}
            <DialogActions>
                {onClose && <Button onClick={onClose}>Cancelar</Button>}
                <Button onClick={onConfirm}>Aceptar</Button>
            </DialogActions>
        </BootstrapDialog>
    )
}