import './Header.css';
import logo from "../../assets/logo.png";
import { ROUTES } from "../../Routes";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser } from '../../store/slices/userSlice';
import { resetState as resetBigORequest } from '../../store/slices/bigorequestSlice';
import { setSearchQuery } from '../../store/slices/complexClassesSlice';

export default function Header() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, username, loading } = useAppSelector((state) => state.user);

    const [isMenuActive, setIsMenuActive] = useState(false);

    const toggleMenu = () => {
        setIsMenuActive(!isMenuActive);
    };

    const closeMenu = () => {
        setIsMenuActive(false);
    };

    const handleLogout = async () => {
        await dispatch(logoutUser());
        dispatch(resetBigORequest());
        dispatch(setSearchQuery(''));
        closeMenu();
        navigate(ROUTES.HOME);
    };

    return (
        <header>
            <nav className="navbar">
                <div className="nav-left">
                    <Link to={ROUTES.HOME} className="nav-logo" onClick={closeMenu}>
                        <img src={logo} alt="logo" className="header-logo" />
                    </Link>
                    <Link to={ROUTES.HOME} className="nav-title" onClick={closeMenu}>BigOCalc</Link>

                    <div className="nav-links">
                        <Link to={ROUTES.HOME} className="nav-link" onClick={closeMenu}>Главная</Link>
                        <Link to={ROUTES.ComplexClasses} className="nav-link" onClick={closeMenu}>Классы сложности</Link>

                        {isAuthenticated ? (
                            <>
                                <Link to={ROUTES.BigORequests} className="nav-link" onClick={closeMenu}>
                                    Мои заявки
                                </Link>
                                <Link to={ROUTES.Profile} className="nav-link" onClick={closeMenu}>
                                    {username}
                                </Link>
                                <button
                                    className="nav-link logout-button"
                                    onClick={handleLogout}
                                    disabled={loading}
                                >
                                    {loading ? 'Выход...' : 'Выйти'}
                                </button>
                            </>
                        ) : (
                            <Link to={ROUTES.Login} className="nav-link" onClick={closeMenu}>Войти</Link>
                        )}
                    </div>
                </div>

                <div
                    className={`nav-mobile-wrapper ${isMenuActive ? 'active' : ''}`}
                    onClick={toggleMenu}
                >
                    <div className="nav-mobile-target" />
                    <div className="nav-mobile-menu" onClick={(event) => event.stopPropagation()}>
                        <Link to={ROUTES.HOME} className="nav-link" onClick={closeMenu}>Главная</Link>
                        <Link to={ROUTES.ComplexClasses} className="nav-link" onClick={closeMenu}>Классы сложности</Link>

                        {isAuthenticated ? (
                            <>
                                <Link to={ROUTES.BigORequests} className="nav-link" onClick={closeMenu}>
                                    Мои заявки
                                </Link>
                                <Link to={ROUTES.Profile} className="nav-link" onClick={closeMenu}>
                                    {username}
                                </Link>
                                <button
                                    className="nav-link logout-button"
                                    onClick={handleLogout}
                                    disabled={loading}
                                >
                                    {loading ? 'Выход...' : 'Выйти'}
                                </button>
                            </>
                        ) : (
                            <Link to={ROUTES.Login} className="nav-link" onClick={closeMenu}>Войти</Link>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}