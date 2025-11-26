import { useEffect } from 'react';
import Header from '../../components/Header/Header';
import InputField from '../../components/InputField/InputField';  // Переименуй Search в InputField для consistency
import './CompClassesPage.css';
import CompClassList from "../../components/CompClassList/CompClassList";
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getComplexClassesList, setSearchQuery } from '../../store/slices/complexClassesSlice';
import CartButton from '../../components/CartButton/CartButton';
import { Spinner, Alert } from 'react-bootstrap';

export default function CompClassesPage() {
    const dispatch = useAppDispatch();
    const {
        items: compclasses,
        loading,
        error,
        searchQuery,
        isFiltered,
    } = useAppSelector(state => state.complexClasses);

    useEffect(() => {
        dispatch(getComplexClassesList());
    }, [dispatch]);

    const handleSearch = () => {
        dispatch(getComplexClassesList());
    };



    return (
        <div className="compclasses-page">
            <Header />
            <main>
                <div className="complexclass-wrapper">
                    <div className="complexclass-search">
                        <InputField
                            value={searchQuery}  // Измени на value вместо query
                            onChange={(value) => dispatch(setSearchQuery(value))}  // Измени onQueryChange
                            onSearch={handleSearch}
                            loading={loading}  // Добавь prop loading для disable кнопки
                        />
                    </div>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {loading ? (
                        <div className="loading-container">
                            <Spinner animation="border" />
                        </div>
                    ) : (
                        <div className="complexclass-grid">
                            {compclasses.length > 0 ? (
                                <CompClassList compclasses={compclasses} />
                            ) : (
                                <div className="no-complexclasses">
                                    {isFiltered
                                        ? `По запросу "${searchQuery}" не было найдено ни одного класса сложности`
                                        : 'Классы сложности не найдены'}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <CartButton/>
        </div>
    );
}