import { BrowserRouter, Route, Routes } from "react-router-dom";
import CompClassesPage from "./pages/CompClassesPage/CompClassesPage";
import { ROUTES } from "./Routes";
import { HomePage } from "./pages/HomePage/HomePage";
import CompClassPage from './pages/CompClassPage/CompClassPage';
import 'bootstrap/dist/css/bootstrap.min.css'
import {getDestRoot} from "./modules/target_config.ts";
import RegisterPage from "./pages/Auth/RegisterPage.tsx";
import LoginPage from "./pages/Auth/LoginPage.tsx";
import ProfilePage from "./pages/Auth/ProfilePage.tsx";
import BigORequestsPage from "./pages/BigORequest/BigORequests.tsx";
import BigORequestPage from "./pages/BigORequest/BigORequestDetail.tsx";


function App() {
    return (
        <BrowserRouter basename={getDestRoot()}>
            <Routes>
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.ComplexClasses} element={<CompClassesPage />} />
                <Route path={ROUTES.ComplexClass} element={<CompClassPage />} />
                <Route path={ROUTES.Profile} element={<ProfilePage />} />
                <Route path={ROUTES.Login} element={<LoginPage />} />
                <Route path={ROUTES.Register} element={<RegisterPage />} />
                <Route path={ROUTES.BigORequests} element={<BigORequestsPage />} />
                <Route path={ROUTES.BigORequest} element={<BigORequestPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;