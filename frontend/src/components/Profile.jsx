import React, { useState } from 'react';
import { Camera, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await updateProfile({ name, bio });
      setStatus({ type: 'success', message: 'Profile updated successfully!' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCameraClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        alert('Profile photo selected!');
      }
    };
    input.click();
  };

  return (
    <div className="main-content animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '600px', padding: '3rem', borderRadius: 'var(--radius-lg)' }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 1.5rem auto' }}>
             <div className="avatar" style={{ width: '100%', height: '100%', borderRadius: '30px', fontSize: '3rem', color: 'white', background: 'var(--primary)', boxShadow: '0 8px 25px var(--primary-glow)' }}>
               {user?.name?.[0]?.toUpperCase()}
             </div>
             <div 
               onClick={handleCameraClick}
               style={{ position: 'absolute', bottom: '-5px', right: '-5px', width: '36px', height: '36px', background: 'var(--bg-deep)', borderRadius: '12px', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--primary)' }}>
               <Camera size={18} />
             </div>
          </div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-bright)' }}>Profile Settings</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage your identity on ChatReel.</p>
        </header>

        {status.message && (
          <div style={{ 
            background: status.type === 'success' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(251, 113, 133, 0.1)', 
            color: status.type === 'success' ? 'var(--success)' : 'var(--error)',
            padding: '1rem', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '2rem', 
            fontSize: '0.9rem', 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />} {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Bio</label>
            <textarea 
              rows="4" 
              style={{ resize: 'none' }}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;