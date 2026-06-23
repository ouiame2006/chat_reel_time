import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Paperclip, 
  Terminal, 
  Cpu, 
  History 
} from 'lucide-react';

const AIAssistant = ({ user }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm Nexus-X, your personal AI assistant. How can I help you today?", sender: "Nexus-X", isAI: true },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const comingSoon = (feature) => {
    alert(`${feature} feature coming soon! 🚀`);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now(), text: inputValue, sender: user.name, isAI: false };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        text: "I've analyzed your query. As an AI simulation, I'm here to demonstrate the interface. In a production environment, I would connect to a neural processing unit to provide real-time insights.",
        sender: "Nexus-X",
        isAI: true,
        code: `// Example of AI processed data\nconst insight = {\n  status: "Optimized",\n  confidence: 0.98\n};`
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const loadHistory = (title) => {
    setMessages([
      { id: 1, text: `Loading archived session: ${title}...`, sender: "System", isAI: true },
      { id: 2, text: "Previous context has been restored. How should we proceed?", sender: "Nexus-X", isAI: true }
    ]);
  };

  return (
    <div className="animate-fade-in dashboard-layout" style={{ flex: 1, display: 'flex', gap: '20px' }}>
      <section className="chat-view-panel glass" style={{ flex: 1.5 }}>
        <header style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px var(--primary-glow)' }}>
               <Bot size={22} />
             </div>
             <div>
                <h3 style={{ fontSize: '1rem' }}>Nexus-X Neural AI</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: '700' }}>SYNCHRONIZED</p>
             </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
             <button className="btn-secondary" onClick={() => comingSoon('Premium Subscription')} style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Sparkles size={14} /> UPGRADE
             </button>
          </div>
        </header>

        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           {messages.map(msg => (
             <div key={msg.id} style={{ alignSelf: msg.isAI ? 'flex-start' : 'flex-end', display: 'flex', gap: '1rem', width: '100%', justifyContent: msg.isAI ? 'flex-start' : 'flex-end' }}>
                {msg.isAI && (
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--primary)' }}>
                    <Bot size={18} />
                  </div>
                )}
                <div style={{ flex: msg.isAI ? 1 : 'none', maxWidth: msg.isAI ? '100%' : '80%' }}>
                   {msg.isAI && <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{msg.sender}</p>}
                   <div className={msg.isAI ? 'glass' : 'message-me'} style={{ 
                     padding: '1rem 1.25rem', 
                     borderRadius: msg.isAI ? '1.25rem 1.25rem 1.25rem 0.25rem' : '1.25rem 1.25rem 0.25rem 1.25rem',
                     fontSize: '0.95rem', 
                     lineHeight: '1.6',
                     color: msg.isAI ? 'var(--text-main)' : 'white'
                   }}>
                      {msg.text}
                      {msg.code && (
                        <pre style={{ marginTop: '1.5rem', background: 'var(--bg-deep)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', overflowX: 'auto', fontSize: '0.85rem', color: 'var(--secondary)' }}>
                           <code>{msg.code}</code>
                        </pre>
                      )}
                   </div>
                </div>
             </div>
           ))}
           {isTyping && (
             <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '1rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <div className="loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.5rem' }}>Nexus-X is processing neural signals...</p>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        <footer style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border)' }}>
          <form onSubmit={handleSendMessage} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <button type="button" onClick={() => comingSoon('AI Data Analysis')} className="btn-secondary" style={{ padding: '0.6rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Paperclip size={20} />
             </button>
             <input 
               type="text" 
               placeholder="Ask anything to AI..." 
               style={{ flex: 1 }} 
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
             />
             <button type="submit" className="btn-primary" style={{ width: '44px', height: '44px', padding: 0, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={20} />
             </button>
          </form>
        </footer>
      </section>

      <aside className="chat-list-panel glass" style={{ flex: 0.6, padding: '1.5rem' }}>
         <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
           <History size={18} /> History
         </h3>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { title: 'Nexus Architecture Query', icon: <Cpu size={16} /> },
              { title: 'Neural Encryption Protocol', icon: <Terminal size={16} /> },
              { title: 'Digital Identity Simulation', icon: <Bot size={16} /> }
            ].map((item, i) => (
              <div key={i} className="nav-link" onClick={() => loadHistory(item.title)} style={{ fontSize: '0.85rem', padding: '0.75rem 1rem', background: 'var(--bg-input)', cursor: 'pointer' }}>
                 {item.icon} {item.title}
              </div>
            ))}
         </div>
      </aside>
    </div>
  );
};

export default AIAssistant;
