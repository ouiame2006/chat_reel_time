import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Users, BookOpen, Settings, LogOut,
  Search, Plus, X, Check, Clock, UserPlus,
  ChevronLeft, ChevronRight, Image,
  Smile, Phone, Video as VideoIcon, MoreVertical,
  Shield, Mail, Calendar, Send, Mic, Paperclip, Trash2, Bell, Crown,
} from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import PremiumSettingsDashboard from './PremiumSettingsDashboard';

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtTime = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
const fmtDay = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return 'Today';
  const yest = new Date(now); yest.setDate(now.getDate() - 1);
  if (d.toDateString() === yest.toDateString()) return 'Yesterday';
  return d.toLocaleDateString();
};

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ name, size = 40, avatar, online }) {
  const COLORS = ['#db7b9b','#7c3aed','#0ea5e9','#10b981','#f59e0b','#8b5cf6'];
  const color  = COLORS[(name || '?').charCodeAt(0) % COLORS.length];
  const avatarUrl = avatar ? `http://127.0.0.1:8000/${avatar}` : null;
  return (
    <div style={{ position: 'relative', flexShrink: 0, width: size, height: size }}>
      {avatarUrl
        ? <img src={avatarUrl} alt={name}
            style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
        : <div style={{
            width: size, height: size, borderRadius: '50%',
            background: `linear-gradient(135deg,${color},${color}cc)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: size * 0.38, userSelect: 'none',
          }}>
            {(name || '?')[0].toUpperCase()}
          </div>
      }
      {online !== undefined && (
        <span style={{
          position: 'absolute', bottom: 1, right: 1,
          width: Math.round(size * 0.28), height: Math.round(size * 0.28),
          borderRadius: '50%', border: '2px solid #fff',
          background: online ? '#22c55e' : '#9ca3af',
        }} />
      )}
    </div>
  );
}

// ── Grouped Story Viewer ──────────────────────────────────────────────────────
function UserStoryViewer({ userStories, onClose, onNext, onPrev, hasNext, hasPrev }) {
  const [storyIdx, setStoryIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  const current = userStories[storyIdx];

  const advance = () => {
    if (storyIdx < userStories.length - 1) {
      setStoryIdx(i => i + 1);
    } else if (hasNext) {
      onNext();
    } else {
      onClose();
    }
  };

  useEffect(() => {
    setProgress(0);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { advance(); return 0; }
        return p + 2;
      });
    }, 100);
    return () => clearInterval(timerRef.current);
  }, [storyIdx]);

  if (!current) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#000',
      zIndex: 9999, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute', top: 14, left: 16, right: 16,
        display: 'flex', gap: 4, zIndex: 10,
      }}>
        {userStories.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: 'rgba(255,255,255,0.3)', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', background: '#fff',
              width: `${i < storyIdx ? 100 : i === storyIdx ? progress : 0}%`,
              transition: 'width 0.1s linear',
            }} />
          </div>
        ))}
      </div>

      <div style={{
        position: 'absolute', top: 32, left: 16, right: 16,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff' }}>
            <Avatar name={current.user?.name} size={36} avatar={current.user?.avatar} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{current.user?.name}</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.65 }}>{fmtTime(current.created_at)}</div>
            </div>
          </div>
        <button onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
          <X size={24} />
        </button>
      </div>

      <div style={{
        width: '100%', maxWidth: 420, maxHeight: '72vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1.5rem',
      }}>
        {current.type === 'image' && current.media_url
          ? <img src={current.media_url.startsWith('http') ? current.media_url : `http://127.0.0.1:8000/${current.media_url}`} alt=""
              style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: 16, objectFit: 'contain' }} />
          : <div style={{
              color: '#fff', fontSize: '2rem', fontWeight: 800,
              textAlign: 'center', lineHeight: 1.4,
              background: 'linear-gradient(135deg,#db7b9b,#e0a8bb)',
              borderRadius: 20, padding: '3rem 2rem', width: '100%',
            }}>
              {current.content}
            </div>
        }
      </div>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', zIndex: 5 }}>
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => {
          if (storyIdx > 0) { setStoryIdx(i => i - 1); }
          else if (hasPrev) { onPrev(); }
        }} />
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={advance} />
      </div>

      {(storyIdx > 0 || hasPrev) && (
        <button onClick={() => storyIdx > 0 ? setStoryIdx(i => i - 1) : onPrev()}
          style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
            width: 40, height: 40, cursor: 'pointer', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
          }}>
          <ChevronLeft size={22} />
        </button>
      )}
      <button onClick={advance}
        style={{
          position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
          width: 40, height: 40, cursor: 'pointer', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
        }}>
        <ChevronRight size={22} />
      </button>
    </div>
  );
}

// ── Stories Bar ───────────────────────────────────────────────────────────────
function StoriesBar({ groupedStories, currentUser, onOpenGroup, onAddClick, onUserClick }) {
  return (
    <div style={{
      padding: '1rem 1.5rem',
      background: '#fff',
      borderBottom: '1px solid #fce7f3',
      display: 'flex', alignItems: 'center', gap: 18,
      overflowX: 'auto', flexShrink: 0,
    }}>
      <div style={{ textAlign: 'center', flexShrink: 0, cursor: 'pointer' }} onClick={onAddClick}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          border: '2px dashed #e0a8bb',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#fdf2f4', margin: '0 auto 5px',
        }}>
          <Plus size={24} color="#db7b9b" />
        </div>
        <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#db7b9b', whiteSpace: 'nowrap' }}>
          Add Story
        </p>
      </div>

      {groupedStories.map((group, gIdx) => {
        const isMine = group.userId === currentUser?.id;
        const latest = group.stories[0];
        return (
          <div key={group.userId}
            style={{ textAlign: 'center', flexShrink: 0, position: 'relative' }}>
            <div
              onClick={() => onOpenGroup(gIdx)}
              style={{
                width: 64, height: 64, borderRadius: '50%',
                border: `3px solid transparent`,
                background: 'linear-gradient(#fff, #fff) padding-box, linear-gradient(135deg,#e0a8bb,#db7b9b) border-box',
                padding: 2, margin: '0 auto 5px',
                cursor: 'pointer',
              }}>
              {latest.type === 'image' && latest.media_url
                ? <img src={latest.media_url.startsWith('http') ? latest.media_url : `http://127.0.0.1:8000/${latest.media_url}`} alt=""
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                : <Avatar name={group.userName} size={56} avatar={group.stories[0].user?.avatar} />
              }
            </div>
            <p
              onClick={() => onUserClick && onUserClick(group.userId)}
              style={{
                fontSize: '0.68rem', fontWeight: 700, color: '#374151',
                maxWidth: 66, overflow: 'hidden', textOverflow: 'ellipsis',
                whiteSpace: 'nowrap', margin: '0 auto',
                cursor: 'pointer',
              }}
              title={`View ${group.userName}'s profile`}
            >
              {isMine ? 'You' : group.userName?.split(' ')[0]}
            </p>
            {group.stories.length > 1 && (
              <span style={{
                position: 'absolute', top: 0, right: 2,
                background: '#db7b9b', color: '#fff',
                borderRadius: '50%', width: 18, height: 18,
                fontSize: '0.6rem', fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #fff',
              }}>
                {group.stories.length}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── User Profile Modal ────────────────────────────────────────────────────────
function UserProfileModal({ profileUser, invStatus, pendingReceived, onClose, onSendInvite, onAccept, onReject, onOpenChat }) {
  if (!profileUser) return null;

  const st  = invStatus[profileUser.id];
  const inv = pendingReceived?.find(i => i.sender_id === profileUser.id);

  const COLORS = ['#db7b9b','#7c3aed','#0ea5e9','#10b981','#f59e0b','#8b5cf6'];
  const color  = COLORS[(profileUser.name || '?').charCodeAt(0) % COLORS.length];

  const joined = profileUser.created_at
    ? new Date(profileUser.created_at).toLocaleDateString(undefined, { year:'numeric', month:'long' })
    : null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 8888,
        background: 'rgba(17,24,39,0.45)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 24,
          width: '100%', maxWidth: 400,
          boxShadow: '0 32px 80px rgba(219,123,155,0.18), 0 4px 20px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          animation: 'modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both',
        }}
      >
        <div style={{ position: 'relative', height: 110 }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(135deg, ${color}22, ${color}44)`,
          }} />
          <button onClick={onClose} style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
            width: 30, height: 30, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#6b7280', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            <X size={16} />
          </button>
          <div style={{
            position: 'absolute', bottom: -34, left: 24,
            width: 72, height: 72, borderRadius: '50%',
            border: '4px solid #fff',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            overflow: 'hidden',
          }}>
            {profileUser.avatar ? (
              <img src={`http://127.0.0.1:8000/${profileUser.avatar}`} alt={profileUser.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                background: `linear-gradient(135deg,${color},${color}bb)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 900, fontSize: '1.75rem',
                userSelect: 'none',
              }}>
                {profileUser.name[0].toUpperCase()}
              </div>
            )}
          </div>
          <div style={{
            position: 'absolute', bottom: -34 + 52, left: 24 + 52,
            width: 16, height: 16, borderRadius: '50%',
            background: profileUser.is_online ? '#22c55e' : '#9ca3af',
            border: '3px solid #fff',
          }} />
        </div>

        <div style={{ padding: '2.5rem 1.5rem 1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 900, fontSize: '1.2rem', color: '#111827', marginBottom: 3 }}>
              {profileUser.name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: '0.75rem', fontWeight: 700,
                color: profileUser.is_online ? '#22c55e' : '#9ca3af',
                background: profileUser.is_online ? '#f0fdf4' : '#f3f4f6',
                padding: '0.25rem 0.65rem', borderRadius: 999,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                {profileUser.is_online ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

          {profileUser.bio && (
            <p style={{
              fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.6,
              marginBottom: '1rem', padding: '0.75rem', borderRadius: 12,
              background: '#fdf2f4', border: '1px solid #fce7f3',
            }}>
              {profileUser.bio}
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: '#6b7280' }}>
              <Mail size={14} color="#db7b9b" />
              <span>{profileUser.email}</span>
            </div>
            {joined && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: '#6b7280' }}>
                <Calendar size={14} color="#db7b9b" />
                <span>Joined {joined}</span>
              </div>
            )}
          </div>

          {st === 'accepted' ? (
            <button
              onClick={() => { onOpenChat(profileUser); onClose(); }}
              style={{
                width: '100%', padding: '0.85rem',
                borderRadius: 14, border: 'none',
                background: 'linear-gradient(135deg,#db7b9b,#e0a8bb)',
                color: '#fff', fontWeight: 800, fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 6px 20px rgba(219,123,155,0.35)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}
            >
              <MessageSquare size={18} /> Send Message
            </button>
          ) : st === 'i_sent' ? (
            <button disabled style={{
              width: '100%', padding: '0.85rem',
              borderRadius: 14, border: '1.5px solid #e5e7eb',
              background: '#f9fafb', color: '#9ca3af',
              fontWeight: 700, fontSize: '0.95rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              cursor: 'default',
            }}>
              <Clock size={18} /> Pending Approval…
            </button>
          ) : st === 'received' && inv ? (
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => { onAccept(inv); onClose(); }}
                style={{
                  flex: 1, padding: '0.85rem', borderRadius: 14, border: 'none',
                  background: '#10b981', color: '#fff', fontWeight: 800, fontSize: '0.9rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                <Check size={16} /> Accept
              </button>
              <button
                onClick={() => { onReject(inv); onClose(); }}
                style={{
                  flex: 1, padding: '0.85rem', borderRadius: 14, border: 'none',
                  background: '#fee2e2', color: '#ef4444', fontWeight: 800, fontSize: '0.9rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                <X size={16} /> Decline
              </button>
            </div>
          ) : (
            <button
              onClick={() => onSendInvite(profileUser.id)}
              style={{
                width: '100%', padding: '0.85rem',
                borderRadius: 14, border: '1.5px solid #e0a8bb',
                background: '#fdf2f4', color: '#db7b9b',
                fontWeight: 800, fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#db7b9b'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fdf2f4'; e.currentTarget.style.color = '#db7b9b'; }}
            >
              <UserPlus size={18} /> Send Invite
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Invitation Request Item ───────────────────────────────────────────────────
function InvitationRequestItem({ invitation, onAccept, onReject, onViewProfile, processingIds }) {
  const sender = invitation.sender;
  const isOnline = sender?.last_seen_at 
    ? new Date(sender.last_seen_at).getTime() > Date.now() - 5 * 60 * 1000 
    : false;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.875rem 0.75rem',
      borderRadius: '1rem',
      backgroundColor: '#fdf2f4',
      marginBottom: '0.5rem',
      transition: 'all 0.2s ease',
    }}>
      <div onClick={() => onViewProfile(sender)} style={{ cursor: 'pointer' }}>
        <Avatar name={sender?.name} size={48} avatar={sender?.avatar} online={isOnline} />
      </div>
      
      <div style={{ flex: 1, minWidth: 0 }} onClick={() => onViewProfile(sender)} style={{ cursor: 'pointer' }}>
        <h4 style={{
          fontSize: '0.9rem',
          fontWeight: 700,
          color: '#111827',
          marginBottom: '0.25rem',
        }}>
          {sender?.name}
        </h4>
        <p style={{
          fontSize: '0.75rem',
          color: '#6b7280',
        }}>
          {sender?.bio || 'Wants to connect'}
        </p>
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
        <button
          onClick={(e) => { e.stopPropagation(); onReject(invitation); }}
          disabled={processingIds.has(invitation.id)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '0.875rem',
            border: 'none',
            backgroundColor: '#fff',
            color: '#ef4444',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            opacity: processingIds.has(invitation.id) ? 0.5 : 1,
            pointerEvents: processingIds.has(invitation.id) ? 'none' : 'auto',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fee2e2';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#fff';
          }}
        >
          <X size={18} />
        </button>
        
        <button
          onClick={(e) => { e.stopPropagation(); onAccept(invitation); }}
          disabled={processingIds.has(invitation.id)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '0.875rem',
            border: 'none',
            backgroundColor: '#10b981',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16,185,129,0.25)',
            transition: 'all 0.2s ease',
            opacity: processingIds.has(invitation.id) ? 0.5 : 1,
            pointerEvents: processingIds.has(invitation.id) ? 'none' : 'auto',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#059669';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#10b981';
          }}
        >
          <Check size={18} />
        </button>
      </div>
    </div>
  );
}

// ── All People Item ───────────────────────────────────────────────────────────
function AllPeopleItem({ user, onInvite, onReject, invStatus, pendingReceived, onViewProfile }) {
  const isOnline = user.last_seen_at 
    ? new Date(user.last_seen_at).getTime() > Date.now() - 5 * 60 * 1000 
    : false;
  
  const st = invStatus[user.id];
  const inv = pendingReceived?.find(i => i.sender_id === user.id);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 0.75rem',
      borderRadius: '0.875rem',
      transition: 'background-color 0.2s ease',
      cursor: 'pointer',
    }}
    onClick={() => onViewProfile(user)}
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fdf2f4'}
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <Avatar name={user.name} size={36} avatar={user.avatar} online={isOnline} />
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#111827',
          marginBottom: '0.125rem',
        }}>
          {user.name}
        </h4>
        <p style={{
          fontSize: '0.75rem',
          color: isOnline ? '#22c55e' : '#9ca3af',
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: isOnline ? '#22c55e' : '#9ca3af',
          }} />
          {isOnline ? 'Online' : 'Offline'}
        </p>
      </div>
      
      <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
        {st === 'received' && inv ? (
          <>
            <button
              onClick={() => onInvite(user.id)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '0.625rem',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#e0a8bb',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <Plus size={14} />
            </button>
            <button
              onClick={() => onReject(inv)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '0.625rem',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#e0a8bb',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <X size={14} />
            </button>
          </>
        ) : st !== 'accepted' && st !== 'i_sent' ? (
          <>
            <button
              onClick={() => onInvite(user.id)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '0.625rem',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#e0a8bb',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fdf2f4';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Plus size={14} />
            </button>
            <button
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '0.625rem',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#e0a8bb',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <X size={14} />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

// ── User Card Component ───────────────────────────────────────────────────────
function UserCard({ user, invStatus, pendingReceived, onSendInvite, onAccept, onReject, onViewProfile }) {
  const isOnline = user.last_seen_at 
    ? new Date(user.last_seen_at).getTime() > Date.now() - 5 * 60 * 1000 
    : false;
  
  const st = invStatus[user.id];
  const inv = pendingReceived?.find(i => i.sender_id === user.id);

  let buttonText = 'Invite';
  let buttonColor = '#db7b9b';
  let buttonBg = '#fdf2f4';
  let buttonBorder = '#e0a8bb';

  if (st === 'accepted') {
    buttonText = 'Profile';
    buttonColor = '#9ca3af';
    buttonBg = '#f9fafb';
    buttonBorder = '#e5e7eb';
  } else if (st === 'i_sent') {
    buttonText = 'Pending';
    buttonColor = '#9ca3af';
    buttonBg = '#f9fafb';
    buttonBorder = '#e5e7eb';
  } else if (st === 'received' && inv) {
    buttonText = 'Accept Invitation';
    buttonColor = '#db7b9b';
    buttonBg = '#fdf2f4';
    buttonBorder = '#e0a8bb';
  }

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '1.25rem',
      padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.75rem',
      transition: 'all 0.2s ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
    }}
    >
      <Avatar name={user.name} size={64} avatar={user.avatar} online={isOnline} />
      
      <div style={{ textAlign: 'center' }}>
        <h3 style={{
          fontSize: '0.95rem',
          fontWeight: 700,
          color: '#111827',
          marginBottom: '0.25rem',
        }}>
          {user.name}
        </h3>
        <p style={{
          fontSize: '0.75rem',
          color: isOnline ? '#22c55e' : '#9ca3af',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.375rem',
          marginBottom: '0.375rem',
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: isOnline ? '#22c55e' : '#9ca3af',
          }} />
          {isOnline ? 'Online' : 'Offline'}
        </p>
        {user.bio && (
          <p style={{
            fontSize: '0.8rem',
            color: '#6b7280',
            maxWidth: '140px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {user.bio}
          </p>
        )}
      </div>

      <button
        onClick={() => {
          if (st === 'accepted') {
            onViewProfile(user);
          } else if (st === 'received' && inv) {
            onAccept(inv);
          } else if (st !== 'i_sent') {
            onSendInvite(user.id);
          }
        }}
        disabled={st === 'i_sent'}
        style={{
          width: '100%',
          padding: '0.625rem 1rem',
          borderRadius: '0.875rem',
          border: `1px solid ${buttonBorder}`,
          backgroundColor: buttonBg,
          color: buttonColor,
          fontWeight: 700,
          fontSize: '0.8rem',
          cursor: st === 'i_sent' ? 'default' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.375rem',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          if (st !== 'i_sent') {
            if (st === 'accepted') {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            } else {
              e.currentTarget.style.backgroundColor = '#db7b9b';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = '#db7b9b';
            }
          }
        }}
        onMouseLeave={(e) => {
          if (st !== 'i_sent') {
            if (st === 'accepted') {
              e.currentTarget.style.backgroundColor = '#f9fafb';
            } else {
              e.currentTarget.style.backgroundColor = buttonBg;
              e.currentTarget.style.color = buttonColor;
              e.currentTarget.style.borderColor = buttonBorder;
            }
          }
        }}
      >
        {buttonText}
      </button>
    </div>
  );
}

// ── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function Dashboard({ onOpenSettings }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('directory');

  const [allUsers, setAllUsers] = useState([]);
  const [invStatus, setInvStatus] = useState({});
  const [pendingReceived, setPendingReceived] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const messagesEndRef = useRef(null);
  const [stories, setStories] = useState([]);
  const [viewingGroupIdx, setViewingGroupIdx] = useState(null);
  const [storyText, setStoryText] = useState('');
  const [storyFile, setStoryFile] = useState(null);
  const [storyPreview, setStoryPreview] = useState(null);
  const [postingStory, setPostingStory] = useState(false);
  const [search, setSearch] = useState('');
  const [unread, setUnread] = useState({});
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [profileModal, setProfileModal] = useState(null);
  const [processingIds, setProcessingIds] = useState(new Set());
  
  // New features states
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [recording, setRecording] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [callType, setCallType] = useState(null); // 'audio' or 'video'
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  
  // New state for dropdown menu and profile modal
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const ping = () => axios.post('/api/user/ping').catch(() => {});
    ping();
    const pingId = setInterval(ping, 60_000);

    const pollId = setInterval(() => {
      loadUsers();
      loadInvitations();
      loadUnread();
    }, 15_000);

    return () => {
      clearInterval(pingId);
      clearInterval(pollId);
    };
  }, []);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    Promise.all([loadUsers(), loadConversations(), loadStories(), loadInvitations(), loadUnread()]);
  }, []);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data } = await axios.get('/api/users');
      setAllUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load users', e);
    } finally {
      setLoadingUsers(false);
    }
  };
  const loadConversations = async () => {
    const { data } = await axios.get('/api/conversations');
    setConversations(data);
  };
  const loadStories = async () => {
    const { data } = await axios.get('/api/stories');
    setStories(data);
  };
  const loadInvitations = async () => {
    const { data } = await axios.get('/api/invitations');
    const map = {};
    data.accepted?.forEach(inv => {
      const pid = inv.sender_id === user.id ? inv.receiver_id : inv.sender_id;
      map[pid] = 'accepted';
    });
    data.received?.forEach(inv => { map[inv.sender_id] = 'received'; });
    setInvStatus(map);
    setPendingReceived(data.received || []);
  };
  const loadUnread = async () => {
    const { data } = await axios.get('/api/unread-counts');
    setUnread(data);
  };

  const groupedStories = useMemo(() => {
    const map = new Map();
    stories.forEach(s => {
      const uid = s.user?.id;
      if (!uid) return;
      if (!map.has(uid)) {
        map.set(uid, { userId: uid, userName: s.user?.name, stories: [] });
      }
      map.get(uid).stories.push(s);
    });
    map.forEach(g => g.stories.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    const arr = [...map.values()];
    const myIdx = arr.findIndex(g => g.userId === user?.id);
    if (myIdx > 0) { const [mine] = arr.splice(myIdx, 1); arr.unshift(mine); }
    return arr;
  }, [stories, user?.id]);

  const closeStoryViewer = () => setViewingGroupIdx(null);
  const goNextGroup = () => {
    setViewingGroupIdx(i => (i < groupedStories.length - 1 ? i + 1 : null));
  };
  const goPrevGroup = () => {
    setViewingGroupIdx(i => (i > 0 ? i - 1 : null));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openChat = async (u) => {
    if (invStatus[u.id] !== 'accepted') return;
    setActiveUser(u);
    setActiveTab('chats');
    setLoadingMsgs(true);
    try {
      const { data } = await axios.get(`/api/messages/${u.id}`);
      setMessages(data);
      setUnread(prev => ({ ...prev, [u.id]: 0 }));
    } catch { setMessages([]); }
    finally { setLoadingMsgs(false); }
  };

  const sendInvite = async (userId) => {
    try {
      await axios.post('/api/invitations', { receiver_id: userId });
      setInvStatus(prev => ({ ...prev, [userId]: 'i_sent' }));
    } catch (err) {
      if (err.response?.status === 409) {
        const st = err.response.data.invitation?.status;
        setInvStatus(prev => ({ ...prev, [userId]: st === 'accepted' ? 'accepted' : 'i_sent' }));
      }
    }
  };

  const acceptInvite = async (inv) => {
    if (processingIds.has(inv.id)) return;
    try {
      setProcessingIds(prev => new Set([...prev, inv.id]));
      setPendingReceived(prev => prev.filter(i => i.id !== inv.id));
      setInvStatus(prev => ({ ...prev, [inv.sender_id]: 'accepted' }));
      await axios.post(`/api/invitations/${inv.id}/accept`);
      loadConversations();
    } catch (error) {
      console.error('Error accepting invitation:', error);
      loadInvitations();
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(inv.id);
        return next;
      });
    }
  };

  const rejectInvite = async (inv) => {
    if (processingIds.has(inv.id)) return;
    try {
      setProcessingIds(prev => new Set([...prev, inv.id]));
      setPendingReceived(prev => prev.filter(i => i.id !== inv.id));
      setInvStatus(prev => { const n = { ...prev }; delete n[inv.sender_id]; return n; });
      await axios.post(`/api/invitations/${inv.id}/reject`);
    } catch (error) {
      console.error('Error rejecting invitation:', error);
      loadInvitations();
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(inv.id);
        return next;
      });
    }
  };

  // New Features Handlers
  const addEmoji = (emoji) => {
    setMsgInput(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      setAttachments(prev => [
        ...prev,
        ...files.map(file => ({
          file,
          preview: URL.createObjectURL(file)
        }))
      ]);
    }
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const startCall = async (type) => {
    setCallType(type);
    setInCall(true);
  };

  const endCall = () => {
    setInCall(false);
    setCallType(null);
  };

  const handleStoryFileSelect = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setStoryFile(f);
    setStoryPreview(URL.createObjectURL(f));
  };
  const postStory = async (e) => {
    e.preventDefault();
    if (!storyText.trim() && !storyFile) return;
    setPostingStory(true);
    try {
      const formData = new FormData();
      formData.append('content', storyText || '');
      formData.append('type', storyFile ? 'image' : 'text');
      if (storyFile) {
        formData.append('image', storyFile);
      }

      const { data } = await axios.post('/api/stories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setStories(prev => [data, ...prev]);
      setStoryText('');
      setStoryFile(null);
      setStoryPreview(null);
    } catch (err) {
      console.error('Error posting story:', err);
    } finally {
      setPostingStory(false);
    }
  };

  // Update sendMessage to handle attachments too
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!msgInput.trim() && attachments.length === 0) return;
    if (invStatus[activeUser.id] !== 'accepted') return;
    
    // Create optimistic message
    const optimistic = {
      id: `opt-${Date.now()}`, 
      user_id: user.id, 
      receiver_id: activeUser.id,
      message: msgInput, 
      attachments: attachments.map(a => ({ name: a.file.name, preview: a.preview, type: a.file.type })),
      is_read: false, 
      created_at: new Date().toISOString(), 
      user,
    };
    
    setMessages(prev => [...prev, optimistic]);
    setMsgInput('');
    setAttachments([]);
    
    try {
      const formData = new FormData();
      formData.append('receiver_id', activeUser.id);
      formData.append('message', msgInput);
      attachments.forEach(a => formData.append('attachments', a.file));

      const { data } = await axios.post('/api/messages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessages(prev => prev.map(m => m.id === optimistic.id ? data.message : m));
      loadConversations();
    } catch {
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
      setMsgInput(msgInput);
      setAttachments(attachments);
    }
  };
  const deleteStory = async (id) => {
    await axios.delete(`/api/stories/${id}`).catch(() => {});
    setStories(prev => prev.filter(s => s.id !== id));
  };

  const totalUnread = Object.values(unread).reduce((a, b) => a + (b || 0), 0);
  const filteredConvos = conversations.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredUsers = allUsers.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; }
        body { font-family: 'Inter', system-ui, sans-serif; background: #fcfcff; }
        .dash { display: flex; height: 100vh; overflow: hidden; }
        .sb::-webkit-scrollbar { width: 4px; }
        .sb::-webkit-scrollbar-thumb { background: #e0a8bb; border-radius: 4px; }
        .sb::-webkit-scrollbar-track { background: transparent; }
        @keyframes fi { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .fi { animation: fi 0.25s ease both; }
        @keyframes modalIn { from{opacity:0;transform:scale(0.9) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        input, textarea { font-family: inherit; }
      `}</style>

      {profileModal && (
        <UserProfileModal
          profileUser={profileModal}
          invStatus={invStatus}
          pendingReceived={pendingReceived}
          onClose={() => setProfileModal(null)}
          onSendInvite={(uid) => { sendInvite(uid); setProfileModal(prev => prev?.id === uid ? { ...prev } : prev); }}
          onAccept={(inv) => acceptInvite(inv)}
          onReject={(inv) => rejectInvite(inv)}
          onOpenChat={(u) => openChat(u)}
        />
      )}

      {inCall && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(135deg, #db7b9b, #e0a8bb)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <Avatar name={activeUser?.name} size={120} avatar={activeUser?.avatar} online={activeUser?.is_online} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            {activeUser?.name}
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>
            {callType === 'audio' ? 'Audio Call…' : 'Video Call…'}
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={endCall}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#ef4444',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s ease',
                boxShadow: '0 4px 16px rgba(239,68,68,0.4)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Phone size={28} style={{ transform: 'rotate(135deg)' }} />
            </button>
          </div>
        </div>
      )}
      
      {/* Chat User Profile Modal */}
      {isProfileModalOpen && activeUser && (
        <div 
          onClick={() => setIsProfileModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(17, 24, 39, 0.45)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 9999,
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '1.5rem',
              width: '100%',
              maxWidth: '420px',
              boxShadow: '0 32px 80px rgba(219,123,155,0.18), 0 4px 20px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              animation: 'modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both',
            }}
          >
            {/* Header with close button */}
            <div style={{
              padding: '1rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #fce7f3',
            }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.125rem', color: '#111827' }}>
                Profile
              </h3>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '0.75rem',
                  background: '#fdf2f4',
                  border: 'none',
                  color: '#db7b9b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#db7b9b';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fdf2f4';
                  e.currentTarget.style.color = '#db7b9b';
                }}
              >
                <X size={18} />
              </button>
            </div>
            
            {/* User info */}
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <Avatar name={activeUser.name} size={96} avatar={activeUser.avatar} online={activeUser.is_online} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111827', marginTop: '1.25rem', marginBottom: '0.25rem' }}>
                {activeUser.name}
              </h2>
              <p style={{
                fontSize: '0.8rem',
                color: activeUser.is_online ? '#22c55e' : '#9ca3af',
                fontWeight: 700,
                background: activeUser.is_online ? '#f0fdf4' : '#f3f4f6',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}>
                <span style={{
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '50%',
                  background: activeUser.is_online ? '#22c55e' : '#9ca3af',
                }} />
                {activeUser.is_online ? 'Online' : 'Offline'}
              </p>
              
              {activeUser.bio && (
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  lineHeight: '1.6',
                  marginTop: '1rem',
                  padding: '0.875rem',
                  background: '#fdf2f4',
                  borderRadius: '0.875rem',
                  border: '1px solid #fce7f3',
                }}>
                  {activeUser.bio}
                </p>
              )}
            </div>
            
            {/* Details section */}
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
              <h4 style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: '#9ca3af',
                marginBottom: '0.75rem',
                letterSpacing: '0.07em',
              }}>
                Details
              </h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  background: '#fdf2f4',
                  borderRadius: '0.875rem',
                  border: '1px solid #fce7f3',
                }}>
                  <Mail size={18} color="#db7b9b" />
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginBottom: '0.125rem' }}>Email</p>
                    <p style={{ fontSize: '0.875rem', color: '#374151', fontWeight: 600 }}>{activeUser.email}</p>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  background: '#fdf2f4',
                  borderRadius: '0.875rem',
                  border: '1px solid #fce7f3',
                }}>
                  <Calendar size={18} color="#db7b9b" />
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginBottom: '0.125rem' }}>Joined</p>
                    <p style={{ fontSize: '0.875rem', color: '#374151', fontWeight: 600 }}>
                      {activeUser.created_at ? new Date(activeUser.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewingGroupIdx !== null && groupedStories[viewingGroupIdx] && (
        <UserStoryViewer
          userStories={groupedStories[viewingGroupIdx].stories}
          onClose={closeStoryViewer}
          onNext={goNextGroup}
          onPrev={goPrevGroup}
          hasNext={viewingGroupIdx < groupedStories.length - 1}
          hasPrev={viewingGroupIdx > 0}
        />
      )}

      <div className="dash">
        <aside style={{
          width: 62, flexShrink: 0, background: '#fff',
          borderRight: '1px solid #fce7f3',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '1rem 0', gap: 6,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: activeTab === 'settings' ? 'linear-gradient(135deg,#1e3a8a,#3b82f6)' : 'linear-gradient(135deg,#db7b9b,#e0a8bb)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom: 8 }}>
            {activeTab === 'settings' ? (
              <Settings size={18} color="#fff" fill="#fff" />
            ) : (
              <MessageSquare size={18} color="#fff" fill="#fff" />
            )}
          </div>

          {[
            { id:'chats',     Icon: MessageSquare, label:'Chats',     badge: totalUnread },
            { id:'directory', Icon: Users,         label:'Directory', badge: pendingReceived.length },
            { id:'stories',   Icon: BookOpen,      label:'Stories' },
            { id:'admin',     Icon: Crown,         label:'Admin Panel', action: () => navigate('/admin') },
            { id:'settings',  Icon: Settings,      label:'Settings', action: onOpenSettings },
          ].map(({ id, Icon, label, badge, action }) => (
            <button key={id} title={label} onClick={() => { 
              if (action) {
                action();
              } else {
                setActiveTab(id); setActiveUser(null); 
              }
            }}
              style={{
                position:'relative', width:42, height:42, borderRadius:10,
                border:'none', cursor:'pointer',
                background: activeTab===id ? (id === 'settings' ? '#e0f2fe' : id === 'admin' ? '#e0f2fe' : '#fdf2f4') : 'transparent',
                color: activeTab===id ? (id === 'settings' || id === 'admin' ? '#1e3a8a' : '#db7b9b') : '#9ca3af',
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all 0.15s',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== id) {
                  e.currentTarget.style.background = id === 'admin' ? '#e0f2fe' : '#fdf2f4';
                  e.currentTarget.style.color = id === 'admin' ? '#1e3a8a' : '#db7b9b';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== id) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#9ca3af';
                }
              }}
            >
              <Icon size={19} />
              {badge > 0 && (
                <span style={{
                  position:'absolute', top:5, right:5,
                  width:15, height:15, borderRadius:'50%',
                  background:'#db7b9b', color:'#fff',
                  fontSize:'0.55rem', fontWeight:800,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </button>
          ))}

          <div style={{ flex: 1 }} />
          <Avatar name={user?.name} size={30} />
          <button title="Logout" onClick={logout}
            style={{ width:42, height:42, borderRadius:10, border:'none', cursor:'pointer', background:'transparent', color:'#ef4444', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <LogOut size={17} />
          </button>
        </aside>

        <div style={{ width: 300, flexShrink:0, background:'#fff', borderRight:'1px solid #fce7f3', display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <div style={{ padding:'1.25rem 1rem 0.75rem', borderBottom:'1px solid #fce7f3' }}>
            <h2 style={{ fontSize:'1.1rem', fontWeight:900, color: activeTab === 'settings' ? '#1e3a8a' : '#db7b9b', marginBottom:'0.75rem' }}>
              {{ chats:'Chats', directory:'Directory', stories:'Stories', settings:'Settings' }[activeTab]}
            </h2>
            {(activeTab === 'chats' || activeTab === 'directory') && (
              <div style={{ position:'relative' }}>
                <Search size={14} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'#d1d5db', pointerEvents:'none' }} />
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder={activeTab === 'chats' ? 'Search chats…' : 'Search people…'}
                  style={{
                    width:'100%', padding:'0.625rem 0.875rem 0.625rem 2.25rem',
                    borderRadius: '0.875rem', border:'1px solid #fce7f3',
                    background:'#fcfcff', fontSize:'0.82rem', outline:'none', color:'#374151',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#e0a8bb'}
                  onBlur={(e) => e.target.style.borderColor = '#fce7f3'}
                />
              </div>
            )}
          </div>

          {activeTab === 'chats' && (
            <div className="sb" style={{ flex:1, overflowY:'auto' }}>
              {filteredConvos.length === 0 ? (
                <div style={{ padding:'2rem 1rem', textAlign:'center', color:'#9ca3af', fontSize:'0.82rem' }}>
                  <MessageSquare size={28} style={{ margin:'0 auto 0.5rem', display:'block', opacity:0.25 }} />
                  No conversations yet.
                </div>
              ) : filteredConvos.map(u => (
                <div key={u.id} className="fi" onClick={() => openChat(u)}
                  style={{
                    display:'flex', alignItems:'center', gap:10, padding:'0.875rem 1rem',
                    cursor: invStatus[u.id] === 'accepted' ? 'pointer' : 'default',
                    background: activeUser?.id === u.id ? '#fdf2f4' : 'transparent',
                    borderLeft: activeUser?.id === u.id ? '3px solid #db7b9b' : '3px solid transparent',
                    transition:'background 0.12s', opacity: invStatus[u.id] !== 'accepted' ? 0.6 : 1,
                  }}>
                  <Avatar name={u.name} size={42} avatar={u.avatar} online={u.is_online} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span style={{ fontWeight:700, fontSize:'0.88rem', color:'#111827', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.name}</span>
                      <span style={{ fontSize:'0.65rem', color:'#9ca3af', flexShrink:0, marginLeft:3 }}>{fmtTime(u.last_message_at)}</span>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:1 }}>
                      <p style={{ fontSize:'0.75rem', color:'#6b7280', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>
                        {u.last_message || 'Start chatting…'}
                      </p>
                      {(unread[u.id] || 0) > 0 && (
                        <span style={{ width:16, height:16, borderRadius:'50%', background:'#db7b9b', color:'#fff', fontSize:'0.6rem', fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginLeft:3 }}>
                          {unread[u.id] > 9 ? '9+' : unread[u.id]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'directory' && (
            <div className="sb" style={{ flex:1, overflowY:'auto', padding:'0.5rem 0' }}>
              {pendingReceived.length > 0 && (
                <div style={{ padding:'0 0.75rem 0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', padding: '0 0.25rem' }}>
                    <h3 style={{ fontSize:'0.75rem', fontWeight:800, textTransform:'uppercase', color:'#db7b9b', letterSpacing:'0.07em' }}>
                      Invitation Requests
                    </h3>
                    <span style={{
                      fontSize:'0.7rem',
                      fontWeight:700,
                      color:'#fff',
                      background:'#db7b9b',
                      padding:'0.125rem 0.5rem',
                      borderRadius:'9999px',
                    }}>
                      {pendingReceived.length}
                    </span>
                  </div>
                  {pendingReceived.map(inv => (
                    <InvitationRequestItem
                      key={inv.id}
                      invitation={inv}
                      onAccept={acceptInvite}
                      onReject={rejectInvite}
                      onViewProfile={(sender) => setProfileModal(sender)}
                      processingIds={processingIds}
                    />
                  ))}
                </div>
              )}
              
              <div style={{ padding:'0 0.75rem' }}>
                <p style={{ padding:'0.25rem 0.25rem 0.5rem', fontSize:'0.75rem', fontWeight:800, textTransform:'uppercase', color:'#9ca3af', letterSpacing:'0.07em' }}>All People</p>
                {loadingUsers ? (
                  <div style={{ display:'flex', justifyContent:'center', padding:'1.5rem' }}>
                    <div style={{ width:'24px', height:'24px', borderRadius:'50%', border:'3px solid #fda4af', borderTopColor:'#db7b9b', animation:'spin 0.8s linear infinite' }} />
                  </div>
                ) : filteredUsers.map(u => (
                  <AllPeopleItem
                    key={u.id}
                    user={u}
                    onInvite={sendInvite}
                    onReject={rejectInvite}
                    invStatus={invStatus}
                    pendingReceived={pendingReceived}
                    onViewProfile={(user) => setProfileModal(user)}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stories' && (
            <div className="sb" style={{ flex:1, overflowY:'auto', padding:'0.5rem 0.75rem' }}>
              <div style={{
                background: '#fdf2f4',
                borderRadius: '1rem',
                padding: '1rem',
                marginBottom: '1rem',
              }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#db7b9b', marginBottom: '0.5rem' }}>Add a new story</h3>
                <form onSubmit={postStory} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {storyPreview && (
                    <div style={{ position: 'relative', width: '100%', borderRadius: '0.75rem', overflow: 'hidden' }}>
                      <img src={storyPreview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => { setStoryFile(null); setStoryPreview(null); }}
                        style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'rgba(0,0,0,0.5)',
                          border: 'none',
                          color: '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Write something..."
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      borderRadius: '0.75rem',
                      border: '1px solid #fce7f3',
                      background: '#fff',
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <label style={{
                      flex: 1,
                      padding: '0.625rem 0.875rem',
                      borderRadius: '0.75rem',
                      border: '1px dashed #e0a8bb',
                      background: '#fff',
                      color: '#db7b9b',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.375rem',
                    }}>
                      <Image size={16} />
                      Add Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleStoryFileSelect}
                        style={{ display: 'none' }}
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={postingStory || (!storyText.trim() && !storyFile)}
                      style={{
                        padding: '0.625rem 1.25rem',
                        borderRadius: '0.75rem',
                        border: 'none',
                        background: 'linear-gradient(135deg,#db7b9b,#e0a8bb)',
                        color: '#fff',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        cursor: (postingStory || (!storyText.trim() && !storyFile)) ? 'default' : 'pointer',
                        opacity: (postingStory || (!storyText.trim() && !storyFile)) ? 0.5 : 1,
                      }}
                    >
                      {postingStory ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </form>
              </div>
              {stories.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                  <BookOpen size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
                  <p style={{ fontSize: '0.875rem' }}>No stories yet</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {stories.map(story => (
                    <div key={story.id} style={{
                      background: '#fff',
                      borderRadius: '1rem',
                      padding: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <Avatar name={story.user?.name} size={32} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.825rem', fontWeight: 600, color: '#111827' }}>{story.user?.name}</p>
                          <p style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{fmtTime(story.created_at)}</p>
                        </div>
                        {story.user?.id === user?.id && (
                          <button
                            onClick={() => deleteStory(story.id)}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '0.625rem',
                              border: 'none',
                              background: 'transparent',
                              color: '#9ca3af',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                      {story.type === 'image' && story.media_url && (
                        <img src={story.media_url.startsWith('http') ? story.media_url : `http://127.0.0.1:8000/${story.media_url}`} alt="" style={{
                          width: '100%',
                          borderRadius: '0.75rem',
                          maxHeight: '300px',
                          objectFit: 'cover',
                        }} />
                      )}
                      {story.content && <p style={{ fontSize: '0.875rem', color: '#374151', padding: '0.25rem 0' }}>{story.content}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Main Chat Content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {activeTab === 'directory' && (
              <>
                <StoriesBar
                  groupedStories={groupedStories}
                  currentUser={user}
                  onOpenGroup={(idx) => setViewingGroupIdx(idx)}
                  onAddClick={() => setActiveTab('stories')}
                  onUserClick={(uid) => {
                    const user = allUsers.find(u => u.id === uid);
                    if (user) setProfileModal(user);
                  }}
                />
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', marginBottom: '0.375rem' }}>
                      People Directory
                    </h2>
                    <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                      {allUsers.length} registered users · Connect to start chatting
                    </p>
                  </div>
                  
                  <div style={{ marginBottom: '1rem', padding: '0 0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#9ca3af', letterSpacing: '0.07em' }}>
                      All Users
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '1rem',
                  }}>
                    {loadingUsers ? (
                      Array.from({ length: 6 }).map((_, idx) => (
                        <div key={idx} style={{
                          background: '#fff',
                          borderRadius: '1.25rem',
                          padding: '1.5rem',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.75rem',
                        }}>
                          <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 1.5s infinite',
                          }} />
                          <div style={{
                            width: '100px',
                            height: '16px',
                            borderRadius: '0.5rem',
                            background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 1.5s infinite',
                          }} />
                          <div style={{
                            width: '80px',
                            height: '12px',
                            borderRadius: '0.5rem',
                            background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 1.5s infinite',
                          }} />
                          <div style={{
                            width: '100%',
                            height: '32px',
                            borderRadius: '0.875rem',
                            background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 1.5s infinite',
                          }} />
                        </div>
                      ))
                    ) : filteredUsers.map(u => (
                      <UserCard
                        key={u.id}
                        user={u}
                        invStatus={invStatus}
                        pendingReceived={pendingReceived}
                        onSendInvite={sendInvite}
                        onAccept={acceptInvite}
                        onReject={rejectInvite}
                        onViewProfile={(user) => setProfileModal(user)}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'chats' && activeUser && (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  padding: '1rem 1.5rem',
                  background: '#fff',
                  borderBottom: '1px solid #fce7f3',
                }}>
                  <button
                    onClick={() => setActiveTab('directory')}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '0.75rem',
                      border: 'none',
                      background: 'transparent',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fdf2f4';
                      e.currentTarget.style.color = '#db7b9b';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#9ca3af';
                    }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setIsProfileModalOpen(true)}>
                    <Avatar name={activeUser.name} size={40} avatar={activeUser.avatar} online={activeUser.is_online} />
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>{activeUser.name}</h3>
                      <p style={{ fontSize: '0.75rem', color: activeUser.is_online ? '#22c55e' : '#9ca3af' }}>
                        {activeUser.is_online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.375rem', position: 'relative' }} ref={menuRef}>
                    <button onClick={() => startCall('audio')} style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '0.75rem',
                      border: 'none',
                      background: '#fdf2f4',
                      color: '#db7b9b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }} onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#db7b9b';
                      e.currentTarget.style.color = '#fff';
                    }} onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fdf2f4';
                      e.currentTarget.style.color = '#db7b9b';
                    }}>
                      <Phone size={18} />
                    </button>
                    <button onClick={() => startCall('video')} style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '0.75rem',
                      border: 'none',
                      background: '#fdf2f4',
                      color: '#db7b9b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }} onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#db7b9b';
                      e.currentTarget.style.color = '#fff';
                    }} onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fdf2f4';
                      e.currentTarget.style.color = '#db7b9b';
                    }}>
                      <VideoIcon size={18} />
                    </button>
                    <button 
                      onClick={() => setIsMenuOpen(!isMenuOpen)} 
                      style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '0.75rem',
                      border: 'none',
                      background: isMenuOpen ? 'linear-gradient(135deg,#db7b9b,#e0a8bb)' : '#fdf2f4',
                      color: isMenuOpen ? '#fff' : '#db7b9b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }} onMouseEnter={(e) => {
                      if (!isMenuOpen) {
                        e.currentTarget.style.background = '#db7b9b';
                        e.currentTarget.style.color = '#fff';
                      }
                    }} onMouseLeave={(e) => {
                      if (!isMenuOpen) {
                        e.currentTarget.style.background = '#fdf2f4';
                        e.currentTarget.style.color = '#db7b9b';
                      }
                    }}>
                      <MoreVertical size={18} />
                    </button>
                    
                    {/* Dropdown menu */}
                    {isMenuOpen && (
                      <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 0.5rem)',
                        right: 0,
                        background: '#fff',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        padding: '0.5rem',
                        minWidth: '200px',
                        border: '1px solid #fce7f3',
                        animation: 'fi 0.2s ease both',
                        zIndex: 100,
                      }}>
                        <button 
                          onClick={() => { setIsMenuOpen(false); }} 
                          style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.75rem 1rem',
                          borderRadius: '0.75rem',
                          border: 'none',
                          background: 'transparent',
                          color: '#111827',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          transition: 'all 0.2s ease',
                        }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#fdf2f4';
                            e.currentTarget.style.color = '#db7b9b';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#111827';
                          }}
                        >
                          <Bell size={18} />
                          Mute Notifications
                        </button>
                        <button 
                          onClick={() => { setIsMenuOpen(false); }} 
                          style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.75rem 1rem',
                          borderRadius: '0.75rem',
                          border: 'none',
                          background: 'transparent',
                          color: '#111827',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          transition: 'all 0.2s ease',
                        }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#fdf2f4';
                            e.currentTarget.style.color = '#db7b9b';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#111827';
                          }}
                        >
                          <Shield size={18} />
                          Block User
                        </button>
                        <button 
                          onClick={() => { setIsMenuOpen(false); }} 
                          style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.75rem 1rem',
                          borderRadius: '0.75rem',
                          border: 'none',
                          background: 'transparent',
                          color: '#111827',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          transition: 'all 0.2s ease',
                        }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#fdf2f4';
                            e.currentTarget.style.color = '#db7b9b';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#111827';
                          }}
                        >
                          <Trash2 size={18} />
                          Clear Chat
                        </button>
                        <button 
                          onClick={() => { setIsMenuOpen(false); }} 
                          style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.75rem 1rem',
                          borderRadius: '0.75rem',
                          border: 'none',
                          background: 'transparent',
                          color: '#ef4444',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          transition: 'all 0.2s ease',
                        }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#fee2e2';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <Trash2 size={18} />
                          Delete Chat
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}>
                  {loadingMsgs ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width:'24px', height:'24px', borderRadius:'50%', border:'3px solid #fda4af', borderTopColor:'#db7b9b', animation:'spin 0.8s linear infinite' }} />
                    </div>
                  ) : messages.length === 0 ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '0.9rem' }}>
                      Say hi! Start a conversation
                    </div>
                  ) : (
                    messages.map(msg => {
                      const isSent = msg.user_id === user.id;
                      return (
                        <div key={msg.id} className="fi" style={{
                          display: 'flex',
                          justifyContent: isSent ? 'flex-end' : 'flex-start',
                        }}>
                          <div style={{
                            maxWidth: '65%',
                            background: isSent ? 'linear-gradient(135deg,#db7b9b,#e0a8bb)' : '#fff',
                            color: isSent ? '#fff' : '#111827',
                            padding: '0.75rem 1rem',
                            borderRadius: isSent ? '1.25rem 1.25rem 0.375rem 1.25rem' : '1.25rem 1.25rem 1.25rem 0.375rem',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                          }}>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{msg.message}</p>
                            <p style={{ fontSize: '0.7rem', color: isSent ? 'rgba(255,255,255,0.75)' : '#9ca3af', marginTop: '0.25rem', textAlign: 'right' }}>
                              {fmtTime(msg.created_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Attachments preview */}
                {attachments.length > 0 && (
                  <div style={{
                    padding: '0.75rem 1.5rem',
                    background: '#fff',
                    display: 'flex',
                    gap: '0.75rem',
                    overflowX: 'auto',
                  }}>
                    {attachments.map((att, idx) => (
                      <div key={idx} style={{
                        position: 'relative',
                        width: '80px',
                        height: '80px',
                        borderRadius: '0.75rem',
                        overflow: 'hidden',
                        border: '1px solid #fce7f3',
                        background: '#fdf2f4',
                      }}>
                        {att.file.type.startsWith('image/') ? (
                          <img src={att.preview} alt={att.file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            fontSize: '0.7rem',
                            color: '#9ca3af',
                            padding: '0.5rem',
                            textAlign: 'center',
                          }}>
                            <Paperclip size={24} style={{ marginBottom: '0.25rem' }} />
                            {att.file.name.length > 15 ? `${att.file.name.slice(0, 12)}...` : att.file.name}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeAttachment(idx)}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ef4444',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                          }}>
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div style={{
                  padding: '1rem 1.5rem',
                  background: '#fff',
                  borderTop: '1px solid #fce7f3',
                  position: 'relative',
                }}>
                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <div ref={emojiPickerRef} style={{
                      position: 'absolute',
                      bottom: 'calc(100% + 10px)',
                      left: '1.5rem',
                      zIndex: 100,
                    }}>
                      <Picker
                        data={data}
                        onEmojiSelect={addEmoji}
                        theme="light"
                        previewPosition="none"
                      />
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  {recording && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.75rem',
                      padding: '0.5rem 1rem',
                      background: '#fef2f2',
                      borderRadius: '0.75rem',
                      border: '1px solid #fecdd3',
                    }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: '#ef4444',
                        borderRadius: '50%',
                        animation: 'pulse 1.5s infinite',
                      }} />
                      <span style={{
                        fontSize: '0.8rem',
                        color: '#991b1b',
                        fontWeight: 600,
                      }}>
                        Recording…
                      </span>
                      <button
                        type="button"
                        onClick={() => setRecording(false)}
                        style={{
                          marginLeft: 'auto',
                          fontSize: '0.75rem',
                          color: '#ef4444',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 700,
                        }}
                      >
                        Stop
                      </button>
                    </div>
                  )}
                  <form onSubmit={sendMessage} style={{ display: 'flex', gap: '0.625rem' }}>
                    <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '0.875rem',
                      border: 'none',
                      background: showEmojiPicker ? 'linear-gradient(135deg,#db7b9b,#e0a8bb)' : '#fdf2f4',
                      color: showEmojiPicker ? '#fff' : '#db7b9b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }} onMouseEnter={(e) => {
                      if (!showEmojiPicker) {
                        e.currentTarget.style.background = '#db7b9b';
                        e.currentTarget.style.color = '#fff';
                      }
                    }} onMouseLeave={(e) => {
                      if (!showEmojiPicker) {
                        e.currentTarget.style.background = '#fdf2f4';
                        e.currentTarget.style.color = '#db7b9b';
                      }
                    }}>
                      <Smile size={20} />
                    </button>
                    <button type="button" onClick={() => fileInputRef.current.click()} style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '0.875rem',
                      border: 'none',
                      background: '#fdf2f4',
                      color: '#db7b9b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }} onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#db7b9b';
                      e.currentTarget.style.color = '#fff';
                    }} onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fdf2f4';
                      e.currentTarget.style.color = '#db7b9b';
                    }}>
                      <Paperclip size={20} />
                    </button>
                    <input
                      value={msgInput}
                      onChange={(e) => setMsgInput(e.target.value)}
                      placeholder="Type a message..."
                      style={{
                        flex: 1,
                        padding: '0.75rem 1rem',
                        borderRadius: '0.875rem',
                        border: '1px solid #fce7f3',
                        background: '#fcfcff',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                    {msgInput.trim() || attachments.length > 0 ? (
                      <button type="submit" style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '0.875rem',
                        border: 'none',
                        background: 'linear-gradient(135deg,#db7b9b,#e0a8bb)',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                      }} onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(219,123,155,0.3)';
                      }} onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}>
                        <Send size={18} />
                      </button>
                    ) : (
                      <button type="button" onClick={() => setRecording(!recording)} style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '0.875rem',
                        border: 'none',
                        background: recording ? '#ef4444' : '#fdf2f4',
                        color: recording ? '#fff' : '#db7b9b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                      }} onMouseEnter={(e) => {
                        if (!recording) {
                          e.currentTarget.style.background = '#db7b9b';
                          e.currentTarget.style.color = '#fff';
                        }
                      }} onMouseLeave={(e) => {
                        if (!recording) {
                          e.currentTarget.style.background = '#fdf2f4';
                          e.currentTarget.style.color = '#db7b9b';
                        }
                      }}>
                        <Mic size={20} />
                      </button>
                    )}
                  </form>
                </div>
              </>
            )}

            {activeTab === 'chats' && !activeUser && (
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9ca3af',
              }}>
                <MessageSquare size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>Select a chat</h3>
                <p style={{ fontSize: '0.875rem' }}>Choose a conversation from the sidebar</p>
              </div>
            )}
          </div>

          {activeTab === 'settings' && (
            <PremiumSettingsDashboard 
              onBack={() => setActiveTab('directory')} 
            />
          )}
        </div>
      </div>
    </>
  );
}
