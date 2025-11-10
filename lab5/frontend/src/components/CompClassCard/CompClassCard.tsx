import { Link } from "react-router-dom";
import type { ComplexClass } from "../../modules/compclassapi.ts";
import './CompClassCard.css';
import { useState, useEffect } from 'react';
import defaultComplexClassImage from '../../assets/compclasserror.jpg';

export default function CompClassCard({ complexclass }: { complexclass: ComplexClass; }) {
    const [imageError, setImageError] = useState(false);

    const getImageUrl = (photo: string) => {
        if (!photo) return defaultComplexClassImage;

        if (photo.startsWith("data:") || photo.startsWith("/") || photo.includes("assets/")) {
            return photo;
        }
        return `http://localhost:9000/lab1/${photo}`;
    };

    const [imageUrl, setImageUrl] = useState(getImageUrl(complexclass.img));

    useEffect(() => {
        if (!complexclass.img) {
            setImageUrl(defaultComplexClassImage );
        } else {
            setImageUrl(getImageUrl(complexclass.img));
        }
    }, [complexclass.img]);

    const handleImageError = () => {
        setImageError(true);
        setImageUrl(defaultComplexClassImage );
    };

    return (
        <div className="card-detail">
            <img
                src={imageError ? defaultComplexClassImage : imageUrl}
                alt="img"
                className="card-image"
                onError={handleImageError}/>
            <div className="card-content">
                <p className="card-text-detail">O({complexclass.complexity})</p>
                <p className="card-text-detail">Степень: {complexclass.degree_text}</p>
                <div>
                    <Link to={`/ComplexClass/${complexclass.compclass_id}`} className="card-button">
                        Подробнее
                    </Link>
                </div>
            </div>
        </div>

    );
}