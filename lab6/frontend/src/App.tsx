import { BrowserRouter, Route, Routes } from "react-router-dom";
import CompClassesPage from "./pages/CompClassesPage/CompClassesPage";
import { ROUTES } from "./Routes";
import { HomePage } from "./pages/HomePage/HomePage";
import CompClassPage from './pages/CompClassPage/CompClassPage';
import 'bootstrap/dist/css/bootstrap.min.css'
import {useEffect} from "react";
import {invoke} from "@tauri-apps/api/core";
import {dest_root} from "./modules/target_config.ts";


function App() {
    useEffect(()=>{
        invoke('tauri', {cmd:'create'})
            .then(() =>{console.log("Tauri launched")})
            .catch(() =>{console.log("Tauri not launched")})
        return () =>{
            invoke('tauri', {cmd:'close'})
                .then(() =>{console.log("Tauri launched")})
                .catch(() =>{console.log("Tauri not launched")})
        }
    }, [])

    return (
        <BrowserRouter basename={dest_root}>
            <Routes>
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.ComplexClasses} element={<CompClassesPage />} />
                <Route path={ROUTES.ComplexClass} element={<CompClassPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;