import React, {useEffect, useState} from "react";

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
    }

    const setUserLogout = () => {
        setAccessToken(null)
        setIsLogged(false)
        localStorage.removeItem("accessToken")
    }

    return (
        <UserLoggedContext.Provider value={{isLogged, accessToken, setUserLogged, setUserLogout}}>
            {children}
        </UserLoggedContext.Provider>
    )
}

