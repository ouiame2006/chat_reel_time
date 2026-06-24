
import React, { useState } from 'react';
import { Camera, Pencil, Check, Lock, ChevronLeft, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const LuxuryProfileSettings = ({ onBack }) => {
  const { user, updateProfile } = useAuth();
  
  // Editable state
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState(user?.bio || '');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar ? `http://127.0.0.1:8000/${user.avatar}` : null
  );

  const maxNameChars = 25;
  const maxBioChars = 500;

  const handleSaveName = async () => {
    if (name.trim().length === 0) return;
    setLoading(true);
    try {
      await updateProfile({ name: name.trim() });
      setEditingName(false);
      setStatus({ type: 'success', message: 'Name updated successfully' });
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (error) {
      console.error('Error updating name:', error);
      setStatus({ type: 'error', message: 'Failed to update name' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBio = async () => {
    setLoading(true);
    try {
      await updateProfile({ bio: bio.trim() });
      setEditingBio(false);
      setStatus({ type: 'success', message: 'About updated successfully' });
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (error) {
      console.error('Error updating bio:', error);
      setStatus({ type: 'error', message: 'Failed to update about' });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        setAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarPreview(reader.result);
        };
        reader.readAsDataURL(file);
        
        // Upload immediately
        setLoading(true);
        try {
          const formData = new FormData();
          formData.append('name', user.name);
          formData.append('bio', user.bio || '');
          formData.append('avatar', file);
          await updateProfile(formData);
          setStatus({ type: 'success', message: 'Profile photo updated' });
          setTimeout(() => setStatus({ type: '', message: '' }), 3000);
        } catch (error) {
          console.error('Error updating avatar:', error);
          setStatus({ type: 'error', message: 'Failed to update photo' });
        } finally {
          setLoading(false);
        }
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 bg-white border-b border-gray-100 shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Status Message */}
        <AnimatePresence>
          {status.message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mx-6 mt-4 px-4 py-3 rounded-lg flex items-center gap-3 ${
                status.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-100' 
                  : 'bg-red-50 text-red-700 border border-red-100'
              }`}
            >
              {status.type === 'success' ? <Check size={18} /> : <Info size={18} />}
              <span className="text-sm font-medium">{status.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-2xl mx-auto px-6 py-8">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-12">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <div className="w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex flex-col items-center gap-1 text-white">
                  <Camera size={36} className="drop-shadow-lg" />
                  <span className="text-sm font-medium drop-shadow-md">Change photo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Your Name Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-50">
              <span className="text-xs font-medium text-blue-900 uppercase tracking-wider">Your Name</span>
            </div>
            <div className="px-6 py-4">
              {editingName ? (
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={maxNameChars}
                      className="w-full text-gray-900 text-base bg-transparent outline-none border-none"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveName();
                        if (e.key === 'Escape') {
                          setName(user?.name || '');
                          setEditingName(false);
                        }
                      }}
                    />
                    <div className="flex justify-end mt-1">
                      <span className={`text-xs font-medium ${
                        name.length === maxNameChars ? 'text-amber-600' : 'text-gray-400'
                      }`}>
                        {name.length}/{maxNameChars}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleSaveName}
                    disabled={loading || name.trim().length === 0}
                    className="p-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Check size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between group">
                  <span className="text-gray-900 text-base">{user?.name || 'Add your name'}</span>
                  <button
                    onClick={() => setEditingName(true)}
                    className="p-2 text-gray-400 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-all"
                    title="Edit name"
                  >
                    <Pencil size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* About / Bio Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-50">
              <span className="text-xs font-medium text-blue-900 uppercase tracking-wider">About</span>
            </div>
            <div className="px-6 py-4">
              {editingBio ? (
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      maxLength={maxBioChars}
                      rows={3}
                      className="w-full text-gray-900 text-base bg-transparent outline-none border-none resize-none"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSaveBio();
                        }
                        if (e.key === 'Escape') {
                          setBio(user?.bio || '');
                          setEditingBio(false);
                        }
                      }}
                    />
                    <div className="flex justify-end mt-1">
                      <span className={`text-xs font-medium ${
                        bio.length === maxBioChars ? 'text-amber-600' : 'text-gray-400'
                      }`}>
                        {bio.length}/{maxBioChars}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleSaveBio}
                    disabled={loading}
                    className="p-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Check size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-start justify-between group">
                  <span className="text-gray-900 text-base">
                    {user?.bio || 'Hey there! I am using ChatReel'}
                  </span>
                  <button
                    onClick={() => setEditingBio(true)}
                    className="p-2 text-gray-400 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-all ml-3 flex-shrink-0"
                    title="Edit about"
                  >
                    <Pencil size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Phone Number Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-50">
              <span className="text-xs font-medium text-blue-900 uppercase tracking-wider">Phone Number</span>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-gray-900 text-base">
                    {user?.phone || 'Not set'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock size={16} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuxuryProfileSettings;
