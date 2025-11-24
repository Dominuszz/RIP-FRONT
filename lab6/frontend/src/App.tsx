import {  Route, Routes } from "react-router-dom";
import CompClassesPage from "./pages/CompClassesPage/CompClassesPage";
import { ROUTES } from "./Routes";
import { HomePage } from "./pages/HomePage/HomePage";
import CompClassPage from './pages/CompClassPage/CompClassPage';
import 'bootstrap/dist/css/bootstrap.min.css'


function App() {
    return (
            <Routes>
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.ComplexClasses} element={<CompClassesPage />} />
                <Route path={ROUTES.ComplexClass} element={<CompClassPage />} />
            </Routes>
    );
}

export default App;