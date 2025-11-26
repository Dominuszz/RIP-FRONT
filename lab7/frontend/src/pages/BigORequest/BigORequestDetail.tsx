import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Button, Spinner, Alert } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getBigORequest, formBigORequest, deleteBigORequest, updateCompClassRequest } from '../../store/slices/bigorequestSlice';
import Header from '../../components/Header/Header';
import { ROUTES } from '../../Routes';
import './BigORequestPage.css';
import defaultComplexClassImage from '../../assets/compclasserror.jpg';
import { getDestImg } from "../../modules/target_config.ts";

export default function BigORequestPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { data: request, items, isDraft, loading, error } = useAppSelector((state) => state.bigorequest);
    const { isAuthenticated } = useAppSelector((state) => state.user);

    // Локальное состояние для размеров массивов
    const [arraySizes, setArraySizes] = useState<{ [key: number]: string }>({});

    const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

    // Та же функция, что и в CompClassCard — делает путь абсолютным
    const getImageUrl = (photo: string | undefined): string => {
        if (!photo) return defaultComplexClassImage;

        if (
            photo.startsWith("data:") ||
            photo.startsWith("/") ||
            photo.includes("assets/")
        ) {
            return photo;
        }

        return `${getDestImg()}/${photo}`;
    };

    useEffect(() => {
        if (id && id !== 'draft') {
            dispatch(getBigORequest(Number(id)));
        }
    }, [dispatch, id]);

    // Инициализация значений размеров массивов при загрузке items
    useEffect(() => {
        const initialSizes: { [key: number]: string } = {};
        items.forEach(item => {
            if (item.array_size !== undefined) {
                initialSizes[item.complexclass_id!] = item.array_size.toString();
            }
        });
        setArraySizes(initialSizes);
    }, [items]);

    const handleArraySizeChange = (compclassId: number, value: string) => {
        setArraySizes(prev => ({
            ...prev,
            [compclassId]: value
        }));
    };

    const handleSaveArraySize = async (compclassId: number) => {
        if (!request?.bigo_request_id) return;

        const arraySize = arraySizes[compclassId] ? parseInt(arraySizes[compclassId]) : undefined;

        try {
            await dispatch(updateCompClassRequest({
                compclassId,
                bigoRequestId: request.bigo_request_id,
                data: {
                    array_size: arraySize
                }
            })).unwrap();
        } catch (error) {
            console.error('Ошибка при сохранении размера массива:', error);
        }
    };

    const handleFormRequest = async () => {
        if (!request?.bigo_request_id) return;
        await dispatch(formBigORequest(request.bigo_request_id));
        navigate(ROUTES.BigORequests);
    };

    const handleDeleteRequest = async () => {
        if (!request?.bigo_request_id) return;
        await dispatch(deleteBigORequest(request.bigo_request_id));
        navigate(ROUTES.BigORequests);
    };

    if (!isAuthenticated) {
        return (
            <>
                <Header />
                <Container className="request-container">
                    <Alert variant="warning">Для просмотра заявки необходимо авторизоваться</Alert>
                </Container>
            </>
        );
    }

    if (loading) {
        return (
            <>
                <Header />
                <Container className="request-container">
                    <div className="text-center py-5">
                        <Spinner animation="border" />
                        <p className="mt-2">Загрузка заявки...</p>
                    </div>
                </Container>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <Container className="request-container">
                    <Alert variant="danger">{error}</Alert>
                </Container>
            </>
        );
    }

    if (!request && id !== 'draft') {
        return (
            <>
                <Header />
                <Container className="request-container">
                    <Alert variant="warning">Заявка не найдена</Alert>
                </Container>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="bigo-request-page">
                {/* Заголовок таблицы */}
                <div className="bigo-request-header">
                    <span className="bigo-request-text">Класс сложности</span>
                    <span className="bigo-request-text">Степень</span>
                    <span className="bigo-request-text">Объем массива</span>
                </div>

                {/* Список классов сложности */}

                    {items.length === 0 ? (
                        <div className="text-center py-4">
                            <p>В заявке пока нет классов сложности</p>
                        </div>
                    ) : (
                        items.map((cc) => (
                            <div key={cc.compclass_id} className="bigo-request-row">

                                        {cc.img ? (
                                            <img
                                                src={
                                                    imageErrors[cc.compclass_id!]
                                                        ? defaultComplexClassImage
                                                        : getImageUrl(cc.img)
                                                }
                                                alt={cc.complexity}
                                                className="cell-img"
                                                onError={() =>
                                                    setImageErrors(prev => ({
                                                        ...prev,
                                                        [cc.compclass_id!]: true
                                                    }))
                                                }
                                            />
                                        ) : null}
                                    <span className="bigo-request-text">O({cc.complexity})</span>

                                <span className="bigo-request-text">{cc.degree_text}</span>
                                <span>
                                    {isDraft ? (
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Введите число...."
                                            value={arraySizes[cc.compclass_id!] || ''}
                                            onChange={(e) => handleArraySizeChange(cc.compclass_id!, e.target.value)}
                                            onBlur={() => handleSaveArraySize(cc.compclass_id!)}
                                        />
                                    ) : (
                                        <span className="bigo-request-text">
                                            {cc.array_size || 'Не указан'}
                                        </span>
                                    )}
                                </span>
                            </div>
                        ))
                    )}


                {/* Кнопки действий */}
                <div className="result">
                    {isDraft && (
                        <>
                            <Button
                                variant="primary"
                                onClick={handleFormRequest}
                                className="form-button"
                            >
                                Сформировать заявку
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleDeleteRequest}
                                className="delete-button"
                            >
                                Удалить заявку
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}