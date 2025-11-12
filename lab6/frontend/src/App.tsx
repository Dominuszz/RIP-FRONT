import { BrowserRouter, Route, Routes } from "react-router-dom";
import CompClassesPage from "./pages/CompClassesPage/CompClassesPage";
import { ROUTES } from "./Routes";
import { HomePage } from "./pages/HomePage/HomePage";
import CompClassPage from './pages/CompClassPage/CompClassPage';
import 'bootstrap/dist/css/bootstrap.min.css'
import {useEffect} from "react";
import {invoke} from "@tauri-apps/api/core";
import { getDestRoot} from "./modules/target_config.ts";


function App() {
    useEffect(()=>{
        invoke('tauri', {cmd:'create'})
            .then(() =>{console.log("Tauri launched")})
            .catch((e) =>{console.warn("Tauri 'create' failed (normal in web/dev):", e)})  // ← Добавьте catch
        return () =>{
            invoke('tauri', {cmd:'close'})
                .then(() =>{console.log("Tauri closed")})
                .catch((e) =>{console.warn("Tauri 'close' failed:", e)})  // ← Добавьте catch
        }
    }, [])
    console.log("App mounted, dest_root:", getDestRoot());
    return (
        <BrowserRouter basename={getDestRoot()}>
            <Routes>
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.ComplexClasses} element={<CompClassesPage />} />
                <Route path={ROUTES.ComplexClass} element={<CompClassPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;