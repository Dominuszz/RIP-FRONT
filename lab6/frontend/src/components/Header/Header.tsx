import './Header.css';
import logo from "../../assets/logo.png";
import { ROUTES } from "../../Routes";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
    const [isMenuActive, setIsMenuActive] = useState(false);

    const toggleMenu = () => {
        setIsMenuActive(!isMenuActive);
    };

    const closeMenu = () => {
        setIsMenuActive(false);
    };

    return (
        <header>
            <nav className="navbar">
                <div className="nav-left">
                    <Link to={ROUTES.HOME} className="nav-logo" onClick={closeMenu}>
                        <img src={logo} alt="logo" className="header-logo" />
                    </Link>
                    <Link to={ROUTES.HOME} className="nav-title" onClick={closeMenu}>BigOCalc</Link>
                </div>


                <div className="nav-links">
                    <Link to={ROUTES.HOME} className="nav-link" onClick={closeMenu}>Главная</Link>
                    <Link to={ROUTES.ComplexClasses} className="nav-link" onClick={closeMenu}>Классы сложности</Link>
                </div>

                <div
                    className={`nav-mobile-wrapper ${isMenuActive ? 'active' : ''}`}
                    onClick={toggleMenu}
                >
                    <div className="nav-mobile-target" />
                    <div className="nav-mobile-menu" onClick={(event) => event.stopPropagation()}>
                        <Link to={ROUTES.HOME} className="nav-link" onClick={closeMenu}>Главная</Link>
                        <Link to={ROUTES.ComplexClasses} className="nav-link" onClick={closeMenu}>Классы сложности</Link>
                    </div>
                </div>
            </nav>
        </header>
    );
}