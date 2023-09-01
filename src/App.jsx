import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './styles/global-styles.css'

import {CarList} from "./components/cars-list/CarList";
import Navbar from "./components/navbar/Navbar";
import {Route, Routes} from "react-router-dom";
import {CarPage} from "./components/car-page/CarPage";


const App = () => {

    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={<CarList/>} />
                <Route path="/car/:id" element={<CarPage/>} />
            </Routes>
        </div>

);
}

export default App;
