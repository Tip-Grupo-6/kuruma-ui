import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './styles/global-styles.css'

import {CarList} from "./components/cars-list/CarList";
import Navbar from "./components/navbar/Navbar";
import {Route, Routes} from "react-router-dom";
import {CarPage} from "./components/car-page/CarPage";
import {NotificationPage} from "./components/notifications/NotificationPage";


const App = () => {

    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="" element={<CarPage/>} />
                <Route path="/:id" element={<CarPage/>} />
                <Route path="/notificaciones" element={<NotificationPage/>} />
            </Routes>
        </div>

);
}

export default App;
