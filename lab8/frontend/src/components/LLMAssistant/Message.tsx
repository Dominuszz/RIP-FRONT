import type { FC } from 'react';
import type { ChatMessage } from '../../types/LLMTypes';
import { Container } from "react-bootstrap";

interface MessageProps {
  msg: ChatMessage;
}

const Message: FC<MessageProps> = ({ msg }) => (
  <Container className={`msg ${msg.role} mb-2 p-3 rounded`}>
    <strong className="d-block mb-1">
      {msg.role === 'user' ? 'Вы' : 'Ассистент'}: 
    </strong>
    <div className="msg-content">
      {msg.content}
    </div>
  </Container>
);

export default Message;