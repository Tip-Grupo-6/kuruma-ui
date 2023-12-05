import * as React from "react";
import {useNavigate} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import {useFormik} from "formik";
import * as yup from "yup";
import {InputLabel} from "../form-fields/InputLabel";
import {Alert, AlertTitle, Button, Collapse} from "@mui/material";
import {Link} from "react-router-dom";
import {login} from "../../services/UserService";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import {useState} from "react";
import {useUserLogged} from "../context/UserLogged";

const styles = makeStyles(theme => ({
    container: {
        display: "flex",
        justifyContent: 'center',
        width: '100%'
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: "1rem",
        width: "480px",
        height: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: "5px",
        padding: "20px",
        margin: "20px",
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '20px'
    },
    iconKuruma: {
        width: '200px',
        height: '150px'
    },
    input: {
        width: '100%',
        marginBottom: '25px !important'
    },
    nameApp: {
        fontFamily: "Altone Trial, Raleway, sans-serif",
        textTransform: "uppercase",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        fontSize: '30px'
    },
    flexColumnCenter: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: "center"
    },
    linkOnboarding: {
        paddingBottom: '20px',
        textAlign: 'center',
        color: 'rgb(10, 127, 228)',
        '& :visited': {
            color: 'rgb(10, 127, 228)'
        }
    }
}))

const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/

const validationSchema = yup.object({
    email: yup
        .string()
        .required('El email es requerido')
        .test('Formato de email', function (value) {
            if (!EMAIL_REGEX.test(value)) {
                return this.createError({message: "Debe ingresar un email valido"})
            }
            return true
        }),
    password: yup
        .string()
        .required('La contraseña es requerida')
});

export const LoginPage = () => {

    const classes = styles()
    const {userLogged} = useUserLogged()
    const navigate = useNavigate();
    const [errorLogin, setErrorLogin] = useState(false)
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            login({username: values.email, password: values.password})
                .then((response) => {
                    userLogged(response.data.token)
                    navigate("/")
                })
                .catch(() => {
                    setErrorLogin(true)
                    console.log("error en login")
                })
        },
    });

    return (
        <div className={classes.container}>
            <div className={classes.card}>
                <div className={classes.header}>
                    <img src={"icon.png"} alt={"icon"} className={classes.iconKuruma}/>
                    <div className={classes.nameApp}>
                        Kuruma
                    </div>
                </div>
                <form onSubmit={formik.handleSubmit} className={classes.flexColumnCenter} style={{width: '90%'}}>
                    <InputLabel id={'input-email'} label={'Email *'} type={'text'} name={'email'}
                        className={classes.input}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email} />
                    <InputLabel id={'input-password'} label={'Contraseña *'} type={'password'} name={'password'}
                                className={classes.input}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password} />
                    <Button type="submit" variant="contained" disabled={!formik.isValid} style={{marginBottom: '20px'}}>
                        Iniciar sesión
                    </Button>
                    <Link to={'/onboarding'} className={classes.linkOnboarding}>
                        ¿Primera vez que ingresás? Registrate
                    </Link>
                    <Box sx={{width: '100%'}} className={classes.boxAlert}>
                        <Collapse in={errorLogin} data-testid={"collapse"}>
                            <Alert data-testid={"alert"} severity={"error"} size={"small"}
                                   className={classes.statusAlert}
                                   action={
                                        <IconButton
                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={() => setErrorLogin(false)}
                                        >
                                            <CloseIcon fontSize="inherit"/>
                                        </IconButton>
                                    }>
                                <AlertTitle>Falló la autenticación, usuario o contraseña incorrectos.</AlertTitle>
                            </Alert>
                        </Collapse>
                    </Box>
                </form>
            </div>
        </div>
    )
}