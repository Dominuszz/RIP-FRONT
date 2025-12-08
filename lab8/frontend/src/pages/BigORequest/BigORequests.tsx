import { useEffect, useState, useRef, act } from 'react';
import { Container, Table, Card, Spinner, Alert, Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import Header from '../../components/Header/Header';
import { ROUTES } from '../../Routes';
import { api } from '../../api';
import type { AllBigoRequestsListParams, SerializerBigORequestJSON } from '../../api/Api';
import './BigORequestsPage.css';

export default function BigORequestsPage() {
    const dispatch = useAppDispatch();
    const { isAuthenticated, isModerator, username } = useAppSelector((state) => state.user);
    const [requests, setRequests] = useState<SerializerBigORequestJSON[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pollingActive, setPollingActive] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Состояния для фильтров
    const [filters, setFilters] = useState({
        status: '',
        fromDate: '',
        toDate: '',
        creatorFilter: '' // Новый фильтр по создателю на фронтенде
    });

    // Состояния для модального окна модератора
    const [showModeratorModal, setShowModeratorModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<SerializerBigORequestJSON | null>(null);
    const [moderatorAction, setModeratorAction] = useState<'выполнен' | 'отклонен'>('выполнен');
    const [actionLoading, setActionLoading] = useState(false);

    // Short Polling
    useEffect(() => {
        if (!isAuthenticated) return;

        // Загружаем один раз всегда
        loadUserRequests();

        // ShortPolling только для модератора
        if (isModerator && pollingActive) {
            startPolling();
        } else {
            stopPolling();
        }

        return () => stopPolling();
    }, [isAuthenticated, isModerator, pollingActive]);


    const startPolling = () => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
        }

        const interval = setInterval(() => {
            loadUserRequests();
            setLastUpdate(new Date());
            
        }, 15000); 

        pollingIntervalRef.current = interval;
        console.log('Short Polling запущен');
    };

    const stopPolling = () => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
        console.log('Short Polling остановлен');
    };

    const togglePolling = () => {
        if (pollingActive) {
            stopPolling();
            setPollingActive(false);
        } else {
            setPollingActive(true);
        }
    };

    const loadUserRequests = async () => {
        try {
            setLoading(true);
            setError('');
            
            const queryParams: Partial<AllBigoRequestsListParams> = {};

            if (filters.status) queryParams.status = filters.status;
            if (filters.fromDate) queryParams['from-date'] = filters.fromDate;
            if (filters.toDate) queryParams['to-date'] = filters.toDate;

            const response = await api.bigorequest.allBigoRequestsList(queryParams);
            
            // Фильтрация по создателю на фронтенде
            let filteredRequests = response.data;
            if (filters.creatorFilter) {
                filteredRequests = filteredRequests.filter(request => 
                    request.creator_login?.toLowerCase().includes(filters.creatorFilter.toLowerCase())
                );
            }

            setRequests(filteredRequests);

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


    // Обработчики для модератора
    const handleModeratorAction = async (request, action) => {
        setSelectedRequest(request);
        await confirmModeratorAction(request, action);
    };


    const confirmModeratorAction = async (request: SerializerBigORequestJSON, action: 'выполнен' | 'отклонен') => {
        try {
            await api.bigorequest.finishBigorequestUpdate(
                { id: request.bigo_request_id },
                { status: action }
            );
            loadUserRequests();
        } catch {}
    };


    const getStatusVariant = (status: string | undefined) => {
        switch (status) {
            case 'выполнен': return 'выполнен';
            case 'отклонен': return 'отклонен';
            case 'сформирован': return 'сформирован';
        }
    };

    const getStatusText = (status: string | undefined) => {
        switch (status) {
            case 'отклонен': return 'Отклонен';
            case 'выполнен': return 'Выполнен';
            case 'сформирован': return 'Сформирован';
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
                            <h2>{isModerator ? 'Все заявки на расчет' : 'Мои заявки на расчет'}</h2>
                            
                            <div className="polling-controls">
                                
                                {pollingActive && isModerator && (
                                    <span className="polling-indicator text-success">
                                        <Spinner animation="border" size="sm" className="me-1" /> 
                                        Автообновление...
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Фильтры */}
                        <Card className="filters-card mb-4">
                            <Card.Body>
                                <h5>🔍 Фильтры</h5>
                                <div className="filters-row">
                                    <div className="filter-group">
                                        <label>Статус:</label>
                                        <select
                                            value={filters.status}
                                            onChange={(e) => handleFilterChange('status', e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="">Все статусы</option>
                                            <option value="сформирован">Сформирован</option>
                                            <option value="выполнен">Выполнен</option>
                                            <option value="отклонен">Отклонен</option>
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

                                    {/* Фильтр по создателю (только для модераторов) */}
                                    {isModerator && (
                                        <div className="filter-group">
                                            <label>Создатель:</label>
                                            <input
                                                type="text"
                                                value={filters.creatorFilter}
                                                onChange={(e) => handleFilterChange('creatorFilter', e.target.value)}
                                                className="form-control"
                                                placeholder="Фильтр по логину..."
                                            />
                                        </div>
                                    )}

                                    <div className="filter-actions">
                                        <Button
                                            variant="primary"
                                            onClick={applyFilters}
                                            disabled={loading}
                                            className="me-2"
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
                                <p>Заявки не найдены</p>
                            </div>
                        ) : (
                            <>
                                <div className="table-responsive">
                                    <Table className="requests-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Дата создания</th>
                                                <th>Дата завершения</th>
                                                <th>Статус</th>
                                                <th>Сложность</th>
                                                <th>Время расчета</th>
                                                <th>Создатель</th>
                                                <th>Модератор</th>
                                                {isModerator && <th>Действия</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {requests.map((request) => (
                                                <tr key={request.bigo_request_id}>
                                                    <td className="databigo">
                                                        <Link to={`/BigORequest/${request.bigo_request_id}`}>
                                                            #{request.bigo_request_id}
                                                        </Link>
                                                    </td>
                                                    <td className="databigo">{request.date_create}</td>
                                                    <td className="databigo">{request.date_finish || '-'}</td>
                                                    <td className="databigo">
                                                        <span className={`status-badge status-${getStatusVariant(request.status)}`}>
                                                            {getStatusText(request.status)}
                                                        </span>
                                                    </td>
                                                    <td className="databigo">
                                                        {request.calculated_complexity || '-'}
                                                    </td>
                                                    <td className="databigo">
                                                        {request.calculated_time ? `${request.calculated_time.toFixed(2)} мс` : '-'}
                                                    </td>
                                                    <td className="databigo">
                                                        {request.creator_login || 'Неизвестно'}
                                                    </td>
                                                    <td className="databigo">
                                                        {request.moderator_login || '-'}
                                                    </td>
                                                    
                                                    {/* Кнопки действий для модератора */}
                                                    {isModerator && (
                                                        <td className="databigo">
                                                            <div className="moderator-actions">
                                                                {request.status === 'сформирован' && (
                                                                    <>
                                                                        <Button
                                                                            variant="success"
                                                                            size="sm"
                                                                            className="me-1 mb-1"
                                                                            onClick={() => handleModeratorAction(request, 'выполнен')}
                                                                        >
                                                                            ✅ Выполнить
                                                                        </Button>
                                                                        <Button
                                                                            variant="danger"
                                                                            size="sm"
                                                                            className="mb-1"
                                                                            onClick={() => handleModeratorAction(request, 'отклонен')}
                                                                        >
                                                                            ❌ Отклонить
                                                                        </Button>
                                                                    </>
                                                                )}
                                                                
                                                                {request.status === 'выполнен' && (
                                                                    <span className="text-success">✅ Выполнена</span>
                                                                )}
                                                                
                                                                {request.status === 'отклонен' && (
                                                                    <span className="text-danger">❌ Отклонена</span>
                                                                )}
                                                                
                                                                {(request.status === 'черновик' || request.status === 'удален') && (
                                                                    <span className="text-muted">-</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Container>

        </>
    );
}