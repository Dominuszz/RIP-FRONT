import type React from 'react';
import './InputField.css'

interface SearchProps{
    query: string;
    onQueryChange: (query: string) => void;
    onSearch: () => void;
}

export default function Search({ query, onQueryChange, onSearch }: SearchProps){
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch();
    };

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <input
                type="text"
                className="search-input"
                placeholder="Поиск по степени...."
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
            />
            <button type = "submit" className= "search-btn">🔎</button>
        </form>
    )
}