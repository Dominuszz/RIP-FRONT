import { useState, useCallback } from 'react';
import type { FC } from 'react';
import { Modal, Button, Badge } from "react-bootstrap";
import useWebLLM from '../../store/hooks';
import ChatWindow from './ChatWindow';
import InputArea from './InputArea';
import ModelLoader from './ModelLoader';
import type { ChatMessage } from '../../types/LLMTypes';
import type { ChatCompletionMessageParam } from '@mlc-ai/web-llm';

// Подключаем стили
import './LLMAssistant.css';

interface LLMAssistantProps {
  services: Array<{
    name: string;
    description: string;
    complexity: string;
  }>;
  show: boolean;
  onHide: () => void;
}

const LLMAssistant: FC<LLMAssistantProps> = ({ services, show, onHide }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'system', 
      content: `Ты ассистент для консультаций по классам сложности алгоритмов. 
      Доступные классы сложности: ${services.map(s => 
        `- ${s.name} (O(${s.complexity})): ${s.description}`
      ).join('\n')}
      
      Твоя задача: отвечать на вопросы пользователя о классах сложности, 
      помогать понять различия между ними, объяснять концепции.
      Отвечай кратко, понятно и по делу. Если не знаешь ответа - так и скажи.`
    }
  ]);
  const [input, setInput] = useState('');
  const [generating, setGenerating] = useState(false);

  const { 
    engine, 
    progress, 
    error, 
    isLoading: modelLoading,
    generateResponse
  } = useWebLLM();

  const handleSend = useCallback(async () => {
    if (!input.trim() || !engine || generating) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setGenerating(true);

    try {
      const chatRequest: ChatCompletionMessageParam[] = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await generateResponse(chatRequest, {
        temperature: 0.1,
        maxTokens: 500
      });

      setMessages([...newMessages, { role: 'assistant', content: response }]);
    } catch (err) {
      console.error('Ошибка генерации:', err);
      setMessages([
        ...newMessages,
        { 
          role: 'assistant', 
          content: 'Извините, произошла ошибка при генерации ответа. Пожалуйста, попробуйте еще раз.' 
        },
      ]);
    } finally {
      setGenerating(false);
    }
  }, [input, engine, messages, generateResponse, generating]);

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg" 
      centered
      dialogClassName="assistant-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="me-2">🤖</span> 
          Ассистент по классам сложности
          <Badge bg="success" className="ms-2 badge-webllm">
            WebLLM
          </Badge>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {modelLoading ? (
          <ModelLoader progress={progress} />
        ) : error ? (
          <div className="error text-center p-4">
            <p className="text-danger">{error}</p>
            <p>Попробуйте перезагрузить страницу</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="quick-questions d-flex flex-wrap gap-2">
                {[
                  "Что такое O(1)?",
                  "В чем разница между O(n) и O(log n)?",
                  "Какой класс самый быстрый?",
                  "Объясни экспоненциальную сложность"
                ].map((q, idx) => (
                  <Button 
                    key={idx}
                    variant="outline-success"
                    size="sm"
                    onClick={() => handleQuickQuestion(q)}
                    disabled={generating}
                    className="quick-btn"
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>

            <ChatWindow messages={messages} />
            
            <InputArea
              input={input}
              loading={generating}
              onInputChange={setInput}
              onSend={handleSend}
              placeholder="Задайте вопрос о классах сложности..."
            />
          </>
        )}
      </Modal.Body>
      
      <Modal.Footer>

        <Button variant="outline-secondary" onClick={onHide}>
          Закрыть
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LLMAssistant;