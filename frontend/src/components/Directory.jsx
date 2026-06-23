import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  MoreHorizontal, 
  MapPin, 
  Sparkles,
  Plus
} from 'lucide-react';
import axios from 'axios';

const Directory = ({ user, startChat }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const comingSoon = (feature) => {
    alert(`${feature} feature coming soon! 🚀`);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    if (activeTab === 'Online') return true; // Simulated
    return true;
  });

  return (
    <div className="animate-fade-in glass" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <header style={{ padding: '2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
        <div>
           <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Directory</h1>
           <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Find and connect with other users in the community.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-input)', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
           {['All', 'Recent', 'Online'].map((tab) => (
             <button key={tab} 
               onClick={() => setActiveTab(tab)}
               style={{ 
                 padding: '0.5rem 1.25rem', 
                 borderRadius: '8px', 
                 border: 'none', 
                 background: activeTab === tab ? 'var(--primary)' : 'transparent',
                 boxShadow: activeTab === tab ? '0 4px 12px var(--primary-glow)' : 'none',
                 fontWeight: '600',
                 fontSize: '0.85rem',
                 color: activeTab === tab ? 'white' : 'var(--text-muted)',
                 cursor: 'pointer',
                 transition: 'var(--transition)'
               }}>{tab}</button>
           ))}
        </div>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '2.5rem' }}>
        {loading ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="user-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {filteredUsers.map((u) => (
              <div key={u.id} className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--border)' }}>
                 <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 1.25rem' }}>
                    <div className="avatar" style={{ width: '100%', height: '100%', fontSize: '2rem', borderRadius: '22px' }}>
                       {u.name[0].toUpperCase()}
                    </div>
                    <div className="status-indicator status-online" style={{ width: '16px', height: '16px', border: '3px solid var(--bg-card)' }}></div>
                 </div>
                 <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>{u.name}</h3>
                 <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', height: '1.2rem', overflow: 'hidden' }}>{u.bio || 'Available'}</p>
                 
                 <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button 
                      className="btn-primary" 
                      style={{ flex: 1, padding: '0.65rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      onClick={() => startChat(u)}
                    >
                      <UserPlus size={16} /> Message
                    </button>
                    <button className="btn-secondary" onClick={() => comingSoon('User Profile Actions')} style={{ width: '40px', height: '40px', padding: 0, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MoreHorizontal size={18} />
                    </button>
                 </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginTop: '3rem' }}>
           <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'linear-gradient(135deg, var(--primary-glow), transparent)' }}>
              <div style={{ width: '64px', height: '64px', background: 'var(--primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Sparkles size={32} />
              </div>
              <div style={{ flex: 1 }}>
                 <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>Smart Suggestions</p>
                 <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>We found 4 people you might want to connect with.</h4>
                 <button className="btn-primary" onClick={() => comingSoon('Smart Matches')} style={{ width: 'auto', padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>View Matches</button>
              </div>
           </div>
           <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'linear-gradient(135deg, var(--secondary-glow), transparent)' }}>
              <div style={{ flex: 1 }}>
                 <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--secondary)', textTransform: 'uppercase', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>Nearby</p>
                 <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>There are 14 active users near your current location.</h4>
                 <button className="btn-secondary" onClick={() => comingSoon('User Location Map')} style={{ width: 'auto', padding: '0.5rem 1.25rem', fontSize: '0.8rem', borderColor: 'var(--secondary)', color: 'var(--secondary)' }}>Show Map</button>
              </div>
              <div style={{ width: '64px', height: '64px', background: 'var(--secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 8px 20px var(--secondary-glow)' }}>
                <MapPin size={32} />
              </div>
           </div>
        </div>
      </div>
      
      <button style={{ position: 'fixed', bottom: '3rem', right: '3rem', width: '60px', height: '60px', borderRadius: '20px', background: 'var(--primary)', color: 'white', border: 'none', boxShadow: '0 10px 30px var(--primary-glow)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Plus size={32} strokeWidth={3} />
      </button>
    </div>
  );
};

export default Directory;
