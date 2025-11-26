import { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Card, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser } from '../../store/slices/userSlice';
import { ROUTES } from '../../Routes';
import Header from '../../components/Header/Header';
import './AuthPages.css';

export default function LoginPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, error, loading } = useAppSelector((state) => state.user);

    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });

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
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await dispatch(loginUser(formData));
        if (loginUser.fulfilled.match(result)) {
            navigate(ROUTES.HOME);
        }
    };

    return (
        <>
            <Header />
            <Container className="auth-container">
                <Card className="auth-card">
                    <Card.Body>
                        <h2 className="auth-title">Вход в систему</h2>
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Логин</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="login"
                                    value={formData.login}
                                    onChange={handleChange}
                                    required
                                    placeholder="Введите ваш логин"
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
                                    placeholder="Введите ваш пароль"
                                />
                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                className="auth-button"
                                disabled={loading}
                            >
                                {loading ? <Spinner size="sm" /> : 'Войти'}
                            </Button>
                        </Form>

                        <div className="auth-link">
                            Нет аккаунта? <Link to={ROUTES.Register}>Зарегистрироваться</Link>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}