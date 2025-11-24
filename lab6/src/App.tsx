import { BrowserRouter, Route, Routes } from "react-router-dom";
import ComplexClassesPage from "./pages/CompClassesPage/CompClassesPage.tsx";
import { ROUTES } from "./Routes";
import { HomePage } from "./pages/HomePage/HomePage";
import ComplexClassPage from './pages/CompClassPage/CompClassPage.tsx';
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <BrowserRouter basename="">
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.ComplexClasses} element={<ComplexClassesPage/>} />
        <Route path={ROUTES.ComplexClass} element={<ComplexClassPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;