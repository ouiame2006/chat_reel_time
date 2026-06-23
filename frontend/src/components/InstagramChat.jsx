import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Plus, Phone, Video } from 'lucide-react';

const InstagramChat = ({ setView }) => {
  // Load user from localStorage
  const [user, setUser] = useState(null);
  
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('instagram_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      // Load mock conversations
      const mockConversations = [
        { id: 1, user: { id: 101, name: 'sarah_j', last_seen_at: Date.now() }, lastMessage: 'Hey! What are you up to?', time: '5m', unread: true, isTyping: false },
        { id: 2, user: { id: 102, name: 'mike_23', last_seen_at: Date.now() - 3600000 }, lastMessage: 'That sounds great! 👍', time: '1h', unread: false, isTyping: false },
        { id: 3, user: { id: 103, name: 'emma_k', last_seen_at: Date.now() - 7200000 }, lastMessage: 'Typing...', time: '2h', unread: true, isTyping: true },
        { id: 4, user: { id: 104, name: 'alex_m', last_seen_at: Date.now() - 86400000 }, lastMessage: 'See you tomorrow!', time: '1d', unread: false, isTyping: false },
      ];
      setConversations(mockConversations);
    } else {
      // If no user, redirect back to login
      setView('instagram-login');
    }
  }, [setView]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const loadMessages = (convo) => {
    const mockMsgs = [
      { id: 1, user_id: convo.user.id, message: 'Hey! How are you?', created_at: new Date(Date.now() - 3600000), is_read: true },
      { id: 2, user_id: user?.id, message: 'I\'m doing great, thanks! And you?', created_at: new Date(Date.now() - 3500000), is_read: true },
      { id: 3, user_id: convo.user.id, message: 'Pretty good too! 😊', created_at: new Date(Date.now() - 3400000), is_read: true },
    ];
    setMessages(mockMsgs);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      id: Date.now(),
      user_id: user?.id,
      message: newMessage.trim(),
      created_at: new Date(),
      is_read: false,
    };

    setMessages([...messages, message]);
    setNewMessage('');

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply = {
        id: Date.now() + 1,
        user_id: selectedConversation.user.id,
        message: 'Cool! 😄',
        created_at: new Date(),
        is_read: false,
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const filteredConversations = conversations.filter((c) =>
    c.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="instagram-chat-container">
      {/* Left Sidebar */}
      <div className="instagram-chat-sidebar">
        <div className="instagram-chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setView('instagram-main')} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <ArrowLeft size={24} strokeWidth={1.5} />
            </button>
            <span style={{ fontSize: '20px', fontWeight: 600 }}>{user?.name}</span>
            <span style={{ fontSize: '12px', color: '#737373' }}>▼</span>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <Plus size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div className="instagram-chat-search">
          <div className="instagram-chat-search-bar">
            <Search size={16} color="#737373" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                background: 'none',
                outline: 'none',
                fontSize: '14px',
                color: '#000000',
              }}
            />
          </div>
        </div>

        <div className="instagram-chat-conversations-header">
          <span className="instagram-chat-conversations-title">Messages</span>
          <span className="instagram-chat-requests">Requests</span>
        </div>

        <div className="instagram-chat-conversations">
          {filteredConversations.map((convo) => (
            <div
              key={convo.id}
              onClick={() => setSelectedConversation(convo)}
              className={`instagram-chat-conversation ${selectedConversation?.id === convo.id ? 'active' : ''}`}
            >
              <div className="instagram-chat-conversation-avatar">
                <div className="instagram-avatar instagram-avatar-md">
                  {convo.user.name[0].toUpperCase()}
                </div>
                {convo.user.last_seen_at && new Date(convo.user.last_seen_at) > new Date(Date.now() - 300000) && (
                  <div className="instagram-chat-online-indicator" />
                )}
              </div>
              <div className="instagram-chat-conversation-info">
                <div className="instagram-chat-conversation-row">
                  <span className={`instagram-chat-conversation-name ${convo.unread ? 'unread' : ''}`}>
                    {convo.user.name}
                  </span>
                  <span className="instagram-chat-conversation-time">{convo.time}</span>
                </div>
                <div className={`instagram-chat-conversation-preview ${convo.unread ? 'unread' : ''} ${convo.isTyping ? 'typing' : ''}`}>
                  {convo.isTyping ? (
                    <>
                      <span className="typing-dot">●</span>
                      <span className="typing-dot">●</span>
                      <span className="typing-dot">●</span>
                    </>
                  ) : (
                    convo.lastMessage
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Chat Area */}
      <div className="instagram-chat-area">
        {selectedConversation ? (
          <>
            <div className="instagram-chat-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="instagram-avatar instagram-avatar-md">
                  {selectedConversation.user.name[0].toUpperCase()}
                </div>
                <div className="instagram-chat-user-info">
                  <div className="instagram-chat-username">{selectedConversation.user.name}</div>
                  <div className="instagram-chat-status">
                    {selectedConversation.user.last_seen_at && new Date(selectedConversation.user.last_seen_at) > new Date(Date.now() - 300000)
                      ? 'Active now'
                      : `Active ${Math.floor((Date.now() - new Date(selectedConversation.user.last_seen_at)) / 60000)}m ago`}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <Phone size={24} strokeWidth={1.5} />
                </button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <Video size={24} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div className="instagram-chat-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`instagram-chat-message-row ${msg.user_id === user?.id ? 'sent' : ''}`}
                >
                  <div className={`instagram-chat-message-bubble ${msg.user_id === user?.id ? 'sent' : 'received'}`}>
                    <span style={{ fontSize: '14px' }}>{msg.message}</span>
                    <div style={{ fontSize: '11px', marginLeft: '4px', opacity: 0.7, display: 'flex', alignItems: 'flex-end' }}>
                      {formatTime(msg.created_at)}
                      {msg.user_id === user?.id && (
                        <span style={{ marginLeft: '4px' }}>✓{msg.is_read ? '✓' : ''}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="instagram-chat-message-row">
                  <div className="instagram-chat-message-bubble received" style={{ padding: '8px 12px', display: 'flex', gap: '4px' }}>
                    <span className="typing-dot">●</span>
                    <span className="typing-dot">●</span>
                    <span className="typing-dot">●</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="instagram-chat-input-container">
              <form onSubmit={handleSendMessage} className="instagram-chat-input-form">
                <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <span style={{ fontSize: '20px' }}>📷</span>
                </button>
                <input
                  type="text"
                  placeholder="Message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="instagram-chat-input"
                />
                <button type="submit" disabled={!newMessage.trim()} className="instagram-chat-send-btn">
                  {newMessage.trim() ? 'Send' : <span style={{ fontSize: '20px' }}>❤️</span>}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="instagram-chat-empty">
            <div className="instagram-chat-empty-icon">
              💬
            </div>
            <h2 className="instagram-chat-empty-title">Your messages</h2>
            <p className="instagram-chat-empty-text">Send private messages to your friends.</p>
            <button className="instagram-btn">Send message</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstagramChat;
