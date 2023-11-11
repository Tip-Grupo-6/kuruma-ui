import {useContext} from "react";
import {UserLoggedContext} from "./UserLoggedContext";

export const useUserLogged = () => {
    const { isLogged, accessToken, setUserLogged, setUserLogout } = useContext(UserLoggedContext)
    return {
        isLogged,
        accessToken,
        userLogged: (token) => setUserLogged(token),
        userLogout: () => setUserLogout()
    }
}