import './InputField.css';
import { type FC } from 'react';
import { Button } from 'react-bootstrap';  // Добавь если нужно, иначе используй native button

interface Props {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
    loading?: boolean;
}

const InputField: FC<Props> = ({ value, onChange, onSearch, loading }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch();
    };

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <input
                type="text"
                className="search-input"
                placeholder="Поиск по степени..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <Button type="submit" className="search-btn" disabled={loading}>
                {loading ? 'Загрузка...' : '🔎'}
            </Button>
        </form>
    );
};

export default InputField;