import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  BookOpen, 
  Settings, 
  LogOut, 
  Sun, 
  Moon, 
  Plus, 
  Search, 
  Download, 
  Edit, 
  Key, 
  ShieldAlert, 
  Trash2, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  Check,
  X,
  Info,
  Bell,
  Monitor, 
  Cpu, 
  HardDrive, 
  Network, 
  ArrowRight, 
  Lock, 
  Unlock, 
  Ban, 
  ShieldCheck,
  Film,
  Megaphone,
  CheckCircle2,
  AlertCircle,
  Crown,
  RefreshCcw,
  Clock,
  Shield,
  MessageCircle,
  BarChart3,
  TrendingUp,
  History,
  AlertTriangle,
  Mail,
  Zap,
  Filter,
  Bot
} from 'lucide-react';

// ─── Toast Notification ───────────────────────────────────────────────────────
function Toast({ toasts, removeToast }) {
  return (
    <div style={{
      position: 'fixed', top: '1.25rem', right: '1.25rem',
      zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem',
    }}>
      {toasts.map(t => (
        <div key={t.id} onClick={() => removeToast(t.id)} style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          background: t.type === 'success' ? 'var(--success)' : t.type === 'error' ? 'var(--error)' : 'var(--primary)',
          color: '#fff',
          fontWeight: 600,
          fontSize: '0.9rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          animation: 'fadeIn 0.3s ease',
          maxWidth: '320px',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
        }}>
          <span>
            {t.type === 'success' ? <Check size={18} strokeWidth={3} /> : 
             t.type === 'error' ? <X size={18} strokeWidth={3} /> : 
             <Info size={18} strokeWidth={3} />}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONVERSATIONS TAB
// ═══════════════════════════════════════════════════════════════════════════════
function ConvosTab({ addToast }) {
  const [convos, setConvos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchConvos();
  }, []);

  const fetchConvos = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/admin/conversations');
      setConvos(data);
    } catch {
      addToast('Failed to load conversations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await axios.post('/api/admin/conversations/delete', {
        user1: deleteModal.user1,
        user2: deleteModal.user2
      });
      setConvos(prev => prev.filter(c => !(c.user1 === deleteModal.user1 && c.user2 === deleteModal.user2)));
      setDeleteModal(null);
      addToast('Conversation deleted', 'success');
    } catch {
      addToast('Failed to delete conversation', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
        <Table headers={['Participant 1', 'Participant 2', 'Messages', 'Last Activity', 'Actions']} loading={loading} empty={convos.length === 0}>
          {convos.map((c, i) => (
            <TR key={i}>
              <TD>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <UserAvatar name={c.user1_info?.name} size={32} />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-bright)' }}>{c.user1_info?.name || 'Unknown'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.user1_info?.email}</div>
                  </div>
                </div>
              </TD>
              <TD>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <UserAvatar name={c.user2_info?.name} size={32} />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-bright)' }}>{c.user2_info?.name || 'Unknown'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.user2_info?.email}</div>
                  </div>
                </div>
              </TD>
              <TD><span style={{ fontWeight: 800, color: 'var(--primary)' }}>{c.total_messages}</span></TD>
              <TD style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(c.last_message_at).toLocaleString()}</TD>
              <TD>
                <IconBtn title="Delete Conversation" onClick={() => setDeleteModal(c)} danger><Trash2 size={16} /></IconBtn>
              </TD>
            </TR>
          ))}
        </Table>
      </div>

      {deleteModal && (
        <Modal title="Delete Entire Conversation" onClose={() => setDeleteModal(null)} width="420px">
          <p style={{ color: 'var(--text-main)', marginBottom: '1.5rem' }}>
            Are you sure you want to delete the entire conversation between <strong>{deleteModal.user1_info?.name}</strong> and <strong>{deleteModal.user2_info?.name}</strong>? 
            <br/><br/>
            This will permanently remove <span style={{ color: 'var(--error)', fontWeight: 800 }}>{deleteModal.total_messages} messages</span>.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button onClick={() => setDeleteModal(null)} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-muted)', fontWeight: 600 }}>Cancel</button>
            <button onClick={handleDelete} disabled={submitting} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: 'none', background: 'var(--error)', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? <><Spinner size={14} /> Deleting…</> : '🗑️ Delete Conversation'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODERATION TAB
// ═══════════════════════════════════════════════════════════════════════════════
function ModerationTab({ addToast }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cleanupKeyword, setCleanupKeyword] = useState('');
  const [cleaning, setCleaning] = useState(false);
  const [suspendingUser, setSuspendingUser] = useState(null);
  const [suspendDays, setSuspendDays] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/admin/reports');
      setReports(data);
    } catch {
      addToast('Failed to load reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveReport = async (id) => {
    try {
      await axios.post(`/api/admin/reports/${id}/resolve`);
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'resolved' } : r));
      addToast('Report resolved', 'success');
    } catch {
      addToast('Failed to resolve report', 'error');
    }
  };

  const handleCleanup = async () => {
    if (!cleanupKeyword.trim()) return;
    setCleaning(true);
    try {
      const { data } = await axios.post('/api/admin/messages/cleanup', { keyword: cleanupKeyword });
      addToast(data.message, 'success');
      setCleanupKeyword('');
    } catch {
      addToast('Cleanup failed', 'error');
    } finally {
      setCleaning(false);
    }
  };

  const handleSuspend = async () => {
    setSubmitting(true);
    try {
      await axios.post(`/api/admin/users/${suspendingUser.id}/suspend`, { days: suspendDays });
      addToast(`User suspended for ${suspendDays} days`, 'success');
      setSuspendingUser(null);
    } catch {
      addToast('Suspension failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWarn = async (user) => {
    try {
      await axios.post(`/api/admin/users/${user.id}/warn`);
      addToast(`Warning sent to ${user.name}`, 'success');
    } catch {
      addToast('Failed to send warning', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }}>
        {/* Reports */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: 'var(--text-bright)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertTriangle size={20} color="var(--error)" /> User Reports
          </h3>
          <Table headers={['Reported User', 'Reporter', 'Reason', 'Status', 'Actions']} loading={loading} empty={reports.length === 0}>
            {reports.map(r => (
              <TR key={r.id}>
                <TD>
                  <div style={{ fontWeight: 700, color: 'var(--text-bright)' }}>{r.reported?.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: #{r.reported_id}</div>
                </TD>
                <TD>{r.reporter?.name}</TD>
                <TD>
                  <div style={{ fontWeight: 600 }}>{r.reason}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.details}</div>
                </TD>
                <TD>
                  <span style={{ padding: '0.25rem 0.6rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800, background: r.status === 'pending' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', color: r.status === 'pending' ? 'var(--error)' : 'var(--success)' }}>
                    {r.status.toUpperCase()}
                  </span>
                </TD>
                <TD>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {r.status === 'pending' && <IconBtn title="Mark Resolved" onClick={() => handleResolveReport(r.id)} color="var(--success)"><Check size={16} /></IconBtn>}
                    <IconBtn title="Warn User" onClick={() => handleWarn(r.reported)}><Megaphone size={16} /></IconBtn>
                    <IconBtn title="Suspend User" onClick={() => setSuspendingUser(r.reported)} danger><Ban size={16} /></IconBtn>
                  </div>
                </TD>
              </TR>
            ))}
          </Table>
        </div>

        {/* Tools */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: 'var(--text-bright)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Zap size={20} color="var(--primary)" /> Smart Cleanup
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>Quickly delete all messages containing specific prohibited words or spam keywords.</p>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}><Filter size={16} /></span>
              <input 
                value={cleanupKeyword} 
                onChange={e => setCleanupKeyword(e.target.value)} 
                placeholder="Keyword (e.g. spam, insult)..." 
                style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-bright)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <button 
              onClick={handleCleanup}
              disabled={cleaning || !cleanupKeyword.trim()}
              style={{ width: '100%', padding: '0.85rem', borderRadius: '14px', border: 'none', background: 'var(--error)', color: '#fff', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', opacity: cleaning || !cleanupKeyword.trim() ? 0.6 : 1 }}
            >
              {cleaning ? <Spinner size={18} /> : <><Trash2 size={18} /> Delete All Matches</>}
            </button>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', opacity: 0.8 }}>
             <h3 style={{ color: 'var(--text-bright)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Auto-Mod Status</h3>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--success)', fontWeight: 700, fontSize: '0.85rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor', boxShadow: '0 0 8px currentColor' }} />
                AI FILTER ACTIVE
             </div>
          </div>
        </div>
      </div>

      {suspendingUser && (
        <Modal title={`Suspend User — ${suspendingUser.name}`} onClose={() => setSuspendingUser(null)} width="400px">
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Choose suspension duration for this user. They will be logged out and unable to log back in until the period ends.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
             {[
               { label: '1 Day', days: 1 },
               { label: '1 Week', days: 7 },
               { label: '30 Days', days: 30 },
               { label: 'Permanent', days: 36500 },
             ].map(opt => (
               <button 
                key={opt.days}
                onClick={() => setSuspendDays(opt.days)}
                style={{ 
                  padding: '1rem', borderRadius: '12px', border: '1px solid ' + (suspendDays === opt.days ? 'var(--primary)' : 'var(--border)'),
                  background: suspendDays === opt.days ? 'rgba(139,92,246,0.1)' : 'var(--bg-input)',
                  color: suspendDays === opt.days ? 'var(--primary)' : 'var(--text-bright)',
                  fontWeight: 700, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                }}
               >{opt.label}</button>
             ))}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button onClick={() => setSuspendingUser(null)} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-muted)', fontWeight: 600 }}>Cancel</button>
            <button onClick={handleSuspend} disabled={submitting} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: 'none', background: 'var(--error)', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? <Spinner size={14} /> : `Confirm Suspension`}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Modal Wrapper ────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, width = '480px' }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(8px)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: width,
        boxShadow: '0 32px 128px rgba(0,0,0,0.5)',
        animation: 'fadeIn 0.25s ease',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--text-bright)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>{title}</h3>
          <button onClick={onClose} style={{
            background: 'var(--bg-input)', border: '1px solid var(--border)',
            color: 'var(--text-muted)', width: '36px', height: '36px',
            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = 'var(--error)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-input)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner({ size = 32 }) {
  return (
    <div style={{
      width: size, height: size,
      border: `3px solid var(--border)`,
      borderTop: `3px solid var(--primary)`,
      borderRight: `3px solid var(--secondary)`,
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
      flexShrink: 0,
    }} />
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function UserAvatar({ name, size = 36 }) {
  const initials = (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['#8B5CF6', '#06B6D4', '#F472B6', '#22C55E', '#F59E0B', '#EF4444'];
  const color = colors[(name || '').charCodeAt(0) % colors.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '10px',
      background: `linear-gradient(135deg, ${color}, ${color}99)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 800, fontSize: size * 0.35,
      flexShrink: 0,
    }}>{initials}</div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, loading }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: '20px', padding: '1.5rem',
      display: 'flex', alignItems: 'center', gap: '1.25rem',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative', overflow: 'hidden',
    }}
      onMouseEnter={e => { 
        e.currentTarget.style.transform = 'translateY(-4px)'; 
        e.currentTarget.style.boxShadow = `0 12px 32px ${color}22`;
        e.currentTarget.style.borderColor = color;
      }}
      onMouseLeave={e => { 
        e.currentTarget.style.transform = ''; 
        e.currentTarget.style.boxShadow = ''; 
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: '16px',
        background: `${color}15`, display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: color, flexShrink: 0,
        boxShadow: `inset 0 0 0 1px ${color}33`,
      }}>
        {typeof Icon === 'string' ? Icon : <Icon size={24} />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{label}</div>
        {loading
          ? <div style={{ marginTop: 4 }}><Spinner size={24} /></div>
          : <div style={{ color: 'var(--text-bright)', fontSize: '1.75rem', fontWeight: 900, lineHeight: 1 }}>{value ?? '—'}</div>
        }
      </div>
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: `${color}08` }} />
    </div>
  );
}

// ─── Simple Bar Chart ─────────────────────────────────────────────────────────
function BarChart({ data, height = 200, color = 'var(--primary)' }) {
  const max = Math.max(...data.map(d => d.count), 10);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height, padding: '1rem 0', width: '100%' }}>
      {data.map((d, i) => {
        const h = (d.count / max) * 100;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ 
              width: '100%', 
              height: `${h}%`, 
              background: color, 
              borderRadius: '4px 4px 0 0',
              opacity: 0.8 + (h / 200),
              minHeight: d.count > 0 ? '4px' : '0'
            }} title={`${d.date}: ${d.count}`} />
          </div>
        );
      })}
    </div>
  );
}

// ─── Input helper ─────────────────────────────────────────────────────────────
function Field({ label, type = 'text', value, onChange, placeholder, required, min, style }) {
  return (
    <div style={{ marginBottom: '1rem', ...style }}>
      {label && <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>{label}</label>}
      <input
        type={type} value={value} onChange={onChange}
        placeholder={placeholder} required={required} min={min}
        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-bright)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }}
        onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)'; }}
        onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = ''; }}
      />
    </div>
  );
}

// ─── Table wrapper ────────────────────────────────────────────────────────────
function Table({ headers, children, loading, empty }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {headers.map((h, i) => (
              <th key={i} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? <tr><td colSpan={headers.length} style={{ padding: '3rem', textAlign: 'center' }}><div style={{ display: 'flex', justifyContent: 'center' }}><Spinner /></div></td></tr>
            : children
          }
          {!loading && empty && <tr><td colSpan={headers.length} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No records found</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function TR({ children, selected }) {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: '1px solid var(--border)',
        background: selected ? 'rgba(139,92,246,0.12)' : hovered ? 'var(--bg-hover)' : 'transparent',
        transition: 'background 0.15s',
      }}
    >{children}</tr>
  );
}

function TD({ children, style }) {
  return <td style={{ padding: '0.75rem 1rem', color: 'var(--text-main)', verticalAlign: 'middle', ...style }}>{children}</td>;
}

// ─── Icon Buttons ─────────────────────────────────────────────────────────────
function IconBtn({ title, onClick, color = 'var(--text-muted)', children, danger }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={title} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? (danger ? 'rgba(239,68,68,0.15)' : 'var(--bg-hover)') : 'transparent',
        border: '1px solid ' + (hov ? (danger ? 'var(--error)' : 'var(--border-hover)') : 'transparent'),
        color: hov ? (danger ? 'var(--error)' : 'var(--primary)') : color,
        width: 30, height: 30, borderRadius: '8px',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.9rem', transition: 'all 0.15s', flexShrink: 0,
      }}
    >{children}</button>
  );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label, description, loading }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', marginBottom: '0.75rem', opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
      <div>
        <div style={{ fontWeight: 700, color: 'var(--text-bright)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {label}
          {loading && <Spinner size={14} />}
        </div>
        {description && <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{description}</div>}
      </div>
      <div onClick={onChange} style={{
        width: 48, height: 26, borderRadius: 999, cursor: 'pointer',
        background: checked ? 'var(--primary)' : 'var(--border)',
        position: 'relative', transition: 'background 0.25s', flexShrink: 0,
        boxShadow: checked ? '0 0 12px var(--primary-glow)' : 'none',
      }}>
        <div style={{
          position: 'absolute', top: 3, left: checked ? 25 : 3,
          width: 20, height: 20, borderRadius: '50%', background: '#fff',
          transition: 'left 0.25s', boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        }} />
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ page, total, perPage, onChange }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end', marginTop: '1rem', flexWrap: 'wrap' }}>
      <button 
        onClick={() => onChange(page - 1)} 
        disabled={page === 1} 
        style={{ width: '34px', height: '34px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1 }}
      >
        <ChevronLeft size={18} />
      </button>
      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
        let p;
        if (totalPages <= 7) p = i + 1;
        else if (page <= 4) p = i + 1;
        else if (page >= totalPages - 3) p = totalPages - 6 + i;
        else p = page - 3 + i;
        return (
          <button key={p} onClick={() => onChange(p)} style={{
            width: '34px', height: '34px', borderRadius: '10px', fontSize: '0.85rem',
            border: '1px solid ' + (p === page ? 'var(--primary)' : 'var(--border)'),
            background: p === page ? 'var(--primary)' : 'var(--bg-input)',
            color: p === page ? '#fff' : 'var(--text-muted)',
            fontWeight: p === page ? 700 : 400,
            cursor: 'pointer', transition: 'all 0.2s',
          }}>{p}</button>
        );
      })}
      <button 
        onClick={() => onChange(page + 1)} 
        disabled={page === totalPages} 
        style={{ width: '34px', height: '34px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1 }}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminDashboard({ onLogout, onSwitchToApp, theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);

  const addToast = useCallback((message, type = 'success') => {
    const id = ++toastId.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Maintenance banner
  const [maintenance, setMaintenance] = useState(() => localStorage.getItem('admin_maintenance') === 'true');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'convos', label: 'Conversations', icon: MessageCircle },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'moderation', label: 'Moderation', icon: Shield },
    { id: 'stories', label: 'Stories', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-deep)', overflow: 'hidden' }}>
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* ── Sidebar ── */}
      <aside style={{
        width: 260, flexShrink: 0, background: 'var(--bg-card)',
        borderRight: '1px solid var(--border)', display: 'flex',
        flexDirection: 'column', padding: '2rem 1.25rem', gap: '0.5rem',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.5rem' }}>
          <div style={{ 
            width: 42, height: 42, borderRadius: '12px', 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
            boxShadow: '0 8px 24px var(--primary-glow)'
          }}>
            <Film size={24} fill="currentColor" />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-bright)', letterSpacing: '-0.04em', lineHeight: 1 }}>
              ChatReel
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem' }}>Admin Dashboard</div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0.85rem 1rem', borderRadius: '14px',
                background: active ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent',
                color: active ? '#fff' : 'var(--text-muted)',
                border: 'none',
                fontWeight: 700, fontSize: '0.9rem', textAlign: 'left',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: active ? '0 12px 24px var(--primary-glow)' : 'none',
                cursor: 'pointer',
                position: 'relative',
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-bright)'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; } }}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                {tab.label}
                {active && <div style={{ position: 'absolute', right: '12px', width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
              </button>
            );
          })}
        </div>

        {/* Switch to App */}
        <div style={{ marginTop: '2rem', padding: '0 0.5rem' }}>
          <button onClick={onSwitchToApp} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '1rem',
            padding: '0.85rem 1rem', borderRadius: '14px',
            background: 'var(--bg-input)', color: 'var(--text-bright)',
            border: '1px solid var(--border)', fontWeight: 700, fontSize: '0.9rem',
            transition: 'all 0.2s', cursor: 'pointer',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'var(--bg-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-input)'; }}
          >
            <ArrowRight size={20} /> Go to User App
          </button>
        </div>

        {/* Logout */}
        <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
          <button onClick={onLogout} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '1rem',
            padding: '0.85rem 1rem', borderRadius: '14px',
            background: 'rgba(239,68,68,0.05)', color: 'var(--error)',
            border: '1px solid transparent', fontWeight: 700, fontSize: '0.9rem',
            transition: 'all 0.2s', cursor: 'pointer',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.05)'; e.currentTarget.style.borderColor = 'transparent'; }}
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Maintenance Banner */}
        {maintenance && (
          <div style={{ background: 'var(--warning)', color: '#000', padding: '0.75rem 1.5rem', fontWeight: 800, fontSize: '0.85rem', textAlign: 'center', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
            <ShieldAlert size={18} /> Maintenance Mode is ON — Users see a maintenance page
          </div>
        )}

        {/* Header */}
        <header style={{
          padding: '1.25rem 2.5rem', borderBottom: '1px solid var(--border)',
          background: 'var(--bg-card)', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              {(() => {
                const CurrentIcon = tabs.find(t => t.id === activeTab)?.icon || LayoutDashboard;
                return <CurrentIcon size={24} />;
              })()}
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-bright)', margin: 0, letterSpacing: '-0.02em' }}>
                {tabs.find(t => t.id === activeTab)?.label}
              </h1>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>Management & System Overview</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={toggleTheme} 
              style={{ width: 44, height: 44, borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <UserAvatar name="Admin" size={40} />
              <div style={{ textAlign: 'right', display: 'none' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-bright)' }}>Admin</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Super User</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {activeTab === 'overview' && <OverviewTab addToast={addToast} />}
          {activeTab === 'users' && <UsersTab addToast={addToast} />}
          {activeTab === 'convos' && <ConvosTab addToast={addToast} />}
          {activeTab === 'messages' && <MessagesTab addToast={addToast} />}
          {activeTab === 'moderation' && <ModerationTab addToast={addToast} />}
          {activeTab === 'stories' && <StoriesTab addToast={addToast} />}
          {activeTab === 'settings' && <SettingsTab addToast={addToast} maintenance={maintenance} setMaintenance={setMaintenance} />}
        </main>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// OVERVIEW TAB
// ═══════════════════════════════════════════════════════════════════════════════
function OverviewTab({ addToast }) {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [announcement, setAnnouncement] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchRecentUsers();
  }, []);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const { data } = await axios.get('/api/admin/stats');
      setStats(data);
    } catch {
      addToast('Failed to load stats', 'error');
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchRecentUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data } = await axios.get('/api/admin/users');
      setRecentUsers(Array.isArray(data) ? data.slice(0, 5) : (data.data || []).slice(0, 5));
    } catch {
      addToast('Failed to load recent users', 'error');
    } finally {
      setLoadingUsers(false);
    }
  };

  const sendAnnouncement = async () => {
    if (!announcement.trim()) return;
    setSending(true);
    try {
      await axios.post('/api/admin/announce', { message: announcement });
      addToast('Announcement sent to all users!', 'success');
      setAnnouncement('');
    } catch {
      addToast('Failed to send announcement', 'error');
    } finally {
      setSending(false);
    }
  };

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats?.total_users, color: '#8B5CF6' },
    { icon: CheckCircle2, label: 'Online Now', value: stats?.online_users, color: '#22C55E' },
    { icon: TrendingUp, label: 'Active Today', value: stats?.active_today, color: '#06B6D4' },
    { icon: MessageSquare, label: 'Total Messages', value: stats?.total_messages, color: '#F472B6' },
    { icon: BookOpen, label: 'Total Stories', value: stats?.total_stories, color: '#F59E0B' },
    { icon: AlertTriangle, label: 'Pending Reports', value: stats?.pending_reports, color: '#EF4444' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {statCards.map((c, i) => (
          <StatCard key={i} {...c} loading={loadingStats} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '2rem' }}>
        {/* Charts & Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Messages Chart */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ color: 'var(--text-bright)', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>Message Activity</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Total messages sent per day (Last 30 days)</p>
              </div>
              <BarChart3 size={24} color="var(--primary)" />
            </div>
            {stats?.daily_messages ? (
              <BarChart data={stats.daily_messages} color="var(--primary)" />
            ) : (
              <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                {loadingStats ? <Spinner /> : 'No data available'}
              </div>
            )}
          </div>

          {/* Recent Users */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--text-bright)', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>Recent Registrations</h3>
              <button onClick={fetchRecentUsers} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                View All <ArrowRight size={16} />
              </button>
            </div>
            <Table headers={['User', 'Email', 'Role', 'Joined']} loading={loadingUsers} empty={recentUsers.length === 0}>
              {recentUsers.map(u => (
                <TR key={u.id}>
                  <TD><div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><UserAvatar name={u.name} size={32} /><span style={{ fontWeight: 600, color: 'var(--text-bright)' }}>{u.name}</span></div></TD>
                  <TD style={{ color: 'var(--text-muted)' }}>{u.email}</TD>
                  <TD>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700, background: u.is_admin ? 'rgba(139,92,246,0.15)' : 'rgba(6,182,212,0.12)', color: u.is_admin ? 'var(--primary)' : 'var(--secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      {u.is_admin ? <Crown size={12} /> : <Users size={12} />}
                      {u.is_admin ? 'Admin' : 'User'}
                    </span>
                  </TD>
                  <TD style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</TD>
                </TR>
              ))}
            </Table>
          </div>
        </div>

        {/* Sidebar stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* AI & Invites Stats */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: 'var(--text-bright)', fontWeight: 800, marginBottom: '1.5rem', fontSize: '1.1rem' }}>Feature Usage</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-input)', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(6,182,212,0.1)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={20} /></div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-bright)' }}>AI Conversations</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Nexus-X Neural sessions</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--secondary)' }}>{stats?.ai_conversations || 0}</div>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-input)', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(139,92,246,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={20} /></div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-bright)' }}>Invitations</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stats?.invitations_accepted || 0} accepted / {stats?.total_invitations || 0} total</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)' }}>{Math.round((stats?.invitations_accepted / (stats?.total_invitations || 1)) * 100)}%</div>
               </div>
            </div>
          </div>

          {/* Broadcast */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: 'var(--text-bright)', fontWeight: 800, marginBottom: '1.25rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Megaphone size={20} color="var(--primary)" /> Broadcast
            </h3>
            <textarea
              value={announcement}
              onChange={e => setAnnouncement(e.target.value)}
              placeholder="Send a global announcement to all users..."
              rows={4}
              style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-bright)', fontSize: '0.9rem', resize: 'none', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s' }}
              onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 4px var(--primary-glow)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = ''; }}
            />
            <button
              onClick={sendAnnouncement}
              disabled={sending || !announcement.trim()}
              style={{
                marginTop: '1rem', width: '100%', padding: '0.85rem',
                borderRadius: '14px', border: 'none',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                color: '#fff', fontWeight: 800, fontSize: '0.9rem',
                opacity: (sending || !announcement.trim()) ? 0.6 : 1,
                cursor: (sending || !announcement.trim()) ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                boxShadow: (sending || !announcement.trim()) ? 'none' : '0 8px 20px var(--primary-glow)',
                transition: 'all 0.2s',
              }}
            >
              {sending ? <><Spinner size={18} /> Sending…</> : <><Megaphone size={18} /> Send to All Users</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// USERS TAB
// ═══════════════════════════════════════════════════════════════════════════════
function UsersTab({ addToast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  // Modals
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);       // user object
  const [resetModal, setResetModal] = useState(null);     // user object
  const [deleteModal, setDeleteModal] = useState(null);   // user object
  const [detailModal, setDetailModal] = useState(null);   // user object

  // Forms
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', is_admin: false });
  const [editForm, setEditForm] = useState({ name: '', email: '', bio: '', is_admin: false });
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const searchTimer = useRef(null);

  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchUsers(), 350);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/admin/users', { params: { q: search } });
      setUsers(Array.isArray(data) ? data : (data.data || []));
      setPage(1);
    } catch {
      addToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportUsers = async () => {
    try {
      const { data } = await axios.get('/api/admin/users/export', { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
      const a = document.createElement('a');
      a.href = url; a.download = 'users_export.json'; a.click();
      URL.revokeObjectURL(url);
      addToast('Export downloaded', 'success');
    } catch {
      addToast('Export failed', 'error');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axios.post('/api/admin/users', addForm);
      setUsers(prev => [data, ...prev]);
      setAddModal(false);
      setAddForm({ name: '', email: '', password: '', is_admin: false });
      addToast('User created successfully', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create user', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (u) => {
    setEditForm({ name: u.name, email: u.email, bio: u.bio || '', is_admin: !!u.is_admin });
    setEditModal(u);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axios.put(`/api/admin/users/${editModal.id}`, editForm);
      setUsers(prev => prev.map(u => u.id === editModal.id ? { ...u, ...data } : u));
      setEditModal(null);
      addToast('User updated', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update user', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    setSubmitting(true);
    try {
      await axios.post(`/api/admin/users/${resetModal.id}/reset-password`, { password: newPassword });
      setResetModal(null);
      setNewPassword('');
      addToast('Password reset successfully', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to reset password', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await axios.delete(`/api/admin/users/${deleteModal.id}`);
      setUsers(prev => prev.filter(u => u.id !== deleteModal.id));
      setDeleteModal(null);
      addToast('User deleted', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete user', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBlock = async (u) => {
    const endpoint = u.blocked_at ? 'unblock' : 'block';
    try {
      await axios.post(`/api/admin/users/${u.id}/${endpoint}`);
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, blocked_at: endpoint === 'block' ? new Date().toISOString() : null } : x));
      addToast(`User ${endpoint}ed`, 'success');
    } catch {
      addToast(`Failed to ${endpoint} user`, 'error');
    }
  };

  const handleRoleToggle = async (u) => {
    try {
      await axios.post(`/api/admin/users/${u.id}/role`, { is_admin: !u.is_admin });
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, is_admin: !u.is_admin } : x));
      addToast(`Role updated`, 'success');
    } catch {
      addToast('Failed to update role', 'error');
    }
  };

  const paginated = users.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 280 }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex' }}><Search size={18} /></span>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search users by name or email…"
            style={{ width: '100%', paddingLeft: '2.75rem', padding: '0.85rem 1rem 0.85rem 2.75rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-bright)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s' }}
            onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 4px var(--primary-glow)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = ''; }}
          />
        </div>
        <button onClick={() => setAddModal(true)} style={{ padding: '0.85rem 1.5rem', borderRadius: '14px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#fff', border: 'none', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.6rem', whiteSpace: 'nowrap', cursor: 'pointer', boxShadow: '0 8px 20px var(--primary-glow)' }}>
          <Plus size={18} /> Add New User
        </button>
        <button onClick={exportUsers} style={{ padding: '0.85rem 1.5rem', borderRadius: '14px', background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.6rem', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'var(--bg-input)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
        >
          <Download size={18} /> Export JSON
        </button>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
        <Table
          headers={['#', 'Avatar', 'Name', 'Email', 'Role', 'Msgs', 'Status', 'Joined', 'Actions']}
          loading={loading}
          empty={!loading && paginated.length === 0}
        >
          {paginated.map((u, i) => (
            <TR key={u.id}>
              <TD style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>{(page - 1) * PER_PAGE + i + 1}</TD>
              <TD><UserAvatar name={u.name} size={36} /></TD>
              <TD>
                <button onClick={() => setDetailModal(u)} style={{ background: 'none', border: 'none', color: 'var(--text-bright)', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: '0.9rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-bright)'}
                >{u.name}</button>
              </TD>
              <TD style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{u.email}</TD>
              <TD>
                <span style={{ padding: '0.3rem 0.75rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700, background: u.is_admin ? 'rgba(139,92,246,0.15)' : 'rgba(148,163,184,0.12)', color: u.is_admin ? 'var(--primary)' : 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  {u.is_admin ? <Crown size={12} /> : <Users size={12} />}
                  {u.is_admin ? 'Admin' : 'User'}
                </span>
              </TD>
              <TD style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>{u.messages_count ?? 0}</TD>
              <TD>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 800, color: u.blocked_at ? 'var(--error)' : u.is_online ? 'var(--success)' : 'var(--text-muted)', background: u.blocked_at ? 'rgba(239,68,68,0.1)' : u.is_online ? 'rgba(34,197,94,0.1)' : 'rgba(148,163,184,0.1)', padding: '0.25rem 0.6rem', borderRadius: '8px' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                  {u.blocked_at ? 'Blocked' : u.is_online ? 'Online' : 'Offline'}
                </span>
              </TD>
              <TD style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</TD>
              <TD>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <IconBtn title="Edit Profile" onClick={() => openEdit(u)}><Edit size={16} /></IconBtn>
                  <IconBtn title="Reset Password" onClick={() => setResetModal(u)}><Key size={16} /></IconBtn>
                  <IconBtn title={u.blocked_at ? 'Unblock' : 'Block User'} onClick={() => handleBlock(u)} color={u.blocked_at ? 'var(--success)' : 'var(--warning)'}>
                    {u.blocked_at ? <Unlock size={16} /> : <Ban size={16} />}
                  </IconBtn>
                  <IconBtn title={u.is_admin ? 'Revoke Admin' : 'Grant Admin'} onClick={() => handleRoleToggle(u)} color="var(--primary)">
                    {u.is_admin ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                  </IconBtn>
                  <IconBtn title="Delete Permanently" onClick={() => setDeleteModal(u)} danger><Trash2 size={16} /></IconBtn>
                </div>
              </TD>
            </TR>
          ))}
        </Table>
        <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{users.length} total users</span>
          <Pagination page={page} total={users.length} perPage={PER_PAGE} onChange={setPage} />
        </div>
      </div>

      {/* ── Add User Modal ── */}
      {addModal && (
        <Modal title="Add New User" onClose={() => setAddModal(false)}>
          <form onSubmit={handleAdd}>
            <Field label="Full Name" value={addForm.name} onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" required />
            <Field label="Email" type="email" value={addForm.email} onChange={e => setAddForm(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" required />
            <Field label="Password" type="password" value={addForm.password} onChange={e => setAddForm(p => ({ ...p, password: e.target.value }))} placeholder="Min 8 characters" required />
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', marginBottom: '1.25rem', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.875rem' }}>
              <input type="checkbox" checked={addForm.is_admin} onChange={e => setAddForm(p => ({ ...p, is_admin: e.target.checked }))} style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
              Grant Admin Privileges
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setAddModal(false)} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-muted)', fontWeight: 600 }}>Cancel</button>
              <button type="submit" disabled={submitting} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: submitting ? 0.7 : 1 }}>
                {submitting ? <><Spinner size={14} /> Creating…</> : 'Create User'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Edit User Modal ── */}
      {editModal && (
        <Modal title={`Edit — ${editModal.name}`} onClose={() => setEditModal(null)}>
          <form onSubmit={handleEdit}>
            <Field label="Full Name" value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} required />
            <Field label="Email" type="email" value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} required />
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Bio</label>
              <textarea value={editForm.bio} onChange={e => setEditForm(p => ({ ...p, bio: e.target.value }))} rows={3} placeholder="User bio…"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-bright)', fontSize: '0.875rem', resize: 'vertical', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = ''; }}
              />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', marginBottom: '1.25rem', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.875rem' }}>
              <input type="checkbox" checked={editForm.is_admin} onChange={e => setEditForm(p => ({ ...p, is_admin: e.target.checked }))} style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
              Admin Privileges
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setEditModal(null)} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-muted)', fontWeight: 600 }}>Cancel</button>
              <button type="submit" disabled={submitting} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: submitting ? 0.7 : 1 }}>
                {submitting ? <><Spinner size={14} /> Saving…</> : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Reset Password Modal ── */}
      {resetModal && (
        <Modal title={`Reset Password — ${resetModal.name}`} onClose={() => { setResetModal(null); setNewPassword(''); }}>
          <form onSubmit={handleResetPassword}>
            <Field label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" required />
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => { setResetModal(null); setNewPassword(''); }} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-muted)', fontWeight: 600 }}>Cancel</button>
              <button type="submit" disabled={submitting || !newPassword.trim()} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: (submitting || !newPassword.trim()) ? 0.7 : 1 }}>
                {submitting ? <><Spinner size={14} /> Resetting…</> : '🔑 Reset Password'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteModal && (
        <Modal title="Confirm Delete" onClose={() => setDeleteModal(null)} width="400px">
          <p style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Are you sure you want to delete <strong style={{ color: 'var(--text-bright)' }}>{deleteModal.name}</strong>?</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>This action cannot be undone. All their data will be permanently removed.</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button onClick={() => setDeleteModal(null)} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-muted)', fontWeight: 600 }}>Cancel</button>
            <button onClick={handleDelete} disabled={submitting} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: 'none', background: 'var(--error)', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? <><Spinner size={14} /> Deleting…</> : '🗑️ Delete User'}
            </button>
          </div>
        </Modal>
      )}

      {/* ── User Details Modal ── */}
      {detailModal && (
        <Modal title="User Details" onClose={() => setDetailModal(null)} width="520px">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-input)', borderRadius: '12px' }}>
            <UserAvatar name={detailModal.name} size={56} />
            <div>
              <div style={{ fontWeight: 800, color: 'var(--text-bright)', fontSize: '1.1rem' }}>{detailModal.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{detailModal.email}</div>
              <div style={{ marginTop: '0.3rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, background: detailModal.is_admin ? 'rgba(139,92,246,0.2)' : 'rgba(6,182,212,0.15)', color: detailModal.is_admin ? 'var(--primary)' : 'var(--secondary)' }}>
                  {detailModal.is_admin ? '👑 Admin' : '👤 User'}
                </span>
                <span style={{ padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, background: detailModal.is_online ? 'rgba(34,197,94,0.15)' : 'rgba(148,163,184,0.15)', color: detailModal.is_online ? 'var(--success)' : 'var(--text-muted)' }}>
                  {detailModal.is_online ? '🟢 Online' : '⚫ Offline'}
                </span>
              </div>
            </div>
          </div>
          {[
            ['Bio', detailModal.bio || 'No bio set'],
            ['Messages Sent', detailModal.messages_count ?? 0],
            ['Member Since', detailModal.created_at ? new Date(detailModal.created_at).toLocaleString() : '—'],
            ['Status', detailModal.blocked_at ? `Blocked on ${new Date(detailModal.blocked_at).toLocaleDateString()}` : 'Active'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{k}</span>
              <span style={{ color: 'var(--text-bright)', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{String(v)}</span>
            </div>
          ))}
          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button onClick={() => { setDetailModal(null); openEdit(detailModal); }} style={{ padding: '0.65rem 1.1rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>✏️ Edit</button>
            <button onClick={() => setDetailModal(null)} style={{ padding: '0.65rem 1.1rem', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: '#fff', fontWeight: 700, fontSize: '0.875rem' }}>Close</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MESSAGES TAB
// ═══════════════════════════════════════════════════════════════════════════════
function MessagesTab({ addToast }) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: '', user_id: '', from: '', to: '' });
  const [selected, setSelected] = useState(new Set());
  const [deleteModal, setDeleteModal] = useState(null);
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/admin/users');
      setUsers(Array.isArray(data) ? data : (data.data || []));
    } catch { /* silent */ }
  };

  const fetchMessages = async () => {
    setLoading(true);
    setSelected(new Set());
    try {
      const { data } = await axios.get('/api/admin/messages', { params: filters });
      const list = Array.isArray(data) ? data : (data.data || []);
      setMessages(list);
      setPage(1);
    } catch {
      addToast('Failed to load messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await axios.delete(`/api/admin/messages/${deleteModal.id}`);
      setMessages(prev => prev.filter(m => m.id !== deleteModal.id));
      setDeleteModal(null);
      addToast('Message deleted', 'success');
    } catch {
      addToast('Failed to delete message', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkDelete = async () => {
    setSubmitting(true);
    try {
      await axios.post('/api/admin/messages/bulk-delete', { ids: Array.from(selected) });
      setMessages(prev => prev.filter(m => !selected.has(m.id)));
      setSelected(new Set());
      setBulkDeleteModal(false);
      addToast(`${selected.size} messages deleted`, 'success');
    } catch {
      addToast('Bulk delete failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === paginated.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginated.map(m => m.id)));
    }
  };

  const paginated = messages.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const allSelected = paginated.length > 0 && paginated.every(m => selected.has(m.id));

  const inputStyle = { padding: '0.6rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-bright)', fontSize: '0.85rem', outline: 'none', fontFamily: 'inherit' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Filters */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Search Content</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex' }}><Search size={16} /></span>
            <input value={filters.q} onChange={e => setFilters(p => ({ ...p, q: e.target.value }))} placeholder="Search messages content…" style={{ ...inputStyle, width: '100%', paddingLeft: '2.5rem', boxSizing: 'border-box' }}
              onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 4px var(--primary-glow)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = ''; }}
            />
          </div>
        </div>
        <div style={{ minWidth: 180 }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Sender</label>
          <select value={filters.user_id} onChange={e => setFilters(p => ({ ...p, user_id: e.target.value }))} style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', appearance: 'none' }}>
            <option value="">All Users</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <div style={{ minWidth: 140 }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>From</label>
          <input type="date" value={filters.from} onChange={e => setFilters(p => ({ ...p, from: e.target.value }))} style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} />
        </div>
        <button onClick={() => setFilters({ q: '', user_id: '', from: '', to: '' })} style={{ padding: '0.7rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-main)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          Reset
        </button>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div style={{ background: 'var(--primary)', color: '#fff', padding: '0.85rem 1.5rem', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', animation: 'fadeIn 0.3s ease', boxShadow: '0 8px 24px var(--primary-glow)' }}>
          <div style={{ fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CheckCircle2 size={20} /> {selected.size} messages selected
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setBulkDeleteModal(true)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            >
              <Trash2 size={16} /> Delete Selected
            </button>
            <button onClick={() => setSelected(new Set())} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
        <Table headers={['', 'Sender', 'Receiver', 'Message', 'Date', 'Actions']} loading={loading} empty={!loading && paginated.length === 0}>
          <TR>
            <TD><input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ accentColor: 'var(--primary)', width: 15, height: 15 }} /></TD>
            <TD colSpan={5} style={{ color: 'var(--text-muted)', fontSize: '0.75rem', padding: '0.4rem 1rem' }}>
              {messages.length} message{messages.length !== 1 ? 's' : ''} found
            </TD>
          </TR>
          {paginated.map(m => (
            <TR key={m.id} selected={selected.has(m.id)}>
              <TD><input type="checkbox" checked={selected.has(m.id)} onChange={() => toggleSelect(m.id)} style={{ accentColor: 'var(--primary)', width: 15, height: 15 }} /></TD>
              <TD>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserAvatar name={m.sender?.name || m.sender_name || '?'} size={26} />
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{m.sender?.name || m.sender_name || `#${m.sender_id}`}</span>
                </div>
              </TD>
              <TD>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserAvatar name={m.receiver?.name || m.receiver_name || '?'} size={26} />
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{m.receiver?.name || m.receiver_name || `#${m.receiver_id}`}</span>
                </div>
              </TD>
              <TD style={{ maxWidth: 280 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={m.message || m.content}>
                  {(m.message || m.content || '').slice(0, 80)}{(m.message || m.content || '').length > 80 ? '…' : ''}
                </span>
              </TD>
              <TD style={{ color: 'var(--text-muted)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                {m.created_at ? new Date(m.created_at).toLocaleString() : '—'}
              </TD>
              <TD>
                <IconBtn title="Delete" onClick={() => setDeleteModal(m)} danger>🗑️</IconBtn>
              </TD>
            </TR>
          ))}
        </Table>
        <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{messages.length} total</span>
          <Pagination page={page} total={messages.length} perPage={PER_PAGE} onChange={setPage} />
        </div>
      </div>

      {/* Delete single */}
      {deleteModal && (
        <Modal title="Delete Message" onClose={() => setDeleteModal(null)} width="400px">
          <p style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Delete this message permanently?</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>
            "{(deleteModal.message || deleteModal.content || '').slice(0, 100)}"
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button onClick={() => setDeleteModal(null)} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-muted)', fontWeight: 600 }}>Cancel</button>
            <button onClick={handleDelete} disabled={submitting} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: 'none', background: 'var(--error)', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? <><Spinner size={14} /> Deleting…</> : '🗑️ Delete'}
            </button>
          </div>
        </Modal>
      )}

      {/* Bulk delete */}
      {bulkDeleteModal && (
        <Modal title="Bulk Delete Messages" onClose={() => setBulkDeleteModal(false)} width="400px">
          <p style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Delete <strong style={{ color: 'var(--error)' }}>{selected.size} messages</strong> permanently?</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>This cannot be undone.</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button onClick={() => setBulkDeleteModal(false)} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-muted)', fontWeight: 600 }}>Cancel</button>
            <button onClick={handleBulkDelete} disabled={submitting} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: 'none', background: 'var(--error)', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? <><Spinner size={14} /> Deleting…</> : `🗑️ Delete ${selected.size}`}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORIES TAB
// ═══════════════════════════════════════════════════════════════════════════════
function StoriesTab({ addToast }) {
  const [stories, setStories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterUser, setFilterUser] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [deleteModal, setDeleteModal] = useState(null);
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchStories();
  }, [filterUser]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/admin/users');
      setUsers(Array.isArray(data) ? data : (data.data || []));
    } catch { /* silent */ }
  };

  const fetchStories = async () => {
    setLoading(true);
    setSelected(new Set());
    try {
      const { data } = await axios.get('/api/admin/stories', { params: filterUser ? { user_id: filterUser } : {} });
      setStories(Array.isArray(data) ? data : (data.data || []));
    } catch {
      addToast('Failed to load stories', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await axios.delete(`/api/admin/stories/${deleteModal.id}`);
      setStories(prev => prev.filter(s => s.id !== deleteModal.id));
      setDeleteModal(null);
      addToast('Story deleted', 'success');
    } catch {
      addToast('Failed to delete story', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkDelete = async () => {
    setSubmitting(true);
    try {
      await axios.post('/api/admin/stories/bulk-delete', { ids: Array.from(selected) });
      setStories(prev => prev.filter(s => !selected.has(s.id)));
      setSelected(new Set());
      setBulkDeleteModal(false);
      addToast(`${selected.size} stories deleted`, 'success');
    } catch {
      addToast('Bulk delete failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === stories.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(stories.map(s => s.id)));
    }
  };

  const isExpired = (expiresAt) => expiresAt && new Date(expiresAt) < new Date();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ minWidth: 200 }}>
          <select value={filterUser} onChange={e => setFilterUser(e.target.value)} style={{ padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-bright)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', appearance: 'none' }}>
            <option value="">All Users</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <button onClick={fetchStories} style={{ padding: '0.8rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <RefreshCcw size={18} /> Refresh
        </button>
        {selected.size > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', background: 'rgba(239,68,68,0.08)', borderRadius: '12px', border: '1px solid var(--error)' }}>
            <span style={{ color: 'var(--error)', fontWeight: 800, fontSize: '0.85rem' }}>{selected.size} selected</span>
            <button onClick={() => setBulkDeleteModal(true)} style={{ padding: '0.5rem 1rem', borderRadius: '10px', border: 'none', background: 'var(--error)', color: '#fff', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>
              <Trash2 size={16} /> Delete Selected
            </button>
            <button onClick={() => setSelected(new Set())} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>Cancel</button>
          </div>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input type="checkbox" id="selectAll" checked={stories.length > 0 && selected.size === stories.length} onChange={toggleAll} style={{ accentColor: 'var(--primary)', width: 18, height: 18, cursor: 'pointer' }} />
          <label htmlFor="selectAll" style={{ color: 'var(--text-bright)', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>Select All</label>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}><Spinner size={48} /></div>
      ) : stories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--text-muted)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
          <div style={{ width: 80, height: 80, borderRadius: '24px', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--text-muted)' }}>
            <BookOpen size={40} />
          </div>
          <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-bright)', marginBottom: '0.5rem' }}>No stories found</div>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Users haven't posted any stories yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {stories.map(s => {
            const expired = isExpired(s.expires_at);
            const sel = selected.has(s.id);
            return (
              <div key={s.id} style={{
                background: 'var(--bg-card)', border: `2px solid ${sel ? 'var(--primary)' : expired ? 'var(--error)' : 'var(--border)'}`,
                borderRadius: '24px', overflow: 'hidden', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: sel ? '0 12px 32px var(--primary-glow)' : '0 4px 24px rgba(0,0,0,0.1)',
                position: 'relative'
              }}
                onMouseEnter={e => { if (!sel) e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-6px)'; }}
                onMouseLeave={e => { if (!sel) e.currentTarget.style.borderColor = expired ? 'var(--error)' : 'var(--border)'; e.currentTarget.style.transform = ''; }}
              >
                {/* Story preview */}
                <div style={{ height: 160, background: s.media_url ? `url(${s.media_url}) center/cover` : 'linear-gradient(135deg, var(--primary), var(--secondary))', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {!s.media_url && (
                    <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, padding: '1.5rem', textAlign: 'center', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                      {(s.content || s.text || '').slice(0, 80)}
                    </div>
                  )}
                  {/* Selection Overlay */}
                  <div onClick={() => toggleSelect(s.id)} style={{ position: 'absolute', inset: 0, background: sel ? 'rgba(139,92,246,0.2)' : 'transparent', cursor: 'pointer' }} />
                  {/* Checkbox */}
                  <div onClick={(e) => { e.stopPropagation(); toggleSelect(s.id); }} style={{ position: 'absolute', top: 12, left: 12, width: 24, height: 24, borderRadius: '8px', background: sel ? 'var(--primary)' : 'rgba(0,0,0,0.4)', border: '2px solid ' + (sel ? 'var(--primary)' : 'rgba(255,255,255,0.8)'), display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', zIndex: 2 }}>
                    {sel && <Check size={16} strokeWidth={4} />}
                  </div>
                  {expired && (
                    <div style={{ position: 'absolute', top: 12, right: 12, padding: '0.3rem 0.75rem', borderRadius: '10px', background: 'var(--error)', color: '#fff', fontSize: '0.7rem', fontWeight: 900, boxShadow: '0 4px 12px rgba(239,68,68,0.4)', zIndex: 2 }}>EXPIRED</div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <UserAvatar name={s.user?.name || s.user_name || '?'} size={32} />
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-bright)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.user?.name || s.user_name || `User #${s.user_id}`}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={12} /> {s.created_at ? new Date(s.created_at).toLocaleDateString() : '—'}
                      </div>
                    </div>
                  </div>
                  
                  <button onClick={() => setDeleteModal(s)} style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)', color: 'var(--error)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--error)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.05)'; e.currentTarget.style.color = 'var(--error)'; }}
                  >
                    <Trash2 size={16} /> Delete Story
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete single */}
      {deleteModal && (
        <Modal title="Delete Story" onClose={() => setDeleteModal(null)} width="400px">
          <p style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Delete this story by <strong style={{ color: 'var(--text-bright)' }}>{deleteModal.user?.name || deleteModal.user_name || 'this user'}</strong>?</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>This action cannot be undone.</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button onClick={() => setDeleteModal(null)} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-muted)', fontWeight: 600 }}>Cancel</button>
            <button onClick={handleDelete} disabled={submitting} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: 'none', background: 'var(--error)', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? <><Spinner size={14} /> Deleting…</> : '🗑️ Delete'}
            </button>
          </div>
        </Modal>
      )}

      {/* Bulk delete */}
      {bulkDeleteModal && (
        <Modal title="Bulk Delete Stories" onClose={() => setBulkDeleteModal(false)} width="400px">
          <p style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Delete <strong style={{ color: 'var(--error)' }}>{selected.size} stories</strong> permanently?</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>This cannot be undone.</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button onClick={() => setBulkDeleteModal(false)} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-muted)', fontWeight: 600 }}>Cancel</button>
            <button onClick={handleBulkDelete} disabled={submitting} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: 'none', background: 'var(--error)', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? <><Spinner size={14} /> Deleting…</> : `🗑️ Delete ${selected.size}`}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS TAB
// ═══════════════════════════════════════════════════════════════════════════════
function SettingsTab({ addToast, maintenance, setMaintenance }) {
  const [storiesEnabled, setStoriesEnabled] = useState(() => localStorage.getItem('admin_stories_enabled') !== 'false');
  const [aiChatEnabled, setAiChatEnabled] = useState(() => localStorage.getItem('admin_ai_chat_enabled') !== 'false');
  const [announcement, setAnnouncement] = useState('');
  const [sending, setSending] = useState(false);
  const [updatingMaintenance, setUpdatingMaintenance] = useState(false);

  // New settings
  const [aiPrompt, setAiPrompt] = useState('');
  const [bannedWords, setBannedWords] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get('/api/admin/settings');
      if (data.maintenance_mode !== undefined) {
        const isMaint = data.maintenance_mode === 'true';
        setMaintenance(isMaint);
        localStorage.setItem('admin_maintenance', String(isMaint));
      }
      if (data.ai_prompt) setAiPrompt(data.ai_prompt);
      if (data.banned_words) setBannedWords(data.banned_words);
      if (data.welcome_message) setWelcomeMessage(data.welcome_message);
      if (data.smtp_host) setSmtpHost(data.smtp_host);
      if (data.smtp_port) setSmtpPort(data.smtp_port);
      if (data.smtp_user) setSmtpUser(data.smtp_user);
      if (data.smtp_pass) setSmtpPass(data.smtp_pass);
    } catch { /* silent */ }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('/api/admin/settings', {
        settings: {
          ai_prompt: aiPrompt,
          banned_words: bannedWords,
          welcome_message: welcomeMessage,
          smtp_host: smtpHost,
          smtp_port: smtpPort,
          smtp_user: smtpUser,
          smtp_pass: smtpPass
        }
      });
      addToast('General settings saved successfully', 'success');
    } catch {
      addToast('Failed to save settings', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = (key, value, setter) => {
    setter(value);
    localStorage.setItem(key, String(value));
    addToast(`Setting updated`, 'success');
  };

  const handleMaintenanceToggle = async () => {
    const next = !maintenance;
    setUpdatingMaintenance(true);
    try {
      await axios.post('/api/admin/settings', {
        settings: { maintenance_mode: String(next) }
      });
      setMaintenance(next);
      localStorage.setItem('admin_maintenance', String(next));
      addToast(`Maintenance mode ${next ? 'enabled' : 'disabled'}`, next ? 'info' : 'success');
    } catch {
      addToast('Failed to update maintenance mode', 'error');
    } finally {
      setUpdatingMaintenance(false);
    }
  };

  const sendAnnouncement = async () => {
    if (!announcement.trim()) return;
    setSending(true);
    try {
      await axios.post('/api/admin/announce', { message: announcement });
      addToast('Announcement sent to all users!', 'success');
      setAnnouncement('');
    } catch {
      addToast('Failed to send announcement', 'error');
    } finally {
      setSending(false);
    }
  };

  const resetAllSettings = () => {
    localStorage.removeItem('admin_stories_enabled');
    localStorage.removeItem('admin_ai_chat_enabled');
    localStorage.removeItem('admin_maintenance');
    setStoriesEnabled(true);
    setAiChatEnabled(true);
    setMaintenance(false);
    addToast('All settings reset to defaults', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 800 }}>
      
      {/* Configuration Form */}
      <form onSubmit={saveSettings} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: 'var(--text-bright)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Settings size={24} color="var(--primary)" /> Application Configuration
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>AI System Prompt</label>
            <textarea 
              value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
              placeholder="Define how the AI should behave..."
              rows={4} style={{ ...inputStyle, width: '100%', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Banned Words (Comma separated)</label>
            <input 
              value={bannedWords} onChange={e => setBannedWords(e.target.value)}
              placeholder="badword1, badword2..."
              style={{ ...inputStyle, width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Welcome Message</label>
            <input 
              value={welcomeMessage} onChange={e => setWelcomeMessage(e.target.value)}
              placeholder="Welcome to ChatReel!"
              style={{ ...inputStyle, width: '100%' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '1.25rem', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>📧 Email Server (SMTP)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '1rem', marginBottom: '1rem' }}>
              <input 
                value={smtpHost} onChange={e => setSmtpHost(e.target.value)}
                placeholder="SMTP Host (e.g. smtp.mailtrap.io)"
                style={{ ...inputStyle, width: '100%' }}
              />
              <input 
                value={smtpPort} onChange={e => setSmtpPort(e.target.value)}
                placeholder="Port"
                style={{ ...inputStyle, width: '100%' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input 
                value={smtpUser} onChange={e => setSmtpUser(e.target.value)}
                placeholder="SMTP Username"
                style={{ ...inputStyle, width: '100%' }}
              />
              <input 
                type="password"
                value={smtpPass} onChange={e => setSmtpPass(e.target.value)}
                placeholder="SMTP Password"
                style={{ ...inputStyle, width: '100%' }}
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={submitting}
          style={{ marginTop: '2rem', padding: '1rem 2rem', borderRadius: '14px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#fff', border: 'none', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 8px 20px var(--primary-glow)', opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? <Spinner size={20} /> : <><Check size={20} /> Save Configuration</>}
        </button>
      </form>

      {/* Announcement */}
      <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem' }}>
        <h3 style={{ color: 'var(--text-bright)', fontWeight: 800, marginBottom: '0.25rem', fontSize: '1rem' }}>📢 Broadcast Announcement</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Send a message to all users in the app.</p>
        <textarea
          value={announcement}
          onChange={e => setAnnouncement(e.target.value)}
          placeholder="Type your announcement here…"
          rows={4}
          style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-bright)', fontSize: '0.9rem', resize: 'vertical', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s' }}
          onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = ''; }}
        />
        <button
          onClick={sendAnnouncement}
          disabled={sending || !announcement.trim()}
          style={{
            marginTop: '0.85rem', padding: '0.75rem 1.5rem',
            borderRadius: '10px', border: 'none',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            color: '#fff', fontWeight: 700, fontSize: '0.9rem',
            opacity: (sending || !announcement.trim()) ? 0.6 : 1,
            cursor: (sending || !announcement.trim()) ? 'not-allowed' : 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          }}
        >
          {sending ? <><Spinner size={16} /> Sending…</> : '📣 Send to All Users'}
        </button>
      </section>

      {/* Feature Toggles */}
      <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem' }}>
        <h3 style={{ color: 'var(--text-bright)', fontWeight: 800, marginBottom: '0.25rem', fontSize: '1rem' }}>⚙️ Feature Toggles</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>Enable or disable global features. Settings are saved locally.</p>

        <Toggle
          checked={storiesEnabled}
          onChange={() => handleToggle('admin_stories_enabled', !storiesEnabled, setStoriesEnabled)}
          label="Stories Feature"
          description="Allow users to post and view stories"
        />
        <Toggle
          checked={aiChatEnabled}
          onChange={() => handleToggle('admin_ai_chat_enabled', !aiChatEnabled, setAiChatEnabled)}
          label="AI Chat Assistant"
          description="Enable the AI-powered chat assistant for users"
        />
        <Toggle
          checked={maintenance}
          onChange={handleMaintenanceToggle}
          label="Maintenance Mode"
          description="Completely lock the app for all regular users"
          loading={updatingMaintenance}
        />
      </section>

      {/* Danger Zone */}
      <section style={{ background: 'var(--bg-card)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '16px', padding: '1.5rem' }}>
        <h3 style={{ color: 'var(--error)', fontWeight: 800, marginBottom: '0.25rem', fontSize: '1rem' }}>⚠️ Danger Zone</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>Reset all admin settings to their default values.</p>
        <button
          onClick={resetAllSettings}
          style={{
            padding: '0.75rem 1.5rem', borderRadius: '10px',
            border: '1px solid var(--error)', background: 'rgba(239,68,68,0.08)',
            color: 'var(--error)', fontWeight: 700, fontSize: '0.9rem',
            cursor: 'pointer', transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
        >
          🔄 Reset All Settings
        </button>
      </section>

      {/* Info */}
      <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem' }}>
        <h3 style={{ color: 'var(--text-bright)', fontWeight: 800, marginBottom: '1rem', fontSize: '1rem' }}>ℹ️ Current Status</h3>
        {[
          { label: 'Stories', value: storiesEnabled ? '✅ Enabled' : '❌ Disabled', color: storiesEnabled ? 'var(--success)' : 'var(--error)' },
          { label: 'AI Chat', value: aiChatEnabled ? '✅ Enabled' : '❌ Disabled', color: aiChatEnabled ? 'var(--success)' : 'var(--error)' },
          { label: 'Maintenance Mode', value: maintenance ? '🔧 Active' : '✅ Inactive', color: maintenance ? 'var(--warning)' : 'var(--success)' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{item.label}</span>
            <span style={{ color: item.color, fontWeight: 700 }}>{item.value}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
