import {useContext} from "react";
import {UserLoggedContext} from "./UserLoggedContext";

export const useUserLogged = () => {
    const { isLogged, accessToken, setUserLogged, setUserLogout } = useContext(UserLoggedContext)
    return {
        isUserLogged: isLogged,
        userAccessToken: accessToken,
        userLogged: (token) => setUserLogged(token),
        userLogout: () => setUserLogout()
    }
}