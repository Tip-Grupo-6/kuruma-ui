import {useParams} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";

const styles = makeStyles(theme => ({
    card: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "auto",
        height: "500px",
        backgroundColor: "#FFFFFF",
        borderRadius: "5px",
        padding: "20px",
        margin: "20px",
        [theme.breakpoints.up("sm")]: {
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
        }
    },
    carrousel: {

    },
    cardImage: {
        width: "100%",
        height: "471px",
        borderRadius: "5px"
    }
}));

export const CarPage = () => {
    const classes = styles()
    const { id } = useParams();

    return (
        <div className={classes.card}>
            <div className={classes.carrousel}>
                <img src={"/images/peugeot_208_perfil.jpg"} alt={"peugeot 208"} className={classes.cardImage}/>
            </div>
            <div className={classes.carrousel}>
                <h1 style={{marginTop: 0}}>Peugeot 208</h1>
            </div>
        </div>
    )
}