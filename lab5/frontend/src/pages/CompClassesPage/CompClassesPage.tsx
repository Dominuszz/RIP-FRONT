import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Search from '../../components/InputField/InputField';

import { listComplexClasses } from '../../modules/compclassapi.ts';
import { COMPLEXCLASS_MOCK } from '../../modules/mock';
import type { ComplexClass } from '../../modules/compclassapi.ts';
import './CompClassesPage.css';
import CompClassList from "../../components/CompClassList/CompClassList.tsx";

export default function ComplexClassesPage() {
    const [compclasses, setComplexClasses] = useState<ComplexClass[]>([]);
    const [searchDegree, setSearchDegree] = useState("");
    const [loading, setLoading] = useState(false);
    const [useMock, setUseMock] = useState(false);

    useEffect(() => {
        if (useMock) {
            setComplexClasses(COMPLEXCLASS_MOCK);
        } else {
            listComplexClasses()
                .then((data) => {
                    if (data.length > 0) {
                        setComplexClasses(data);
                    } else {
                        setComplexClasses(COMPLEXCLASS_MOCK);
                        setUseMock(true);
                    }
                })
                .catch(() => {
                    setComplexClasses(COMPLEXCLASS_MOCK);
                    setUseMock(true);
                });
        }
    }, [useMock]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const filtered = await listComplexClasses({ degree: searchDegree });

            if (filtered.length > 0) {
                setComplexClasses(filtered);
                setUseMock(false);
            } else {
                if (useMock) {
                    const filteredMock = COMPLEXCLASS_MOCK.filter(compclass =>
                       compclass.degree_text.toLowerCase().includes(searchDegree.toLowerCase())
                    );
                    setComplexClasses(filteredMock);
                } else {
                    setComplexClasses([]);
                }
            }
        } catch (error) {
            console.error('Error fetching complex classes, using mocks:', error);

            const filteredMock = COMPLEXCLASS_MOCK.filter(compclass =>
                compclass.degree_text.toLowerCase().includes(searchDegree.toLowerCase())
            );
            setComplexClasses(filteredMock);
            setUseMock(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="compclasses-page">
            <Header />

            <main>
                <div className="complexclass-wrapper">

                    <div className="complexclass-search">
                        <Search
                            query={searchDegree}
                            onQueryChange={setSearchDegree}
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
                                    {searchDegree
                                        ? `По запросу "${searchDegree}" не было найдено ни одного класса сложности`
                                        : 'классы сложности не найдены'
                                    }
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}