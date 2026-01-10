import { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Card, Row, Col, Spinner } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {  updateUserProfile } from '../../store/slices/userSlice';
import Header from '../../components/Header/Header';
import './ProfilePage.css';

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const { username, loading, error } = useAppSelector((state) => state.user);

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'danger'>('success');
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    useEffect(() => {
        if (error) {
            setMessage(error);
            setMessageType('danger');
        }
    }, [error]);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setMessage('');
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsChangingPassword(true);

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage('Новые пароли не совпадают');
            setMessageType('danger');
            setIsChangingPassword(false);
            return;
        }

        if (formData.newPassword.length < 1) {
            setMessage('Новый пароль должен содержать минимум 1 символов');
            setMessageType('danger');
            setIsChangingPassword(false);
            return;
        }

        try {
            const result = await dispatch(updateUserProfile({
                login: username,
                password: formData.newPassword
            }));

            if (updateUserProfile.fulfilled.match(result)) {
                setMessage('Пароль успешно изменен');
                setMessageType('success');
                setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else if (updateUserProfile.rejected.match(result)) {
                setMessage(result.payload as string || 'Ошибка при смене пароля');
                setMessageType('danger');
            }
        } catch (error) {
            setMessage('Произошла непредвиденная ошибка');
            setMessageType('danger');
        }

        setIsChangingPassword(false);
    };



    return (
        <>
            <Header />
            <Container className="profile-container">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="profile-card">
                            <Card.Body>
                                <h2 className="profile-title">Личный кабинет</h2>

                                <div className="profile-info mb-4">
                                    <h5>Информация о пользователе</h5>
                                    <p><strong>Логин:</strong> {username}</p>
                                    <p><strong>Статус:</strong> Разработчик</p>
                                </div>

                                <div className="password-change-section">
                                    <h5>Смена пароля</h5>
                                    {message && (
                                        <Alert variant={messageType} className="mt-3">
                                            {message}
                                        </Alert>
                                    )}

                                    <Form onSubmit={handlePasswordSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Новый пароль</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                placeholder="Введите новый пароль"
                                                minLength={1}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-4">
                                            <Form.Label>Подтверждение нового пароля</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                placeholder="Повторите новый пароль"
                                            />
                                        </Form.Group>

                                        <Button
                                            variant="primary"
                                            type="submit"
                                            className="profile-button"
                                            disabled={isChangingPassword || loading}
                                        >
                                            {isChangingPassword ? (
                                                <>
                                                    <Spinner size="sm" className="me-2" />
                                                    Изменение...
                                                </>
                                            ) : (
                                                'Сменить пароль'
                                            )}
                                        </Button>
                                    </Form>
                                </div>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}