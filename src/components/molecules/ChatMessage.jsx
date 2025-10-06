// src/components/moleculas/ChatMessage.jsx
import "./ChatMessage.css";

const ChatMessage = ({ message, sender, timestamp }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`chat-message-wrapper ${sender}`}>
      <div className="chat-message-content">
        <div className={`chat-message-bubble ${sender}`}>{message}</div>
        <div className={`chat-message-timestamp ${sender}`}>
          {formatTime(timestamp)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
