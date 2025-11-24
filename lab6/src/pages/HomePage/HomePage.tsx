import './HomePage.css';
import { type FC } from "react";
import Header from '../../components/Header/Header';
import { Carousel } from "react-bootstrap";
import slide1 from "../../assets/slide1.jpg";
import slide2 from "../../assets/slide2.jpg";
export const HomePage: FC = () => {
    return (
        <>
            <Header />

            <div className="carousel-wrapper">
                <Carousel controls={false} indicators fade interval={4000}>
                    <Carousel.Item>
                        <img className="carousel-img" src={slide1} alt="" />
                    </Carousel.Item>

                    <Carousel.Item>
                        <img className="carousel-img" src={slide2} alt="" />
                    </Carousel.Item>
                </Carousel>

                <div className="banner-content">
                    <h1>BigOCalc</h1>
                    <p>
                        Добро пожаловать в BigOCalc! Здесь вы можете оценить производительность классов сложности.
                    </p>
                </div>
            </div>
        </>
    );
};
