import { Link } from "react-router-dom";
import type { ComplexClass } from "../../modules/compclassapi.ts";
import './CompClassCard.css';
import { useState, useEffect } from 'react';
import defaultComplexClassImage from '../../assets/compclasserror.jpg';
import { getDestImg } from "../../modules/target_config.ts";
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addComplexClassToRequest } from '../../store/slices/bigorequestSlice';
import { Button, Spinner, Toast } from 'react-bootstrap';

export default function CompClassCard({ complexclass }: { complexclass: ComplexClass; }) {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.user);
    const { loading } = useAppSelector((state) => state.bigorequest); // Убрал draftId

    const [imageError, setImageError] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [addingItemId, setAddingItemId] = useState<number | null>(null);

    const getImageUrl = (photo: string | undefined) => {
        if (!photo) return defaultComplexClassImage;

        if (photo.startsWith("data:") || photo.startsWith("/") || photo.includes("assets/")) {
            return photo;
        }
        return `${getDestImg()}/${photo}`;
    };

    const [imageUrl, setImageUrl] = useState(getImageUrl(complexclass.img));

    useEffect(() => {
        if (!complexclass.img) {
            setImageUrl(defaultComplexClassImage);
        } else {
            setImageUrl(getImageUrl(complexclass.img));
        }
    }, [complexclass.img]);

    const handleImageError = () => {
        setImageError(true);
        setImageUrl(defaultComplexClassImage);
    };

    const handleAddToRequest = async () => {
        if (!complexclass.compclass_id) return;

        setAddingItemId(complexclass.compclass_id);
        const result = await dispatch(addComplexClassToRequest(complexclass.compclass_id));

        if (addComplexClassToRequest.fulfilled.match(result)) {
            setShowToast(true);
        }

        setAddingItemId(null);
    };

    const isAdding = addingItemId === complexclass.compclass_id && loading;

    return (
        <>
            <div className="card-detail">
                <img
                    src={imageError ? defaultComplexClassImage : imageUrl}
                    alt="img"
                    className="card-image"
                    onError={handleImageError}
                />
                <div className="card-content">
                    <p className="card-text-detail">O({complexclass.complexity || ''})</p>
                    <p className="card-text-detail">Степень: {complexclass.degree_text || ''}</p>

                    <div className="card-actions">
                        <Link
                            to={`/ComplexClass/${complexclass.compclass_id}`}
                            className="card-button"
                        >
                            Подробнее
                        </Link>

                        {isAuthenticated && (
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={handleAddToRequest}
                                disabled={isAdding}
                                className="add-to-request-btn"
                            >
                                {isAdding ? (
                                    <Spinner animation="border" size="sm" />
                                ) : (
                                    'Добавить в заявку'
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                className="position-fixed top-0 end-0 m-3"
                delay={3000}
                autohide
            >
                <Toast.Header>
                    <strong className="me-auto">Успешно</strong>
                </Toast.Header>
                <Toast.Body>
                    Класс сложности добавлен в заявку!
                </Toast.Body>
            </Toast>
        </>
    );
}