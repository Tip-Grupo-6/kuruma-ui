import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './styles/global-styles.css'
import 'mapbox-gl/dist/mapbox-gl.css';

import Navbar from "./components/navbar/Navbar";
import {Route, Routes} from "react-router-dom";
import {CarPage} from "./components/car-page/CarPage";
import {NotificationPage} from "./components/notifications/NotificationPage";
import {LoginPage} from "./components/login-page/LoginPage";
import {OnboardingPage} from "./components/login-page/Onboarding";
import {UserLoggedProvider} from "./components/context/UserLoggedContext";
import {PrivateRoute} from "./components/routes/PrivateRoute";
import {PublicRoute} from "./components/routes/PublicRoute";


const App = () => {

    return (
        <UserLoggedProvider>
            <div>
                <Routes>
                    <Route path={"/login"} element={<PublicRoute />}>
                        <Route path="/login" element={<LoginPage/>} />
                    </Route>
                    <Route path={"/onboarding"} element={<PublicRoute />}>
                        <Route path={"/onboarding"} element={<OnboardingPage />} />
                    </Route>

                    <Route path={"/"} element={<PrivateRoute />}>
                        <Route path={"/"} element={
                            <>
                                <Navbar />
                                <CarPage />
                            </>
                        } />
                    </Route>
                    <Route path={"/notificaciones"} element={<PrivateRoute />}>
                        <Route path={"/notificaciones"} element={
                            <>
                                <Navbar />
                                <NotificationPage />
                            </>
                        } />
                    </Route>
                </Routes>
            </div>
        </UserLoggedProvider>

);
}

export default App;
