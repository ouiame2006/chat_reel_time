import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, 
  Users, 
  Image, 
  LogOut, 
  Search, 
  Trash2, 
  Ban, 
  Unlock,
  CheckCircle2,
  AlertCircle,
  Crown,
  X,
  ArrowRight
} from 'lucide-react';

// Mock data for demonstration
const MOCK_STATS = {
  totalUsers: 1247,
  activeSessions: 342,
  publishedStories: 892
};

const MOCK_USERS = [
  { id: 1, name: 'John Doe', username: '@johndoe', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', username: '@janesmith', email: 'jane@example.com', status: 'Active' },
  { id: 3, name: 'Bob Johnson', username: '@bobj', email: 'bob@example.com', status: 'Blocked' },
  { id: 4, name: 'Alice Brown', username: '@aliceb', email: 'alice@example.com', status: 'Active' },
  { id: 5, name: 'Charlie Davis', username: '@charlie', email: 'charlie@example.com', status: 'Active' },
];

const MOCK_STORIES = [
  { id: 1, user: 'John Doe', content: 'Beautiful sunset today! 🌅', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', postedAt: '2h ago' },
  { id: 2, user: 'Jane Smith', content: 'Coffee time ☕', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop', postedAt: '3h ago' },
  { id: 3, user: 'Bob Johnson', content: 'Just chilling!', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', postedAt: '5h ago' },
  { id: 4, user: 'Alice Brown', content: 'Happy weekend everyone! 🎉', image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&h=300&fit=crop', postedAt: '6h ago' },
];

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', top: '1.5rem', right: '1.5rem',
      background: type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--primary)',
      color: 'white', padding: '1rem 1.5rem', borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)', zIndex: 1000,
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      animation: 'slideIn 0.3s ease-out'
    }}>
      {type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
      <span style={{ fontWeight: 600 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
        <X size={18} />
      </button>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '20px',
      padding: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.25rem',
      transition: 'all 0.3s'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 12px 32px ${color}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <div style={{
        width: 60, height: 60, borderRadius: '16px',
        background: `${color}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: color
      }}>
        <Icon size={28} />
      </div>
      <div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ color: 'var(--text-bright)', fontSize: '2rem', fontWeight: 900, lineHeight: 1.2 }}>{value}</div>
      </div>
    </div>
  );
}

function OverviewTab({ onBackToApp }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <StatCard icon={Users} label="Total Users" value={MOCK_STATS.totalUsers.toLocaleString()} color="var(--primary)" />
        <StatCard icon={CheckCircle2} label="Active Sessions" value={MOCK_STATS.activeSessions.toLocaleString()} color="var(--secondary)" />
        <StatCard icon={Image} label="Published Stories" value={MOCK_STATS.publishedStories.toLocaleString()} color="var(--success)" />
      </div>
      
      <button
        onClick={onBackToApp}
        style={{
          padding: '1rem 1.75rem', borderRadius: '16px', border: '1px solid var(--border)',
          background: 'var(--bg-card)', color: 'var(--text-bright)',
          fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          width: 'fit-content'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--primary)';
          e.currentTarget.style.color = 'var(--primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.color = 'var(--text-bright)';
        }}
      >
        <ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} /> Go to User App
      </button>
    </div>
  );
}

function UsersTab({ addToast }) {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleBlock = (user) => {
    setUsers(prev => prev.map(u =>
      u.id === user.id ? { ...u, status: u.status === 'Blocked' ? 'Active' : 'Blocked' } : u
    ));
    addToast(`${user.status === 'Blocked' ? 'Unblocked' : 'Blocked'} ${user.name}`, 'success');
  };

  const handleDelete = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      setUsers(prev => prev.filter(u => u.id !== user.id));
      addToast(`Deleted ${user.name}`, 'success');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute', left: '1.25rem', top: '50%',
          transform: 'translateY(-50%)', color: 'var(--text-muted)'
        }}>
          <Search size={20} />
        </span>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search users by name, email, or username..."
          style={{
            width: '100%', padding: '1rem 1rem 1rem 3.5rem',
            borderRadius: '16px', border: '1px solid var(--border)',
            background: 'var(--bg-card)', color: 'var(--text-bright)',
            fontSize: '0.95rem', outline: 'none'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--primary)';
            e.target.style.boxShadow = '0 0 0 4px var(--primary-glow)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border)';
            e.target.style.boxShadow = '';
          }}
        />
      </div>

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{
                padding: '1.25rem 1.5rem', textAlign: 'left',
                color: 'var(--text-muted)', fontWeight: 800, fontSize: '0.8rem',
                textTransform: 'uppercase', letterSpacing: '0.08em'
              }}>User</th>
              <th style={{
                padding: '1.25rem 1.5rem', textAlign: 'left',
                color: 'var(--text-muted)', fontWeight: 800, fontSize: '0.8rem',
                textTransform: 'uppercase', letterSpacing: '0.08em'
              }}>Username</th>
              <th style={{
                padding: '1.25rem 1.5rem', textAlign: 'left',
                color: 'var(--text-muted)', fontWeight: 800, fontSize: '0.8rem',
                textTransform: 'uppercase', letterSpacing: '0.08em'
              }}>Email</th>
              <th style={{
                padding: '1.25rem 1.5rem', textAlign: 'left',
                color: 'var(--text-muted)', fontWeight: 800, fontSize: '0.8rem',
                textTransform: 'uppercase', letterSpacing: '0.08em'
              }}>Status</th>
              <th style={{
                padding: '1.25rem 1.5rem', textAlign: 'right',
                color: 'var(--text-muted)', fontWeight: 800, fontSize: '0.8rem',
                textTransform: 'uppercase', letterSpacing: '0.08em'
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: '14px',
                      background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 800, fontSize: '1.1rem'
                    }}>
                      {user.name.charAt(0)}
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--text-bright)', fontSize: '1rem' }}>
                      {user.name}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {user.username}
                </td>
                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {user.email}
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.4rem 0.9rem', borderRadius: '999px', fontSize: '0.8rem',
                    fontWeight: 700,
                    background: user.status === 'Active' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    color: user.status === 'Active' ? 'var(--success)' : 'var(--error)'
                  }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: user.status === 'Active' ? 'var(--success)' : 'var(--error)'
                    }} />
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleBlock(user)}
                      style={{
                        padding: '0.6rem 1rem', borderRadius: '10px',
                        border: '1px solid var(--border)',
                        background: 'var(--bg-input)',
                        color: user.status === 'Blocked' ? 'var(--success)' : 'var(--warning)',
                        fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '0.4rem'
                      }}
                    >
                      {user.status === 'Blocked' ? <Unlock size={16} /> : <Ban size={16} />}
                      {user.status === 'Blocked' ? 'Unblock' : 'Block'}
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      style={{
                        padding: '0.6rem 1rem', borderRadius: '10px',
                        border: 'none',
                        background: 'rgba(239,68,68,0.15)',
                        color: 'var(--error)',
                        fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '0.4rem'
                      }}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StoriesTab({ addToast }) {
  const [stories, setStories] = useState(MOCK_STORIES);

  const handleDelete = (story) => {
    if (window.confirm(`Are you sure you want to delete this story by ${story.user}?`)) {
      setStories(prev => prev.filter(s => s.id !== story.id));
      addToast(`Deleted story by ${story.user}`, 'success');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1.5rem'
      }}>
        {stories.map(story => (
          <div key={story.id} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            overflow: 'hidden',
            transition: 'transform 0.3s'
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = ''}
          >
            <img
              src={story.image} alt="Story"
              style={{ width: '100%', height: 200, objectFit: 'cover' }}
            />
            <div style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '12px',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 800, fontSize: '0.9rem'
                  }}>
                    {story.user.charAt(0)}
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--text-bright)', fontSize: '0.95rem' }}>
                    {story.user}
                  </div>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                  {story.postedAt}
                </div>
              </div>
              {story.content && (
                <p style={{
                  color: 'var(--text-main)',
                  marginBottom: '1rem',
                  fontSize: '0.9rem'
                }}>
                  {story.content}
                </p>
              )}
              <button
                onClick={() => handleDelete(story)}
                style={{
                  width: '100%', padding: '0.75rem', borderRadius: '12px',
                  border: 'none', background: 'rgba(239,68,68,0.15)',
                  color: 'var(--error)', fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Trash2 size={18} /> Delete Story
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard({ onBackToApp, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState(null);

  const addToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Manage Users', icon: Users },
    { id: 'stories', label: 'Moderate Stories', icon: Image },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-deep)' }}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: 280, flexShrink: 0,
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        padding: '2rem 1.5rem'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          marginBottom: '3rem', paddingLeft: '0.5rem'
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px var(--primary-glow)'
          }}>
            <Crown size={24} color="white" fill="white" />
          </div>
          <div>
            <div style={{
              fontSize: '1.3rem', fontWeight: 900,
              color: 'var(--text-bright)', lineHeight: 1
            }}>
              ChatReel
            </div>
            <div style={{
              fontSize: '0.75rem', fontWeight: 700,
              color: 'var(--primary)', textTransform: 'uppercase',
              letterSpacing: '0.08em', marginTop: '0.2rem'
            }}>
              Admin Panel
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '0.9rem 1.1rem', borderRadius: '14px',
                  background: isActive
                    ? 'linear-gradient(135deg, var(--primary), var(--secondary))'
                    : 'transparent',
                  color: isActive ? 'white' : 'var(--text-muted)',
                  border: 'none', fontWeight: 700, fontSize: '0.95rem',
                  cursor: 'pointer', transition: 'all 0.25s',
                  textAlign: 'left', boxShadow: isActive ? '0 8px 24px var(--primary-glow)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-input)';
                    e.currentTarget.style.color = 'var(--text-bright)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }
                }}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            padding: '0.9rem 1.1rem', borderRadius: '14px',
            background: 'transparent',
            color: 'var(--error)',
            border: '1px solid transparent', fontWeight: 700,
            fontSize: '0.95rem', cursor: 'pointer',
            transition: 'all 0.25s', textAlign: 'left'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1, overflowY: 'auto',
        padding: '2.5rem'
      }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontSize: '2.25rem', fontWeight: 900,
            color: 'var(--text-bright)', margin: 0,
            letterSpacing: '-0.03em'
          }}>
            {tabs.find(t => t.id === activeTab)?.label}
          </h1>
          <p style={{
            color: 'var(--text-muted)', fontSize: '1rem',
            marginTop: '0.5rem', fontWeight: 500
          }}>
            {activeTab === 'overview' && 'Monitor your platform performance and key metrics.'}
            {activeTab === 'users' && 'Manage user accounts, block or delete users as needed.'}
            {activeTab === 'stories' && 'Review and moderate user-submitted stories.'}
          </p>
        </div>

        {activeTab === 'overview' && <OverviewTab onBackToApp={onBackToApp} />}
        {activeTab === 'users' && <UsersTab addToast={addToast} />}
        {activeTab === 'stories' && <StoriesTab addToast={addToast} />}
      </main>
    </div>
  );
}
