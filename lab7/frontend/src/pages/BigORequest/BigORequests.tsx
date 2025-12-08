import { useEffect, useState } from 'react';
import { Container, Table, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import Header from '../../components/Header/Header';
import { ROUTES } from '../../Routes';
import { api } from '../../api';
import type {AllBigoRequestsListParams, SerializerBigORequestJSON} from '../../api/Api';
import './BigORequestsPage.css';

export default function BigORequestsPage() {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.user);
    const [requests, setRequests] = useState<SerializerBigORequestJSON[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Состояния для фильтров
    const [filters, setFilters] = useState({
        status: '',
        fromDate: '',
        toDate: ''
    });

    useEffect(() => {
        if (isAuthenticated) {
            loadUserRequests();
        }
    }, [isAuthenticated]);

    const loadUserRequests = async () => {
        try {
            setLoading(true);
            setError('');

            const queryParams: Partial<AllBigoRequestsListParams> = {};

            if (filters.status) queryParams.status = filters.status;
            if (filters.fromDate) queryParams['from-date'] = filters.fromDate;
            if (filters.toDate) queryParams['to-date'] = filters.toDate;

            const response = await api.bigorequest.allBigoRequestsList(queryParams);
            setRequests(response.data);

        } catch (err: unknown) {
            const e = err as { response?: { data?: { error?: string } } };
            setError(e.response?.data?.error || 'Ошибка при загрузке заявок');
        } finally {
            setLoading(false);
        }
    };


    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const applyFilters = () => {
        loadUserRequests();
    };

    const clearFilters = () => {
        setFilters({
            status: '',
            fromDate: '',
            toDate: ''
        });
        // После очистки фильтров загружаем все заявки
        setTimeout(loadUserRequests, 0);
    };

    const getStatusVariant = (status: string | undefined) => {
        switch (status) {
            case 'черновик': return 'черновик';
            case 'выполнен': return 'выполнен';
            case 'отклонен': return 'отклонен';
            case 'сформирован': return 'сформирован';
            case 'удален': return 'удален';
            default: return 'черновик';
        }
    };

    const getStatusText = (status: string | undefined) => {
        switch (status) {
            case 'черновик': return 'Черновик';
            case 'отклонен': return 'отклонен';
            case 'выполнен': return 'выполнен';
            case 'сформирован': return 'сформирован';
            case 'удален': return 'удален';
            default: return status || 'Неизвестно';
        }
    };


    if (!isAuthenticated) {
        return (
            <>
                <Header />
                <Container className="requests-container">
                    <Alert variant="warning">
                        Для просмотра заявок необходимо авторизоваться
                    </Alert>
                </Container>
            </>
        );
    }

    return (
        <>
            <Header />
            <Container className="requests-container">
                <Card className="requests-card">
                    <Card.Body>
                        <div className="requests-header">
                            <h2>Мои заявки на расчет</h2>
                        </div>

                        {/* Фильтры */}
                        <Card className="filters-card mb-4">
                            <Card.Body>
                                <h5>Фильтры</h5>
                                <div className="filters-row">
                                    <div className="filter-group">
                                        <label>Статус:</label>
                                        <select
                                            value={filters.status}
                                            onChange={(e) => handleFilterChange('status', e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="">Все статусы</option>
                                            <option value="черновик">Черновик</option>
                                            <option value="сформирован">Сформирован</option>
                                            <option value="выполнен">Выполнен</option>
                                            <option value="отклонен">Отклонен</option>
                                            <option value="удален">Удален</option>
                                        </select>
                                    </div>

                                    <div className="filter-group">
                                        <label>С даты:</label>
                                        <input
                                            type="date"
                                            value={filters.fromDate}
                                            onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="filter-group">
                                        <label>По дату:</label>
                                        <input
                                            type="date"
                                            value={filters.toDate}
                                            onChange={(e) => handleFilterChange('toDate', e.target.value)}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="filter-actions">
                                        <Button
                                            variant="primary"
                                            onClick={applyFilters}
                                            disabled={loading}
                                            style={{ backgroundColor: '#148761', borderColor: '#148761' }}
                                        >
                                            Применить
                                        </Button>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>

                        {error && <Alert variant="danger">{error}</Alert>}

                        {loading ? (
                            <div className="text-center py-4">
                                <Spinner animation="border" />
                                <p className="mt-2">Загрузка заявок...</p>
                            </div>
                        ) : requests.length === 0 ? (
                            <div className="text-center py-4">
                                <p>У вас пока нет заявок</p>
                                <Button
                                    as={Link}
                                    to={ROUTES.ComplexClasses}
                                    variant="primary"
                                    style={{ backgroundColor: '#148761', borderColor: '#148761' }}
                                >
                                    Перейти к классам сложности
                                </Button>
                            </div>
                        ) : (
                            <Table responsive className="requests-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Дата создания</th>
                                    <th>Дата завершения</th>
                                    <th>Статус</th>
                                    <th>Сложность</th>
                                    <th>Время расчета</th>
                                    <th>Модератор</th>
                                </tr>
                                </thead>
                                <tbody>
                                {requests.map((request) => (
                                    <tr key={request.bigo_request_id}>
                                        <td className="databigo">#{request.bigo_request_id}</td>
                                        <td className="databigo">{request.date_create}</td>
                                        <td className="databigo">{request.date_finish}</td>
                                        <td className="databigo">
                                                <span className={`status-badge status-${getStatusVariant(request.status)}`}>
                                                    {getStatusText(request.status)}
                                                </span>
                                        </td>
                                        <td className="databigo">
                                            {request.calculated_complexity || '-'}
                                        </td>
                                        <td className="databigo">
                                            {request.calculated_time ? `${request.calculated_time} мс` : '-'}
                                        </td>
                                        <td className="databigo">
                                            {request.moderator_login || '-'}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}