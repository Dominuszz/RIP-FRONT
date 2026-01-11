import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import InputField from '../../components/InputField/InputField';
import './CompClassesPage.css';
import CompClassList from "../../components/CompClassList/CompClassList";
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  getComplexClassesList, 
  setSearchQuery, 
  setCurrentPage,
} from '../../store/slices/complexClassesSlice';
import CartButton from '../../components/CartButton/CartButton';
import { Spinner, Alert, Pagination, Button } from 'react-bootstrap';
import LLMAssistant from '../../components/LLMAssistant/LLMAssistant'; // Добавлено

export default function CompClassesPage() {
    const dispatch = useAppDispatch();
    const {
        items: compclasses,
        loading,
        error,
        searchQuery,
        pagination,
    } = useAppSelector(state => state.complexClasses);
    
    const [showAssistant, setShowAssistant] = useState(false); // Добавлено
    const { isAuthenticated } = useAppSelector((state) => state.user);
    useEffect(() => {
        dispatch(getComplexClassesList({ page: 1 }));
    }, [dispatch]);

    const handleSearch = () => {
        dispatch(setCurrentPage(1));
        dispatch(getComplexClassesList({ page: 1 }));
    };

    const handlePageChange = (page: number) => {
        dispatch(setCurrentPage(page));
        dispatch(getComplexClassesList({ page }));
    };

    // Пагинация (оставляем без изменений)
    const renderPaginationItems = () => {
        const items = [];
        const { currentPage, totalPages } = pagination;

        if (totalPages > 1) {
            items.push(
                <Pagination.Item 
                    key={1} 
                    active={currentPage === 1}
                    onClick={() => handlePageChange(1)}
                >
                    1
                </Pagination.Item>
            );
        }

        if (currentPage > 4) {
            items.push(<Pagination.Ellipsis key="start-ellipsis" />);
        }

        for (
            let number = Math.max(2, currentPage - 2); 
            number <= Math.min(totalPages - 1, currentPage + 2); 
            number++
        ) {
            items.push(
                <Pagination.Item 
                    key={number} 
                    active={currentPage === number}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }

        if (currentPage < totalPages - 3) {
            items.push(<Pagination.Ellipsis key="end-ellipsis" />);
        }

        if (totalPages > 1 && currentPage !== totalPages) {
            items.push(
                <Pagination.Item 
                    key={totalPages} 
                    active={currentPage === totalPages}
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </Pagination.Item>
            );
        }

        return items;
    };

    // Подготовка данных для ассистента
    const assistantServices = compclasses.map(cc => ({
        name: `Класс сложности O(${cc.complexity || ''})`,
        description: cc.description || '',
        complexity: cc.complexity || ''
    }));

    return (
        <div className="compclasses-page">
            <Header />
            <main className="main-content">
                <div className="complexclass-wrapper">
                    <div className="complexclass-search d-flex align-items-start gap-3">
                        <div className="flex-grow-1">
                            <InputField
                                value={searchQuery}
                                onChange={(value) => dispatch(setSearchQuery(value))}
                                onSearch={handleSearch}
                                loading={loading}
                                placeholder="Поиск по типу сложности (O(n), логарифмическая, экспоненциальная...)"
                            />
                        </div>
                            {!isAuthenticated && (

                                <Button 
                                onClick={() => setShowAssistant(true)}
                                className="assistant-toggle-btn"
                                title="Открыть AI ассистента по классам сложности"
                                >
                                <span className="me-2">🤖</span>
                                AI Ассистент
                                </Button>
                            )}
                    </div>

                    {error && <Alert variant="danger" className="mt-4">{error}</Alert>}

                    {loading ? (
                        <div className="loading-container">
                            <Spinner animation="border" variant="light" />
                            <p className="mt-3 text-muted">Загрузка классов сложности...</p>
                        </div>
                    ) : (
                        <>
                            <div className="complexclass-grid">
                                {compclasses.length > 0 ? (
                                    <CompClassList compclasses={compclasses} />
                                ) : (
                                    <div className="no-complexclasses">
                                        {searchQuery
                                            ? `По запросу «${searchQuery}» ничего не найдено`
                                            : 'Классы сложности не найдены'}
                                    </div>
                                )}
                            </div>

                            {pagination.totalPages > 1 && (
                                <div className="pagination-container">
                                    <Pagination size="lg" className="justify-content-center">
                                        <Pagination.First 
                                            onClick={() => handlePageChange(1)}
                                            disabled={pagination.currentPage === 1}
                                        />
                                        <Pagination.Prev 
                                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                                            disabled={pagination.currentPage === 1}
                                        />

                                        {renderPaginationItems()}

                                        <Pagination.Next 
                                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                                            disabled={pagination.currentPage === pagination.totalPages}
                                        />
                                        <Pagination.Last 
                                            onClick={() => handlePageChange(pagination.totalPages)}
                                            disabled={pagination.currentPage === pagination.totalPages}
                                        />
                                    </Pagination>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <CartButton />
            
        
            <LLMAssistant
                services={assistantServices}
                show={showAssistant}
                onHide={() => setShowAssistant(false)}
            />
        </div>
    );
}