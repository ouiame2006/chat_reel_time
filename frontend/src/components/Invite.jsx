import React from 'react';

const Invite = ({ setView }) => {
  const recentInvites = [
    { name: 'Sophia Miller', email: 'sophia@reel.app', status: 'Accepted' },
    { name: 'James Chen', email: 'james@reel.app', status: 'Pending' },
  ];

  return (
    <div className="invite-container animate-fade-in">
      <header className="about-header glass-card" style={{ height: '80px', padding: '0 4rem', margin: '0 0 4rem 0' }}>
        <div className="logo" onClick={() => setView('landing')} style={{ cursor: 'pointer' }}>ChatReel</div>
        <nav className="about-nav">
          <span onClick={() => setView('chat')} style={{ cursor: 'pointer', fontWeight: 600 }}>Chats</span>
          <span style={{ cursor: 'pointer', fontWeight: 600 }}>Status</span>
          <span className="active" style={{ color: '#ec4899', fontWeight: 800 }}>Invite</span>
        </nav>
        <div className="user-info">
          <div className="avatar">O</div>
        </div>
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
           <h1 className="hero-title" style={{ fontSize: '3.5rem' }}>Grow Your <span>Circle</span></h1>
           <p style={{ color: '#4b5563', marginTop: '1.5rem', fontSize: '1.1rem' }}>Invite friends to ChatReel and build your personal network together.</p>
        </div>

        <div className="link-generator-card glass-card" style={{ maxWidth: '700px', margin: '0 auto 5rem auto', textAlign: 'center', padding: '3rem' }}>
           <div style={{ width: '56px', height: '56px', background: '#fff1f2', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto', color: '#ec4899', fontSize: '1.5rem' }}>✨</div>
           <button className="btn-primary" style={{ marginBottom: '2rem', padding: '1rem 2.5rem' }}>Generate My Personal Link</button>
           <div className="invite-input-group glass-card" style={{ borderRadius: '1.5rem', padding: '0.75rem', background: 'rgba(255,255,255,0.4)', border: '1px solid var(--border-color)' }}>
              <input type="text" readOnly value="chatreel.app/invite/abc-123-xyz" className="invite-input" style={{ background: 'transparent', border: 'none' }} />
              <button style={{ background: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '1rem', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>📋</button>
           </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '5rem' }}>
           <div className="feature-card glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="stat-value" style={{ fontSize: '2.5rem' }}>12k</div>
              <div className="stat-label">Total Sent</div>
           </div>
           <div className="feature-card glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="stat-value" style={{ fontSize: '2.5rem' }}>4k</div>
              <div className="stat-label">Accepted</div>
           </div>
           <div className="feature-card glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="stat-value" style={{ fontSize: '2.5rem' }}>12</div>
              <div className="stat-label">Pending</div>
           </div>
        </div>

        <div className="feature-card glass-card" style={{ padding: '3rem', marginBottom: '6rem' }}>
           <h3 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '2.5rem' }}>Recent Invites</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {recentInvites.map((invite, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '2rem', borderBottom: i === 0 ? '1px solid var(--border-color)' : 'none' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div className="avatar" style={{ background: '#fbcfe8', width: '48px', height: '48px' }}>{invite.name[0]}</div>
                      <div>
                         <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{invite.name}</h4>
                         <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>{invite.email}</p>
                      </div>
                   </div>
                   <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: invite.status === 'Accepted' ? '#10b981' : '#ec4899', background: invite.status === 'Accepted' ? '#dcfce7' : '#fff1f2', padding: '0.5rem 1rem', borderRadius: '999px' }}>
                      {invite.status}
                   </span>
                </div>
              ))}
           </div>
        </div>
      </main>
    </div>
  );
};

export default Invite;
