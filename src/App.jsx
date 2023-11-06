import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './styles/global-styles.css'

import Navbar from "./components/navbar/Navbar";
import {Route, Routes} from "react-router-dom";
import {CarPage} from "./components/car-page/CarPage";
import {NotificationPage} from "./components/notifications/NotificationPage";
import {LoginPage} from "./components/login-page/LoginPage";
import {useState} from "react";
import {OnboardingPage} from "./components/login-page/Onboarding";


const App = () => {

    const [isLogged, setIsLogged] = useState(false)

    return (
        <div>
            {isLogged && (
                <Navbar />
            )}
            <Routes>
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/onboarding" element={<OnboardingPage/>} />
                <Route path="" element={<CarPage/>} />
                <Route path="/:id" element={<CarPage/>} />
                <Route path="/notificaciones" element={<NotificationPage/>} />
            </Routes>
        </div>

);
}

export default App;
