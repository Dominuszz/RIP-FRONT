import { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Card, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerUser } from '../../store/slices/userSlice';
import { ROUTES } from '../../Routes';
import Header from '../../components/Header/Header';
import './AuthPages.css';

export default function RegisterPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, error, loading } = useAppSelector((state) => state.user);

    const [formData, setFormData] = useState({
        login: '',
        password: '',
        confirmPassword: ''
    });

    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            navigate(ROUTES.HOME);
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setValidationError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setValidationError('Пароли не совпадают');
            return;
        }

        if (formData.password.length < 1) {
            setValidationError('Пароль должен содержать минимум 1 символов');
            return;
        }

        const result = await dispatch(registerUser({
            login: formData.login,
            password: formData.password
        }));

        if (registerUser.fulfilled.match(result)) {
            navigate(ROUTES.HOME);
        }
    };

    return (
        <>
            <Header />
            <Container className="auth-container">
                <Card className="auth-card">
                    <Card.Body>
                        <h2 className="auth-title">Регистрация</h2>
                        {(error || validationError) && (
                            <Alert variant="danger">{error || validationError}</Alert>
                        )}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Логин</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="login"
                                    value={formData.login}
                                    onChange={handleChange}
                                    required
                                    placeholder="Придумайте логин"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Пароль</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Придумайте пароль"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Подтверждение пароля</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="Повторите пароль"
                                />
                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                className="auth-button"
                                disabled={loading}
                            >
                                {loading ? <Spinner size="sm" /> : 'Зарегистрироваться'}
                            </Button>
                        </Form>

                        <div className="auth-link">
                            Уже есть аккаунт? <Link to={ROUTES.Login}>Войти</Link>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}