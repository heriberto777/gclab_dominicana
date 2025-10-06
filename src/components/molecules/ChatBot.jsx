// src/components/molecules/ChatBot.jsx
import { useState, useRef, useEffect } from "react";
import { apiClient } from "../../lib/api"; // ← Importar apiClient
import "./ChatBot.css";

const ChatBot = ({ webhookUrl = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [conversationState, setConversationState] = useState("greeting");
  const [clientInfo, setClientInfo] = useState({
    nombre: "",
    email: "",
    telefono: "",
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
    }
  }, [isOpen]);

  // 🆕 Función para inicializar el chat
  const initializeChat = async () => {
    // 1️⃣ Generar sessionId único
    const newSessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setSessionId(newSessionId);

    console.log("🔑 SessionId generado:", newSessionId);

    // 2️⃣ Crear conversación usando apiClient
    try {
      const { data, error } = await apiClient.createChatbotConversation(
        newSessionId
      );

      if (data) {
        console.log("✅ Conversación creada en DB:", data);
      } else {
        console.error("❌ Error al crear conversación:", error);
      }
    } catch (error) {
      console.error("❌ Error al crear conversación:", error);
    }

    // 3️⃣ Mostrar mensaje de bienvenida
    setTimeout(async () => {
      const welcomeMessage = {
        id: Date.now(),
        text: "¡Hola! Soy el asistente virtual de GC Lab. Puedo ayudarte con información sobre nuestros productos, servicios técnicos y mercados. ¿En qué puedo asistirte hoy?",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages([welcomeMessage]);

      // 4️⃣ Guardar mensaje de bienvenida usando apiClient
      await saveMessage(newSessionId, "bot", welcomeMessage.text);
    }, 500);
  };

  // 🆕 Función para guardar mensajes usando apiClient
  const saveMessage = async (session, sender, message, metadata = {}) => {
    try {
      const { data, error } = await apiClient.saveChatbotMessage(
        session,
        sender,
        message,
        metadata
      );

      if (data) {
        console.log(`✅ Mensaje (${sender}) guardado:`, data);
      } else {
        console.error("❌ Error al guardar mensaje:", error);
      }
    } catch (error) {
      console.error("❌ Error al guardar mensaje:", error);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessageToWebhook = async (message) => {
    if (!webhookUrl) {
      return {
        response:
          "Lo siento, el chatbot no está configurado. Por favor, contacta al administrador.",
      };
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          message: message,
          conversationState,
          clientInfo,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta del webhook");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error sending message to webhook:", error);
      return {
        response:
          "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.",
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    // 1️⃣ Mostrar mensaje del usuario
    setMessages((prev) => [...prev, userMessage]);

    // 2️⃣ Guardar mensaje del usuario
    await saveMessage(sessionId, "user", inputValue);

    setInputValue("");
    setIsTyping(true);

    // 3️⃣ Enviar a n8n
    const webhookResponse = await sendMessageToWebhook(inputValue);

    // 4️⃣ Mostrar respuesta del bot
    setTimeout(async () => {
      const botMessage = {
        id: Date.now() + 1,
        text:
          webhookResponse.response ||
          "Gracias por tu mensaje. Un agente se pondrá en contacto contigo pronto.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);

      // 5️⃣ Guardar respuesta del bot
      await saveMessage(sessionId, "bot", botMessage.text);

      // 6️⃣ Actualizar estado si cambió
      if (webhookResponse.conversationState) {
        setConversationState(webhookResponse.conversationState);
      }

      // 7️⃣ Guardar datos del cliente si están completos
      if (webhookResponse.clientInfoComplete && webhookResponse.clientInfo) {
        setClientInfo(webhookResponse.clientInfo);
      }
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="chatbot-container">
      <button
        className={`chatbot-button ${isOpen ? "open" : ""}`}
        onClick={toggleChat}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-avatar">🤖</div>
            <div className="chatbot-header-info">
              <h3>Asistente GC Lab</h3>
              <p>En línea</p>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chatbot-message ${message.sender}`}
              >
                <div className="message-bubble">
                  <p className="message-text">{message.text}</p>
                  <div className="message-time">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chatbot-message bot">
                <div className="typing-indicator">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              className="chatbot-input"
              placeholder="Escribe un mensaje..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping}
            />
            <button
              className="chatbot-send-button"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              aria-label="Enviar mensaje"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
