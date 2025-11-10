import './HomePage.css';
import { type FC } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../Routes";
import Header from '../../components/Header/Header';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { Button } from "react-bootstrap";

export const HomePage: FC = () => {
    return (
        <>
            <Header />
            <BreadCrumbs
                crumbs={[]}
            />
            <div className="home-banner">
                <div className="banner-content">
                    <h1>BigOCalc</h1>
                    <p>
                        Добро пожаловать в BigOCalc! Здесь вы можете оценить производительность классов сложности.
                    </p>
                    <Link to={ROUTES.ComplexClasses}>
                        <Button variant="primary">Просмотреть классы сложности</Button>
                    </Link>
                </div>
            </div>
        </>
    );
};