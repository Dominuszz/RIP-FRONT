import { useEffect } from 'react'
import Header from '../../components/Header/Header'
import Search from '../../components/InputField/InputField'
import './CompClassesPage.css'
import CompClassList from "../../components/CompClassList/CompClassList.tsx"
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchComplexClasses, setSearchQuery } from '../../store/slices/complexClassesSlice'
import CartButton from '../../components/CartButton/CartButton';

export default function ComplexClassesPage() {
    const dispatch = useAppDispatch()
    const {
        items: compclasses,
        loading,
        searchQuery,
        isFiltered
    } = useAppSelector(state => state.complexClasses)

    useEffect(() => {
        if (compclasses.length === 0) {
            if (isFiltered && searchQuery) {
                dispatch(fetchComplexClasses(searchQuery))
            } else {
                dispatch(fetchComplexClasses())
            }
        }
    }, [dispatch])

    const handleSearch = () => {
        dispatch(fetchComplexClasses(searchQuery))
    }
    const handleCartClick = async () => {
        try {
            const response = await fetch('/api/v1/bigorequest/bigorequest-cart', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            console.log('Cart request successful');

        } catch (error) {
            console.error('Error making cart request:', error);
        }
    };

    const handleQueryChange = (query: string) => {
        dispatch(setSearchQuery(query))
    }

    return (
        <div className="compclasses-page">
            <Header />

            <main>
                <div className="complexclass-wrapper">
                    <div className="complexclass-search">
                        <Search
                            query={searchQuery}
                            onQueryChange={handleQueryChange}
                            onSearch={handleSearch}
                        />
                    </div>

                    {loading ? (
                        <div>Загрузка...</div>
                    ) : (
                        <div className="complexclass-grid">
                            {compclasses.length > 0 ? (
                                <CompClassList compclasses={compclasses} />
                            ) : (
                                <div className="no-complexclasses">
                                    {searchQuery && searchQuery.trim() !== ''
                                        ? `По запросу "${searchQuery}" не было найдено ни одного класса сложности`
                                        : 'классы сложности не найдены'
                                    }
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <CartButton onClick={handleCartClick} />
        </div>
    )
}