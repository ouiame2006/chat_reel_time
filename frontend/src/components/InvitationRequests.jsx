import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  User,
  Check,
  X,
  Mail,
  Calendar,
  Clock
} from 'lucide-react';

// Avatar component (reusable)
function Avatar({ name, size = 40, online }) {
  const COLORS = [
    'linear-gradient(135deg, #db2777, #ec4899)',
    'linear-gradient(135deg, #7c3aed, #a78bfa)',
    'linear-gradient(135deg, #0ea5e9, #38bdf8)',
    'linear-gradient(135deg, #10b981, #34d399)',
    'linear-gradient(135deg, #f59e0b, #fbbf24)',
    'linear-gradient(135deg, #8b5cf6, #a78bfa)'
  ];
  const color = COLORS[(name?.charCodeAt(0) || 0) % COLORS.length];
  
  return (
    <div style={{ position: 'relative', display: 'inline-block', flexShrink: 0 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 800,
          fontSize: Math.max(12, size * 0.38),
          userSelect: 'none',
        }}
      >
        {(name || '?')[0]?.toUpperCase()}
      </div>
      {online !== undefined && (
        <span
          style={{
            position: 'absolute',
            bottom: size * 0.05,
            right: size * 0.05,
            width: Math.round(size * 0.28),
            height: Math.round(size * 0.28),
            borderRadius: '50%',
            border: '2px solid white',
            background: online ? '#22c55e' : '#9ca3af'
          }}
        />
      )}
    </div>
  );
}

// User Details Modal component
function UserDetailsModal({ user, onClose }) {
  if (!user) return null;

  const joinedDate = user.created_at 
    ? new Date(user.created_at).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) 
    : null;

  const isOnline = user.last_seen_at 
    ? new Date(user.last_seen_at).getTime() > Date.now() - 5 * 60 * 1000 
    : false;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '1.5rem',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          animation: 'modalIn 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #ec4899, #f472b6)',
          padding: '2rem 1.5rem 1rem',
          textAlign: 'center',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
          
          <Avatar name={user.name} size={80} online={isOnline} />
          
          <h2 style={{
            marginTop: '1rem',
            marginBottom: '0.25rem',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 800
          }}>
            {user.name}
          </h2>
          
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: 600
          }}>
            <span style={{
              width: '0.5rem',
              height: '0.5rem',
              borderRadius: '50%',
              backgroundColor: isOnline ? '#22c55e' : '#9ca3af'
            }} />
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        
        {/* Body */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Email */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              borderRadius: '0.75rem',
              backgroundColor: '#fff5f7'
            }}>
              <Mail size={20} color="#db2777" />
              <div>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#9ca3af',
                  fontWeight: 500,
                  marginBottom: '0.125rem'
                }}>
                  Email
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#374151',
                  fontWeight: 600,
                  wordBreak: 'break-all'
                }}>
                  {user.email}
                </p>
              </div>
            </div>
            
            {/* Bio if exists */}
            {user.bio && (
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: '0.75rem',
                backgroundColor: '#fff5f7'
              }}>
                <User size={20} color="#db2777" />
                <div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    fontWeight: 500,
                    marginBottom: '0.125rem'
                  }}>
                    Bio
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#374151',
                    fontWeight: 500,
                    lineHeight: 1.5
                  }}>
                    {user.bio}
                  </p>
                </div>
              </div>
            )}
            
            {/* Joined date */}
            {joinedDate && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: '0.75rem',
                backgroundColor: '#fff5f7'
              }}>
                <Calendar size={20} color="#db2777" />
                <div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    fontWeight: 500,
                    marginBottom: '0.125rem'
                  }}>
                    Joined
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#374151',
                    fontWeight: 600
                  }}>
                    {joinedDate}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// Main InvitationRequests component
export default function InvitationRequests() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [processingIds, setProcessingIds] = useState(new Set());

  // Fetch pending invitations
  const fetchInvitations = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/invitations/received');
      setInvitations(data);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  // Accept an invitation
  const handleAccept = async (invitation) => {
    if (processingIds.has(invitation.id)) return;
    
    try {
      setProcessingIds(prev => new Set([...prev, invitation.id]));
      
      // Optimistic update
      setInvitations(prev => prev.filter(i => i.id !== invitation.id));
      
      await axios.post(`/api/invitations/${invitation.id}/accept`);
    } catch (error) {
      console.error('Error accepting invitation:', error);
      // Revert if error
      fetchInvitations();
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(invitation.id);
        return next;
      });
    }
  };

  // Reject an invitation
  const handleReject = async (invitation) => {
    if (processingIds.has(invitation.id)) return;
    
    try {
      setProcessingIds(prev => new Set([...prev, invitation.id]));
      
      // Optimistic update
      setInvitations(prev => prev.filter(i => i.id !== invitation.id));
      
      await axios.post(`/api/invitations/${invitation.id}/reject`);
    } catch (error) {
      console.error('Error rejecting invitation:', error);
      // Revert if error
      fetchInvitations();
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(invitation.id);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        color: '#9ca3af'
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          border: '3px solid #fda4af',
          borderTopColor: '#db2777',
          animation: 'spin 0.8s linear infinite',
          marginRight: '0.5rem'
        }} />
        Loading invitations...
        
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (invitations.length === 0) {
    return null;
  }

  return (
    <>
      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
      
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{
          fontSize: '0.75rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          color: '#db2777',
          letterSpacing: '0.07em',
          marginBottom: '0.5rem',
          padding: '0 0.75rem'
        }}>
          Invitation Requests ({invitations.length})
        </h3>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {invitations.map((invitation) => {
            const sender = invitation.sender;
            const isOnline = sender?.last_seen_at 
              ? new Date(sender.last_seen_at).getTime() > Date.now() - 5 * 60 * 1000 
              : false;
            
            return (
              <div
                key={invitation.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  borderRadius: '1rem',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #fce7f3',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff5f7';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                }}
              >
                <div onClick={() => setSelectedUser(sender)}>
                  <Avatar name={sender?.name} size={48} online={isOnline} />
                </div>
                
                <div
                  style={{ flex: 1, minWidth: 0 }}
                  onClick={() => setSelectedUser(sender)}
                >
                  <h4 style={{
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    color: '#111827',
                    marginBottom: '0.25rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {sender?.name}
                  </h4>
                  <p style={{
                    fontSize: '0.8125rem',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem'
                  }}>
                    <Mail size={14} />
                    {sender?.email}
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  {/* Reject Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReject(invitation);
                    }}
                    disabled={processingIds.has(invitation.id)}
                    style={{
                      padding: '0.5rem 0.875rem',
                      borderRadius: '0.75rem',
                      border: '1px solid #fecaca',
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      fontWeight: 600,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      transition: 'all 0.15s ease',
                      opacity: processingIds.has(invitation.id) ? 0.5 : 1,
                      pointerEvents: processingIds.has(invitation.id) ? 'none' : 'auto'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fee2e2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#fef2f2';
                    }}
                  >
                    <X size={16} />
                    Delete
                  </button>
                  
                  {/* Accept Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccept(invitation);
                    }}
                    disabled={processingIds.has(invitation.id)}
                    style={{
                      padding: '0.5rem 0.875rem',
                      borderRadius: '0.75rem',
                      border: 'none',
                      backgroundColor: '#10b981',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                      transition: 'all 0.15s ease',
                      opacity: processingIds.has(invitation.id) ? 0.5 : 1,
                      pointerEvents: processingIds.has(invitation.id) ? 'none' : 'auto'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#059669';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#10b981';
                    }}
                  >
                    <Check size={16} />
                    Confirm
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
