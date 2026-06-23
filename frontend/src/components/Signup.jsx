import React, { useState } from 'react';
import { MapPin, ArrowRight, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Signup({ setView }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.password_confirmation);
    } catch (err) {
      const errors = err.response?.data?.errors;
      const msg = errors ? Object.values(errors).flat()[0] : err.response?.data?.message || 'Registration failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fce4ec 0%, #fce4ec 40%, #f8bbd0 100%)', fontFamily: 'Inter' }}>
      <div style={{
        background: '#fff',
        borderRadius: '28px',
        padding: '2.75rem 2.5rem 2.5rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 24px 80px rgba(180, 0, 60, 0.12), 0 4px 16px rgba(0,0,0,0.06)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '20px',
          background: 'linear-gradient(145deg, #f06292, #c2185b)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.75rem',
          boxShadow: '0 12px 32px rgba(194, 24, 91, 0.35)'
        }}>
          <MapPin size={32} color="#fff" fill="rgba(255,255,255,0.3)" />
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: '800',
          color: '#1a1a2e',
          lineHeight: '1.2',
          margin: '0 0 0.6rem',
          letterSpacing: '-0.03em'
        }}>Join OuinoChat</h1>
        <p style={{ fontSize: '0.88rem', color: '#9e9e9e', margin: '0 0 2rem', lineHeight: '1.5' }}>Create your account to get started</p>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fff5f7',
            border: '1px solid rgba(194,24,91,0.2)',
            color: '#c2185b',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            fontWeight: '500',
            width: '100%',
            boxSizing: 'border-box',
            textAlign: 'left'
          }}>⚠ {error}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {/* Name */}
          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <label style={{
              display: 'block',
              fontSize: '0.78rem',
              fontWeight: '700',
              color: '#555',
              marginBottom: '0.4rem',
              letterSpacing: '0.02em'
            }}>Full Name</label>
            <div style={{
              position: 'relative',
              border: '1.5px solid #e8e8e8',
              borderRadius: '14px',
              background: '#fafafa',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}>
              <span style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#bbb',
                display: 'flex',
                transition: 'color 0.2s'
              }}><User size={17} /></span>
              <input 
                type="text"
                required
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.9rem 1rem 0.9rem 2.7rem',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.93rem',
                  fontFamily: 'inherit',
                  color: '#1a1a2e',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <label style={{
              display: 'block',
              fontSize: '0.78rem',
              fontWeight: '700',
              color: '#555',
              marginBottom: '0.4rem',
              letterSpacing: '0.02em'
            }}>Email</label>
            <div style={{
              position: 'relative',
              border: '1.5px solid #e8e8e8',
              borderRadius: '14px',
              background: '#fafafa',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}>
              <span style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#bbb',
                display: 'flex',
                transition: 'color 0.2s'
              }}><Mail size={17} /></span>
              <input 
                type="email"
                required
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.9rem 1rem 0.9rem 2.7rem',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.93rem',
                  fontFamily: 'inherit',
                  color: '#1a1a2e',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <label style={{
              display: 'block',
              fontSize: '0.78rem',
              fontWeight: '700',
              color: '#555',
              marginBottom: '0.4rem',
              letterSpacing: '0.02em'
            }}>Password</label>
            <div style={{
              position: 'relative',
              border: '1.5px solid #e8e8e8',
              borderRadius: '14px',
              background: '#fafafa',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}>
              <span style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#bbb',
                display: 'flex',
                transition: 'color 0.2s'
              }}><Lock size={17} /></span>
              <input 
                type={showPass ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.9rem 2.7rem 0.9rem 2.7rem',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.93rem',
                  fontFamily: 'inherit',
                  color: '#1a1a2e',
                  boxSizing: 'border-box'
                }}
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#bbb',
                  display: 'flex',
                  padding: '0',
                  transition: 'color 0.2s'
                }}
              >
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <label style={{
              display: 'block',
              fontSize: '0.78rem',
              fontWeight: '700',
              color: '#555',
              marginBottom: '0.4rem',
              letterSpacing: '0.02em'
            }}>Confirm Password</label>
            <div style={{
              position: 'relative',
              border: '1.5px solid #e8e8e8',
              borderRadius: '14px',
              background: '#fafafa',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}>
              <span style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#bbb',
                display: 'flex',
                transition: 'color 0.2s'
              }}><Lock size={17} /></span>
              <input 
                type={showConfirmPass ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={form.password_confirmation}
                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.9rem 2.7rem 0.9rem 2.7rem',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.93rem',
                  fontFamily: 'inherit',
                  color: '#1a1a2e',
                  boxSizing: 'border-box'
                }}
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#bbb',
                  display: 'flex',
                  padding: '0',
                  transition: 'color 0.2s'
                }}
              >
                {showConfirmPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #e91e63, #c2185b)',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              boxShadow: '0 8px 24px rgba(194,24,91,0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s, opacity 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 32px rgba(194,24,91,0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 24px rgba(194,24,91,0.3)';
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.35)',
                  borderTopColor: '#fff',
                  animation: 'spin 0.7s linear infinite'
                }}></span>
                Creating account...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                Create Account <ArrowRight size={18} />
              </span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.75rem 0 1.25rem', width: '100%' }}>
          <div style={{ flex: 1, height: '1px', background: '#f0e4e8' }}></div>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#c2185b', letterSpacing: '0.06em' }}>or continue with</span>
          <div style={{ flex: 1, height: '1px', background: '#f0e4e8' }}></div>
        </div>

        {/* Social Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
          <button style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            border: '1.5px solid #f0e4e8',
            background: '#fafafa',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}>
            <svg width="22" height="22" viewBox="0 0 21 21" fill="none">
              <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
              <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
              <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
              <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
            </svg>
          </button>
          <button style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            border: '1.5px solid #f0e4e8',
            background: '#fafafa',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </button>
        </div>

        {/* Login */}
        <p style={{ fontSize: '0.85rem', color: '#9e9e9e', marginTop: '1.5rem' }}>
          Already have an account?{' '}
          <button 
            onClick={() => setView('login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#c2185b',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '0.85rem',
              padding: '0',
              transition: 'color 0.2s'
            }}
          >Sign in</button>
        </p>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
}
