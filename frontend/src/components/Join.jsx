import React from 'react';

const Join = ({ setView }) => {
  return (
    <div className="join-container">
      <div className="join-card glass-card animate-fade-in">
        <div className="join-info">
          <span className="section-label">Invitation Only</span>
          <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Better conversations start <span>here.</span></h1>
          <p className="hero-description" style={{ fontSize: '1.1rem', color: '#4b5563', lineHeight: '1.6' }}>
            Join a community that values privacy, speed, and elegance. ChatReel brings the next generation of face-to-face interaction to your digital workspace.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginTop: '3rem' }}>
            <div className="stat-item">
              <div className="stat-value" style={{ fontSize: '2rem' }}>12k+</div>
              <div className="stat-label">Members</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" style={{ fontSize: '2rem' }}>4k+</div>
              <div className="stat-label">Daily Active</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" style={{ fontSize: '2rem' }}>E2EE</div>
              <div className="stat-label">Security</div>
            </div>
          </div>

          <button onClick={() => setView('login')} className="btn-primary" style={{ width: '100%', marginTop: '4rem', padding: '1.25rem' }}>
            Accept Invitation & Join
          </button>
        </div>

        <div className="join-visual">
          <div className="founder-card glass-card" style={{ padding: '3rem' }}>
            <div className="founder-avatar" style={{ backgroundColor: '#fbcfe8', width: '100px', height: '100px' }}></div>
            <h4 style={{ fontWeight: 800, fontSize: '1.25rem' }}>Ouiame Moussaoui</h4>
            <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.5rem' }}>Invited you to ChatReel</p>
            <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.5)', borderRadius: '1.5rem', fontSize: '0.95rem', fontStyle: 'italic', color: '#374151', lineHeight: '1.6' }}>
              "Hey! I've been using ChatReel for my team and it's been a game changer. Join us and let's start chatting!"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Join;
