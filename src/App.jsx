import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './styles/global-styles.css'

import {CarList} from "./components/cars-list/CarList";
import Navbar from "./components/navbar/Navbar";

const App = () => {

    return (
        <div>
            <Navbar />
            <CarList/>
        </div>
    );
}

export default App;
