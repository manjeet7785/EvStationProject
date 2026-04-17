import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const messageText = input.trim();
    setLoading(true);
    setInput('');

    const newMessages = [...messages, { text: messageText, sender: 'user' }];
    setMessages(newMessages);

    try {
      const response = await axios.post('http://localhost:4000/api/chat/chat', {
        message: messageText,
        chatHistory: messages
      }, {
        timeout: 10000
      });

      if (response.data.success) {
        setMessages(prev => [...prev, {
          text: response.data.message,
          sender: 'bot'
        }]);
      } else {
        throw new Error(response.data.message || 'Unknown error');
      }

    } catch (error) {
      console.error('Chat error:', error.response?.data || error.message);

      let errorMsg = 'Sorry! Network error. ';
      if (error.code === 'ECONNABORTED') {
        errorMsg += 'Request timeout.';
      } else if (error.response?.status === 500) {
        errorMsg += 'Server error. Check backend.';
      } else if (error.response?.data?.message) {
        errorMsg += error.response.data.message;
      }

      setMessages(prev => [...prev, {
        text: errorMsg,
        sender: 'bot'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(true)}
        title="Open Manjeet AI Chatbot"
      >
        🤖
      </button>
    );
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-window">
        <div className="chatbot-header">
          <h2>🤖 Virtual Manjeet</h2>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <div className="chatbot-messages">
          <div className="welcome-message">
            👋 Hello! I'm <strong>Manjeet</strong>, your EV Charging expert!<br />
            Ask me: "What is CCS?", "How fast is Level 2?"
          </div>
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <div className="message-text">{msg.text}</div>
            </div>
          ))}
          {loading && (
            <div className="message bot">
              <div className="message-text typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Manjeet about EV charging..."
            disabled={loading}
            className="chatbot-input"
            maxLength={500}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="chatbot-send-btn"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;