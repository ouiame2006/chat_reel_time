import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  Clock, 
  X, 
  Image, 
  Video, 
  Music,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';

const Stories = ({ user }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newStoryContent, setNewStoryContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [viewingStory, setViewingStory] = useState(null);
  const [viewingIndex, setViewingIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const storyTimerRef = useRef(null);
  const fileInputRef = useRef(null);

  const comingSoon = (feature) => {
    alert(`${feature} feature coming soon! 🚀`);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    if (viewingStory !== null) {
      setStoryProgress(0);
      storyTimerRef.current = setInterval(() => {
        setStoryProgress(prev => {
          if (prev >= 100) {
            handleNextStory();
            return 0;
          }
          return prev + 2; // 5 seconds per story (100/2 = 50 steps * 100ms = 5s)
        });
      }, 100);

      return () => clearInterval(storyTimerRef.current);
    }
  }, [viewingStory, viewingIndex]);

  const fetchStories = async () => {
    try {
      const response = await axios.get('/api/stories');
      setStories(response.data.map(s => ({
        ...s,
        type: s.type || 'text'
      })));
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const preview = URL.createObjectURL(file);
      setFilePreview(preview);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileType = (file) => {
    if (file?.type?.startsWith('image/')) return 'image';
    if (file?.type?.startsWith('video/')) return 'video';
    return 'text';
  };

  const handlePostStory = async (e) => {
    e.preventDefault();
    if (!newStoryContent.trim() && !selectedFile) return;

    setIsPosting(true);
    try {
      const newStory = {
        id: Date.now(),
        user: user,
        content: newStoryContent,
        type: selectedFile ? getFileType(selectedFile) : 'text',
        file_url: filePreview,
        file_name: selectedFile?.name,
        file_type: selectedFile?.type,
        created_at: new Date().toISOString()
      };
      
      setStories([newStory, ...stories]);
      setNewStoryContent('');
      setSelectedFile(null);
      setFilePreview(null);
    } catch (error) {
      console.error('Error posting story:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const openStoryViewer = (index) => {
    setViewingIndex(index);
    setViewingStory(stories[index]);
  };

  const closeStoryViewer = () => {
    setViewingStory(null);
    setViewingIndex(0);
  };

  const handleNextStory = () => {
    if (viewingIndex < stories.length - 1) {
      setViewingIndex(prev => prev + 1);
      setViewingStory(stories[viewingIndex + 1]);
    } else {
      closeStoryViewer();
    }
  };

  const handlePrevStory = () => {
    if (viewingIndex > 0) {
      setViewingIndex(prev => prev - 1);
      setViewingStory(stories[viewingIndex - 1]);
    }
  };

  const deleteStory = (storyId) => {
    if (confirm('Delete this story?')) {
      setStories(prev => prev.filter(s => s.id !== storyId));
    }
  };

  if (viewingStory !== null) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        background: '#000', 
        zIndex: 9999, 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <div style={{ 
          position: 'absolute', 
          top: '2rem', 
          left: '2rem', 
          right: '2rem', 
          display: 'flex', 
          gap: '0.5rem', 
          zIndex: 10 
        }}>
          {stories.map((_, i) => (
            <div key={i} style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', 
                background: 'white', 
                width: `${i < viewingIndex ? 100 : i === viewingIndex ? storyProgress : 0}%`,
                transition: 'width 0.1s linear'
              }}></div>
            </div>
          ))}
        </div>

        <div style={{ 
          position: 'absolute', 
          top: '4rem', 
          left: '2rem', 
          right: '2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          zIndex: 10 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'white' }}>
            <div className="avatar" style={{ width: '44px', height: '44px', border: '2px solid white' }}>
              {viewingStory.user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{viewingStory.user?.name}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                {new Date(viewingStory.created_at).toLocaleTimeString()}
              </div>
            </div>
          </div>
          <button onClick={closeStoryViewer} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={28} />
          </button>
        </div>

        <div style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          position: 'relative' 
        }}>
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            display: 'flex' 
          }}>
            <div style={{ flex: 1, cursor: 'pointer' }} onClick={handlePrevStory}></div>
            <div style={{ flex: 1, cursor: 'pointer' }} onClick={handleNextStory}></div>
          </div>

          {viewingStory.type === 'image' && viewingStory.file_url && (
            <img src={viewingStory.file_url} alt="Story" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          )}
          
          {viewingStory.type === 'video' && viewingStory.file_url && (
            <video src={viewingStory.file_url} controls autoPlay style={{ maxWidth: '100%', maxHeight: '100%' }} />
          )}

          {viewingStory.type === 'text' && (
            <div style={{ 
              maxWidth: '600px', 
              padding: '3rem', 
              textAlign: 'center', 
              color: 'white',
              fontSize: '2rem',
              fontWeight: 700
            }}>
              {viewingStory.content}
            </div>
          )}
        </div>

        <div style={{ 
          position: 'absolute', 
          bottom: '2rem', 
          left: 0, 
          right: 0, 
          padding: '0 2rem' 
        }}>
          {viewingStory.content && viewingStory.type !== 'text' && (
            <div style={{ 
              color: 'white', 
              background: 'rgba(0,0,0,0.5)', 
              padding: '1rem 1.5rem', 
              borderRadius: '1rem',
              marginBottom: '1rem'
            }}>
              {viewingStory.content}
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Reply to story..." 
              style={{ flex: 1, background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '1rem 1.5rem', borderRadius: '2rem' }} 
            />
            <button style={{ 
              background: 'var(--primary)', 
              border: 'none', 
              color: 'white', 
              padding: '1rem 1.5rem', 
              borderRadius: '2rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}>
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in glass" style={{ flex: 1, borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <header style={{ padding: '1.5rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-bright)' }}>Stories</h1>
            <div style={{ position: 'relative' }}>
               <input 
                 type="text" 
                 placeholder="Search stories..." 
                 onClick={() => comingSoon('Story Search')}
                 style={{ width: '260px', paddingLeft: '2.5rem', height: '40px' }} 
               />
               <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                 <Search size={18} />
               </span>
            </div>
         </div>
         <span style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => comingSoon('Story Notifications')}>
           <Bell size={20} />
         </span>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '2.5rem' }}>
         <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2.5rem', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-bright)', marginBottom: '1rem' }}>Create New Story</h3>
            
            {!filePreview && (
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/*,video/*" 
                  style={{ display: 'none' }} 
                  onChange={handleFileSelect} 
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()} 
                  className="btn-secondary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Image size={18} /> Add Image
                </button>
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()} 
                  className="btn-secondary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Video size={18} /> Add Video
                </button>
                <button 
                  type="button" 
                  onClick={() => comingSoon('Music Stories')} 
                  className="btn-secondary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Music size={18} /> Add Music
                </button>
              </div>
            )}

            {filePreview && (
              <div style={{ 
                marginBottom: '1rem', 
                padding: '1rem', 
                background: 'var(--bg-input)', 
                borderRadius: 'var(--radius-md)',
                position: 'relative'
              }}>
                {selectedFile?.type?.startsWith('image/') && (
                  <img src={filePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '0.75rem' }} />
                )}
                {selectedFile?.type?.startsWith('video/') && (
                  <video src={filePreview} controls style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '0.75rem' }} />
                )}
                <button 
                  onClick={removeFile} 
                  style={{ 
                    position: 'absolute', 
                    top: '1rem', 
                    right: '1rem', 
                    background: 'var(--bg-card)', 
                    border: 'none', 
                    borderRadius: '50%', 
                    width: '28px', 
                    height: '28px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    cursor: 'pointer' 
                  }}>
                  <X size={16} />
                </button>
              </div>
            )}

            <form onSubmit={handlePostStory} style={{ display: 'flex', gap: '1rem' }}>
               <input 
                 type="text" 
                 placeholder="Add a caption or write something..." 
                 value={newStoryContent}
                 onChange={(e) => setNewStoryContent(e.target.value)}
                 disabled={isPosting}
                 style={{ flex: 1 }}
               />
               <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0 1.5rem' }} disabled={isPosting}>
                 {isPosting ? 'Posting...' : 'Post Story'}
               </button>
            </form>
         </div>

         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-bright)' }}>Recent Stories</h3>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', cursor: 'pointer' }} onClick={() => comingSoon('All Stories')}>View All</span>
         </div>

         <div className="stories-strip" style={{ marginBottom: '3rem', display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
            <div style={{ textAlign: 'center', minWidth: '85px', flexShrink: 0, cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
               <div style={{ position: 'relative', width: '72px', height: '72px', margin: '0 auto 0.75rem auto' }}>
                  <div className="avatar" style={{ width: '100%', height: '100%', border: '2px solid var(--primary)', padding: '2px' }}>
                     {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: '22px', height: '22px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: '2px solid var(--bg-card)' }}>
                     <Plus size={14} strokeWidth={3} />
                  </div>
               </div>
               <p style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Add Story</p>
            </div>

            {stories.map((s, i) => (
              <div key={s.id} style={{ textAlign: 'center', minWidth: '85px', position: 'relative' }}>
                 <div style={{ 
                    width: '72px', 
                    height: '72px', 
                    borderRadius: '22px', 
                    padding: '3px', 
                    border: '2px solid var(--primary)',
                    margin: '0 auto 0.75rem auto',
                    boxShadow: '0 4px 12px var(--primary-glow)',
                    cursor: 'pointer',
                    overflow: 'hidden'
                 }}>
                    {s.type === 'image' && s.file_url ? (
                      <img 
                        src={s.file_url} 
                        alt={s.user?.name} 
                        style={{ width: '100%', height: '100%', borderRadius: '18px', objectFit: 'cover' }}
                        onClick={() => openStoryViewer(i)}
                      />
                    ) : (
                      <div 
                        className="avatar" 
                        style={{ width: '100%', height: '100%', borderRadius: '18px', fontSize: '1.5rem' }}
                        onClick={() => openStoryViewer(i)}
                      >
                        {s.user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                 </div>
                 <p style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-bright)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.user?.name?.split(' ')[0]}
                 </p>
                 
                 {s.user?.id === user.id && (
                   <button 
                     onClick={() => deleteStory(s.id)}
                     style={{ 
                       position: 'absolute', 
                       top: 0, 
                       right: 0, 
                       background: 'var(--error)', 
                       border: 'none', 
                       borderRadius: '50%', 
                       width: '20px', 
                       height: '20px', 
                       display: 'flex', 
                       alignItems: 'center', 
                       justifyContent: 'center', 
                       cursor: 'pointer',
                       fontSize: '12px'
                     }}>
                     <X size={12} />
                   </button>
                 )}
              </div>
            ))}
         </div>

         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {stories.map((s, i) => (
              <div key={s.id} className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div className="avatar" style={{ width: '44px', height: '44px', borderRadius: '14px' }}>
                       {s.user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div style={{ flex: 1 }}>
                       <h4 style={{ fontSize: '1rem', color: 'var(--text-bright)' }}>{s.user?.name}</h4>
                       <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </p>
                    </div>
                    {s.user?.id === user.id && (
                      <button onClick={() => deleteStory(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <X size={18} />
                      </button>
                    )}
                 </div>
                 
                 {s.type === 'image' && s.file_url && (
                   <img 
                     src={s.file_url} 
                     alt="Story" 
                     style={{ width: '100%', borderRadius: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }}
                     onClick={() => openStoryViewer(i)}
                   />
                 )}
                 
                 {s.type === 'video' && s.file_url && (
                   <video 
                     src={s.file_url} 
                     controls 
                     style={{ width: '100%', borderRadius: '0.75rem', marginBottom: '1rem' }}
                   />
                 )}
                 
                 {s.content && (
                   <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-main)' }}>{s.content}</p>
                 )}
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Stories;
