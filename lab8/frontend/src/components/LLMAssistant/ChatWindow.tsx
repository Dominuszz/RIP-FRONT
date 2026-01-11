import type { FC } from 'react';
import type { ChatMessage } from '../../types/LLMTypes';
import Message from './Message';
import './LLMAssistant.css';
interface ChatWindowProps {
  messages: ChatMessage[];
}

const ChatWindow: FC<{ messages: ChatMessage[] }> = ({ messages }) => {
  const hasMessages = messages.filter(msg => msg.role !== 'system').length > 0;

  return (
    <div className="chat-window">
      {!hasMessages ? (
        <div className="empty-state">
          <p>Задайте вопрос о классах сложности</p>
          <small>Например: «В чем разница между O(n) и O(log n)?»</small>
        </div>
      ) : (
        messages
          .filter(msg => msg.role !== 'system')
          .map((msg, idx) => (
            <Message key={idx} msg={msg} />
          ))
      )}
    </div>
  );
};

export default ChatWindow;