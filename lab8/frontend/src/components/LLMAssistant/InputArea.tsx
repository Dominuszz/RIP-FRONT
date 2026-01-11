import type { FC } from 'react';
import { Button, Form } from "react-bootstrap";
import './LLMAssistant.css'
interface InputAreaProps {
  input: string;
  loading: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
}

const InputArea: FC<InputAreaProps> = ({ 
  input, 
  loading, 
  onInputChange, 
  onSend,
  placeholder = "Введите ваш вопрос о классах сложности..."
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading && input.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="assistant-input-area mt-3">
      <Form.Group>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder={placeholder}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          className="mb-2"
        />
        <Button 
          onClick={onSend} 
          disabled={loading || !input.trim()}
          variant="primary"
          className="w-100"
        >
          {loading ? 'Генерация...' : 'Отправить'}
        </Button>
      </Form.Group>
    </div>
  );
};

export default InputArea;