import React, { useState, useEffect, useRef } from 'react';
import { echo } from '../echo';
import axios from 'axios';
import { Bot, Mail, MessageSquare, LogOut, Send } from 'lucide-react';

const Chat = ({ currentUser, selectedUser, setView, onLogout }) => {
  const [messages, setMessages] = useState([
    {
      user_id: 2, // AI Assistant
      message: "Hello, I'm Aura. Your creative companion. How can I help you today?",
      created_at: new Date().toISOString()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      // fetchMessages();
      
      const channel = echo.private(`chat.${currentUser.id}`)
        .listen('.message.sent', (e) => {
          if (e.user.id === selectedUser.id) {
            setMessages(prev => [...prev, e.message]);
          }
        })
        .listenForWhisper('typing', (e) => {
          if (e.id === selectedUser.id) {
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 3000);
          }
        });

      return () => {
        echo.leave(`chat.${currentUser.id}`);
      };
    }
  }, [selectedUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // mock sending message for now since backend might not be running
    const mockMsg = {
      user_id: currentUser.id,
      message: newMessage,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, mockMsg]);
    setNewMessage('');

    try {
      await axios.post('/api/messages', {
        receiver_id: selectedUser.id,
        message: newMessage
      });
    } catch (err) {
      console.error("Failed to send message to backend", err);
    }
  };

  const handleTyping = () => {
    echo.private(`chat.${selectedUser.id}`)
      .whisper('typing', { id: currentUser.id });
  };

  return (
    <div className="chat-layout animate-fade-in">
      {/* Sidebar */}
      <aside className="sidebar glass-card" style={{ border: 'none', borderRadius: '0 var(--radius-3xl) var(--radius-3xl) 0' }}>
        <div className="logo" onClick={() => setView('landing')} style={{ cursor: 'pointer', marginBottom: '3rem' }}>ChatReel</div>
        <nav style={{ flex: 1 }}>
          <div className="nav-item active">
            <Bot size={20} />
            <span>AI Assistant</span>
          </div>
          <div className="nav-item" onClick={() => setView('invite')} style={{ cursor: 'pointer' }}>
            <Mail size={20} />
            <span>Invite</span>
          </div>
          <div className="nav-item">
            <MessageSquare size={20} />
            <span>Chats</span>
          </div>
        </nav>
        <div className="nav-item" onClick={onLogout} style={{ marginTop: 'auto', color: '#ef4444' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="main-chat">
        <header className="chat-header">
          <div className="user-info">
            <div className="avatar">{selectedUser?.name[0]}</div>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 'bold' }}>{selectedUser?.name}</h2>
              <p className="user-status">Online</p>
            </div>
          </div>
        </header>

        <div className="messages-container">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.user_id === currentUser.id ? 'sent' : 'received'}`}>
              {msg.message}
            </div>
          ))}
          {isTyping && <div className="typing-indicator">Someone is typing...</div>}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <form onSubmit={handleSendMessage} className="input-wrapper">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
              placeholder="Ask AI Assistant anything..."
              className="chat-input"
            />
            <button type="submit" className="send-btn">
              <Send size={18} />
            </button>
          </form>
        </div>
      </main>

      {/* Right Sidebar - Insights */}
      <aside className="insights-panel">
        <h3 style={{ fontWeight: 'bold' }}>Chat Insights</h3>
        <div className="insight-card">
          <p className="insight-title">Tone Analysis</p>
          <div className="tone-bars">
            {[40, 70, 50, 90, 60, 45, 80].map((h, i) => (
              <div key={i} className="bar" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <p className="insight-title" style={{ marginBottom: '1rem' }}>Top Topics</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {['#productLaunch', '#feedback', '#uiDesign'].map(tag => (
              <span key={tag} style={{ padding: '0.25rem 0.75rem', backgroundColor: '#fdf2f8', borderRadius: '1rem', fontSize: '0.75rem', color: '#ec4899', fontWeight: 'bold' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Chat;
