import React, { useState, useEffect, useRef } from 'react';

// --- Component Styles (Instagram-inspired) ---
const styles = {
  container: {
    minHeight: '100vh',
    background: '#FAFAFA',
    display: 'flex',
    alignItems: 'stretch',
    margin: 0,
    padding: 0,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },

  // --- Authentication ---
  authWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  authCard: {
    background: '#FFFFFF',
    border: '1px solid #DBDBDB',
    borderRadius: '8px',
    padding: '40px',
    width: '100%',
    maxWidth: '350px',
    textAlign: 'center',
  },
  authLogo: {
    fontSize: '42px',
    fontWeight: 400,
    color: '#000000',
    marginBottom: '40px',
    fontFamily: "'Segoe Script', 'Brush Script MT', cursive",
  },
  authInputWrapper: {
    display: 'flex',
    gap: '8px',
    width: '100%',
    marginBottom: '12px',
  },
  authInput: {
    width: '100%',
    background: '#FAFAFA',
    border: '1px solid #DBDBDB',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  authCountryInput: {
    width: '30%',
  },
  authOtpInputs: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    marginBottom: '12px',
  },
  authOtpInput: {
    width: '48px',
    height: '48px',
    textAlign: 'center',
    fontSize: '24px',
  },
  authBtn: {
    width: '100%',
    padding: '10px',
    background: '#0095F6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  authTextBtn: {
    background: 'transparent',
    border: 'none',
    color: '#0095F6',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '12px',
  },
  authError: {
    color: '#ED4956',
    fontSize: '14px',
    marginBottom: '16px',
  },
  authFooter: {
    marginTop: '40px',
    paddingTop: '24px',
    borderTop: '1px solid #DBDBDB',
    fontSize: '14px',
    color: '#737373',
  },

  // --- Chat Dashboard ---
  dashboardContainer: {
    width: '100%',
    display: 'flex',
    background: '#FFFFFF',
    border: '1px solid #DBDBDB',
    borderRadius: '8px',
    overflow: 'hidden',
    margin: '20px',
    height: 'calc(100vh - 40px)',
  },

  // Sidebar
  sidebar: {
    width: '350px',
    borderRight: '1px solid #DBDBDB',
    display: 'flex',
    flexDirection: 'column',
    background: '#FFFFFF',
    flexShrink: 0,
  },
  sidebarHeader: {
    padding: '0 20px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #DBDBDB',
  },
  sidebarHeaderText: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#000000',
  },
  sidebarSearch: {
    padding: '10px 20px',
  },
  sidebarSearchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#EFEFEF',
    borderRadius: '8px',
    padding: '8px 12px',
  },
  sidebarConversationsHeader: {
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #DBDBDB',
  },
  sidebarConversationsTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#000000',
    padding: '16px 0',
  },
  sidebarConversationsList: {
    flex: 1,
    overflowY: 'auto',
  },
  conversationItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 20px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  conversationItemActive: {
    background: '#FAFAFA',
  },
  avatarContainer: {
    position: 'relative',
    flexShrink: 0,
  },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: '#EFEFEF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 500,
    color: '#000000',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    width: '16px',
    height: '16px',
    background: '#4ADE80', // Green dot for online
    border: '3px solid #FFFFFF',
    borderRadius: '50%',
  },
  conversationInfo: {
    flex: 1,
    minWidth: 0,
  },
  conversationNameRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  conversationName: {
    fontSize: '14px',
    color: '#000000',
  },
  conversationNameUnread: {
    fontWeight: 600,
  },
  conversationTime: {
    fontSize: '12px',
    color: '#737373',
    flexShrink: 0,
  },
  conversationPreview: {
    fontSize: '14px',
    color: '#737373',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  conversationPreviewUnread: {
    color: '#000000',
    fontWeight: 600,
  },
  conversationPreviewTyping: {
    color: '#0095F6',
    fontStyle: 'italic',
  },
  unreadDot: {
    width: '8px',
    height: '8px',
    background: '#0095F6', // Blue dot for unread
    borderRadius: '50%',
    flexShrink: 0,
  },

  // Main Chat Area
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: '#FFFFFF',
  },
  chatHeader: {
    padding: '0 20px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #DBDBDB',
  },
  chatUserInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  chatUserName: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#000000',
  },
  chatUserStatus: {
    fontSize: '12px',
    color: '#737373',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  messageRow: {
    display: 'flex',
    width: '100%',
  },
  messageRowSent: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '60%',
    padding: '8px 12px',
    borderRadius: '22px',
    display: 'flex',
    alignItems: 'flex-end',
    gap: '4px',
    flexWrap: 'wrap',
  },
  messageBubbleSent: {
    background: '#0095F6',
    color: '#FFFFFF',
    borderBottomRightRadius: '4px',
  },
  messageBubbleReceived: {
    background: '#EFEFEF',
    color: '#000000',
    borderBottomLeftRadius: '4px',
  },
  messageText: {
    fontSize: '14px',
  },
  messageMeta: {
    fontSize: '11px',
    marginLeft: '4px',
    opacity: 0.7,
  },
  typingBubble: {
    background: '#EFEFEF',
    padding: '8px 12px',
    borderRadius: '22px',
    display: 'flex',
    gap: '4px',
    color: '#737373',
    fontSize: '20px',
  },
  chatInputContainer: {
    padding: '12px 20px',
    borderTop: '1px solid #DBDBDB',
  },
  chatInputForm: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#EFEFEF',
    borderRadius: '22px',
    padding: '8px 16px',
  },
  chatInput: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: '14px',
    color: '#000000',
  },
  chatSendBtn: {
    background: 'transparent',
    border: 'none',
    color: '#0095F6',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    padding: 0,
  },
  chatEmpty: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '40px',
  },
  chatEmptyIcon: {
    width: '96px',
    height: '96px',
    border: '4px solid #000000',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
    fontSize: '48px',
  },
  chatEmptyTitle: {
    fontSize: '22px',
    fontWeight: 400,
    color: '#000000',
    marginBottom: '8px',
  },
  chatEmptyText: {
    fontSize: '14px',
    color: '#737373',
    marginBottom: '24px',
  },
};

// --- Mock Data (for fallback) ---
const countryCodes = [
  { code: '+212', country: 'Morocco', flag: '🇲🇦' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
];

const API_BASE = 'http://localhost:8000/api';

// --- Main Component ---
const InstagramChatComplete = () => {
  const [currentView, setCurrentView] = useState('auth');
  const [authStep, setAuthStep] = useState(1);
  const [countryCode, setCountryCode] = useState('+212');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('instagram_user');
    const storedToken = localStorage.getItem('instagram_token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setCurrentView('chat');
      loadUsers(storedToken);
    }
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // --- API Helpers ---
  const apiRequest = async (endpoint, method = 'GET', data = null, authToken = token) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    if (authToken) {
      options.headers['Authorization'] = `Bearer ${authToken}`;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong');
    }

    return result;
  };

  // --- Authentication Methods ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone.trim()) { 
      setError('Veuillez entrer votre numéro de téléphone'); 
      return; 
    }

    setLoading(true);
    setError('');

    try {
      const fullPhone = countryCode + phone;
      await apiRequest('/send-otp', 'POST', {
        phone: fullPhone,
        country_code: countryCode,
      });

      setLoading(false);
      setAuthStep(2);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Error sending OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) { 
      setError('Veuillez entrer le code complet'); 
      return; 
    }

    setLoading(true);
    setError('');

    try {
      const fullPhone = countryCode + phone;
      const result = await apiRequest('/verify-otp', 'POST', {
        phone: fullPhone,
        otp_code: otpCode,
      });

      localStorage.setItem('instagram_user', JSON.stringify(result.user));
      localStorage.setItem('instagram_token', result.access_token);
      
      setUser(result.user);
      setToken(result.access_token);
      setLoading(false);
      setCurrentView('chat');
      loadUsers(result.access_token);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Invalid OTP');
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest('/logout', 'POST', null, token);
    } catch (err) {
      console.log('Logout error:', err);
    }
    
    localStorage.removeItem('instagram_user');
    localStorage.removeItem('instagram_token');
    setUser(null);
    setToken(null);
    setCurrentView('auth');
    setAuthStep(1);
    setPhone('');
    setOtp(['', '', '', '', '', '']);
  };

  // --- Chat Methods ---
  const loadUsers = async (authToken = token) => {
    try {
      const result = await apiRequest('/users', 'GET', null, authToken);
      setUsers(result || []);
    } catch (err) {
      console.log('Load users error:', err);
      // Fallback mock users
      setUsers([
        { id: 101, name: 'Youssef', last_seen_at: new Date().toISOString() },
        { id: 102, name: 'Amina', last_seen_at: new Date(Date.now() - 3600000).toISOString() },
        { id: 103, name: 'Karim', last_seen_at: new Date(Date.now() - 3600000 * 24).toISOString() },
      ]);
    }
  };

  const handleSelectUser = async (selectedUsr) => {
    setSelectedUser(selectedUsr);
    setIsTyping(false);
    await loadMessages(selectedUsr.id);
  };

  const loadMessages = async (userId) => {
    try {
      const result = await apiRequest(`/messages/${userId}`, 'GET', null, token);
      setMessages(result || []);
    } catch (err) {
      console.log('Load messages error:', err);
      setMessages([
        { id: 1, user_id: userId, message: 'Salut ! Tu viens au café ?', created_at: new Date(Date.now() - 3600000).toISOString(), is_read: true },
        { id: 2, user_id: user.id, message: 'Oui, dans 30min !', created_at: new Date(Date.now() - 3500000).toISOString(), is_read: true },
        { id: 3, user_id: userId, message: 'Parfait, j\'attends 👍', created_at: new Date(Date.now() - 3400000).toISOString(), is_read: true },
      ]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const result = await apiRequest('/messages', 'POST', {
        receiver_id: selectedUser.id,
        message: newMessage.trim(),
      }, token);

      if (result) {
        setMessages(prev => [...prev, result]);
        setNewMessage('');
      }

      // Simulate typing and reply
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    } catch (err) {
      console.log('Send message error:', err);
      // Fallback
      const tempMsg = {
        id: Date.now(),
        user_id: user.id,
        message: newMessage.trim(),
        created_at: new Date().toISOString(),
        is_read: false,
      };
      setMessages(prev => [...prev, tempMsg]);
      setNewMessage('');
    }
  };

  // Format time
  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const isUserOnline = (lastSeenAt) => {
    if (!lastSeenAt) return false;
    return new Date(lastSeenAt) > new Date(Date.now() - 300000);
  };

  // Filter users
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Render ---
  return (
    <div style={styles.container}>
      
      {/* Authentication View */}
      {currentView === 'auth' && (
        <div style={styles.authWrapper}>
          <div style={styles.authCard}>
            <div style={styles.authLogo}>ChatReel</div>

            {error && <div style={styles.authError}>{error}</div>}

            {authStep === 1 ? (
              <form onSubmit={handleSendOtp}>
                <div style={styles.authInputWrapper}>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    style={{ ...styles.authInput, ...styles.authCountryInput }}
                  >
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="Numéro de téléphone"
                    style={styles.authInput}
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ ...styles.authBtn, opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? 'Envoi...' : 'Envoyer le code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <p style={{ color: '#737373', fontSize: '14px', marginBottom: '16px' }}>
                  Nous avons envoyé un code à {countryCode} {phone}
                </p>
                <p style={{ color: '#737373', fontSize: '12px', marginBottom: '16px', fontStyle: 'italic' }}>
                  (Pour le test, utilisez le code : 123456)
                </p>

                <div style={styles.authOtpInputs}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !digit && index > 0) {
                          document.getElementById(`otp-${index - 1}`)?.focus();
                        }
                      }}
                      style={{ ...styles.authInput, ...styles.authOtpInput }}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ ...styles.authBtn, opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? 'Vérification...' : 'Vérifier et se connecter'}
                </button>

                <button type="button" onClick={() => setAuthStep(1)} style={styles.authTextBtn}>
                  Modifier le numéro
                </button>
              </form>
            )}

            <div style={styles.authFooter}>
              Vous n'avez pas de compte ?{' '}
              <span style={{ color: '#0095F6', fontWeight: 600, cursor: 'pointer' }}>S'inscrire</span>
            </div>
          </div>
        </div>
      )}

      {/* Chat Dashboard View */}
      {currentView === 'chat' && user && (
        <div style={styles.dashboardContainer}>
          
          {/* Left Sidebar (350px) */}
          <div style={styles.sidebar}>
            <div style={styles.sidebarHeader}>
              <span style={styles.sidebarHeaderText}>{user.name}</span>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ fontSize: '24px', cursor: 'pointer' }} onClick={handleLogout}>🚪</span>
              </div>
            </div>

            <div style={styles.sidebarSearch}>
              <div style={styles.sidebarSearchBar}>
                <span style={{ color: '#737373', fontSize: '16px' }}>🔍</span>
                <input
                  type="text"
                  placeholder="Rechercher"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '14px' }}
                />
              </div>
            </div>

            <div style={styles.sidebarConversationsHeader}>
              <span style={styles.sidebarConversationsTitle}>Messages</span>
            </div>

            <div style={styles.sidebarConversationsList}>
              {filteredUsers.map((usr) => (
                <div
                  key={usr.id}
                  onClick={() => handleSelectUser(usr)}
                  style={{
                    ...styles.conversationItem,
                    ...(selectedUser?.id === usr.id ? styles.conversationItemActive : {}),
                  }}
                >
                  <div style={styles.avatarContainer}>
                    <div style={styles.avatar}>{usr.name[0]?.toUpperCase()}</div>
                    {isUserOnline(usr.last_seen_at) && <div style={styles.onlineIndicator} />}
                  </div>

                  <div style={styles.conversationInfo}>
                    <div style={styles.conversationNameRow}>
                      <span style={{
                        ...styles.conversationName,
                      }}>
                        {usr.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Chat Workspace */}
          <div style={styles.chatArea}>
            
            {selectedUser ? (
              <>
                <div style={styles.chatHeader}>
                  <div style={styles.chatUserInfo}>
                    <div style={{ ...styles.avatar, width: '40px', height: '40px', fontSize: '16px' }}>
                      {selectedUser.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div style={styles.chatUserName}>{selectedUser.name}</div>
                      <div style={styles.chatUserStatus}>
                        {isUserOnline(selectedUser.last_seen_at) ? 'En ligne' : 'Actif il y a 5 min'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '20px', fontSize: '24px', cursor: 'pointer' }}>
                    <span>📞</span>
                    <span>🎥</span>
                    <span>⋮</span>
                  </div>
                </div>

                <div style={styles.messagesContainer}>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        ...styles.messageRow,
                        ...(msg.user_id === user.id ? styles.messageRowSent : {}),
                      }}
                    >
                      <div style={{
                        ...styles.messageBubble,
                        ...(msg.user_id === user.id ? styles.messageBubbleSent : styles.messageBubbleReceived),
                      }}>
                        <span style={styles.messageText}>{msg.message}</span>
                        <div style={styles.messageMeta}>
                          {formatTime(msg.created_at)}
                          {msg.user_id === user.id && <span style={{ marginLeft: '4px' }}>Vu</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div style={styles.messageRow}>
                      <div style={styles.typingBubble}>
                        <span style={{ animation: 'typing 1.4s infinite' }}>●</span>
                        <span style={{ animation: 'typing 1.4s infinite', animationDelay: '0.2s' }}>●</span>
                        <span style={{ animation: 'typing 1.4s infinite', animationDelay: '0.4s' }}>●</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <div style={styles.chatInputContainer}>
                  <form onSubmit={handleSendMessage} style={styles.chatInputForm}>
                    <span style={{ fontSize: '20px', cursor: 'pointer' }}>📷</span>
                    <input
                      type="text"
                      placeholder="Envoyer un message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      style={styles.chatInput}
                    />
                    <button type="submit" disabled={!newMessage.trim()} style={styles.chatSendBtn}>
                      {newMessage.trim() ? 'Envoyer' : '❤️'}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div style={styles.chatEmpty}>
                <div style={styles.chatEmptyIcon}>💬</div>
                <h2 style={styles.chatEmptyTitle}>Tes messages</h2>
                <p style={styles.chatEmptyText}>Envoyez des messages privés à vos amis.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add animation styles */}
      <style>{`
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
};

export default InstagramChatComplete;
