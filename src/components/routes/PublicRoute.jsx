import {Navigate, Outlet} from "react-router-dom";

export const PublicRoute = () => {

    const accessToken = localStorage.getItem("accessToken")

    if(!accessToken) {
        return <Outlet/>
    } else {
        return <Navigate to="/"/>
    }
}