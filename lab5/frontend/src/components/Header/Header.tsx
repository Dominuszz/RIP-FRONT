import './Header.css';
import logo from "../../assets/logo.png";
import { ROUTES } from "../../Routes";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header>
            <nav className="navbar">
                <div className="nav-left">
                    <Link to={ROUTES.HOME} className="nav-logo">
                        <img src={logo} alt="logo" className="header-logo" />
                    </Link>
                    <Link to={ROUTES.HOME} className="nav-title">BigOCalc</Link>
                    <Link to={ROUTES.ComplexClasses} className="nav-title">Классы сложности</Link>
                </div>
            </nav>
        </header>
    );
}
