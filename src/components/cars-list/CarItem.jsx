import {makeStyles} from "@material-ui/core/styles";
import {Link} from "react-router-dom";

const styles = makeStyles(theme => ({
    card: {
        display: "flex",
        width: "auto",
        height: "128px",
        backgroundColor: "#FFFFFF",
        padding: "10px",
        borderRadius: "5px",
        color: "inherit",
        textDecoration: "inherit",
        [theme.breakpoints.up("sm")]: {
            flexDirection: "column",
            height: "216px"
        },
        [theme.breakpoints.up("md")]: {
            display: "block",
            height: "287px",
        }
    },
    cardImageContainer: {
        display: "flex",
        justifyContent: "center",
        position: "relative",
        height: "128px",
        margin: "0 10px",
        [theme.breakpoints.up("md")]: {
            width: "224px",
            height: "224px",
            margin: "auto"
        }
    },
    cardImage: {
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        width: "100%",
        height: "100%",
        margin: "auto",
        display: "block",
        [theme.breakpoints.up("sm")]: {
            width: "160px",
            height: "160px"
        }
    },
    cardTitle: {
        margin: "auto",
        textAlign: "center",
        [theme.breakpoints.up("md")]: {
            margin: "0"
        }
    }
}));

export const CarItem = ({car}) => {
    const classes = styles()

    return (
        <Link to={`/car/${car.id}`} className={classes.card}>
            <div className={classes.cardImageContainer}>
                <img src={car.url} alt={car.name} className={classes.cardImage}/>
            </div>
            <h3 className={classes.cardTitle}>{car.name}</h3>
        </Link>
    )
}