import React, {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";

export const UserLoggedContext = React.createContext({
    isUserLogged: false,
    userAccessToken: null,
    userLogged: () => undefined,
    userLogout: () => undefined
})

export const UserLoggedProvider = ({children}) => {

    const [isLogged, setIsLogged] = useState(false)
    const [accessToken, setAccessToken] = useState()

    useEffect(() => {
        if(!accessToken) {
            const accessTokenFromLocalStorage = localStorage.getItem("accessToken")
            if(accessTokenFromLocalStorage) {
                setUserLogged(accessTokenFromLocalStorage)
            }
        } else {
            setAccessToken(null)
            setIsLogged(false)
        }
    }, [])

    const setUserLogged = (token) => {
        setAccessToken(token)
        setIsLogged(true)
        localStorage.setItem("accessToken", token)
        const tokenData = jwtDecode(token)
        const carId = tokenData?.user?.car_id
        if(carId) {
            localStorage.setItem("car_id", carId)
        }
    }

    const setUserLogout = () => {
        setAccessToken(null)
        setIsLogged(false)
        localStorage.removeItem("accessToken")
        localStorage.removeItem("car_id")
    }

    return (
        <UserLoggedContext.Provider value={{isLogged, accessToken, setUserLogged, setUserLogout}}>
            {children}
        </UserLoggedContext.Provider>
    )
}

