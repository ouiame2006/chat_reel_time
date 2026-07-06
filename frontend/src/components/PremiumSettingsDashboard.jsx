import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Settings,
  User,
  Shield,
  Bell,
  Palette,
  ChevronLeft,
  Camera,
  Save,
  LogOut,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PremiumSettingsDashboard = ({ onBack }) => {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);

  // Form state with real user data
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(
    user?.avatar ? `http://127.0.0.1:8000/${user.avatar}` : null
  );
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || ''
      });
      setProfilePhoto(user.avatar ? `http://127.0.0.1:8000/${user.avatar}` : null);
    }
  }, [user]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handle profile photo upload
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setStatus({ type: 'error', message: 'File size must be less than 2MB' });
        setTimeout(() => setStatus({ type: '', message: '' }), 3000);
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhoto(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save changes
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.fullName.trim());
      if (formData.username) formDataToSend.append('username', formData.username.trim());
      if (formData.bio) formDataToSend.append('bio', formData.bio.trim());
      if (selectedFile) formDataToSend.append('avatar', selectedFile);

      await updateProfile(formDataToSend);
      setStatus({ type: 'success', message: 'Profile saved successfully!' });
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setStatus({ type: 'error', message: 'Failed to update profile. Please try again.' });
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white w-full">
      {/* Main Navigation Sidebar (Far Left) */}
      <div className="w-20 bg-slate-50 border-r border-slate-100 flex flex-col items-center py-8 gap-6">
        <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center text-white font-bold">
          O
        </div>

        <nav className="flex flex-col gap-4 flex-1">
          {[
            { id: 'dashboard', icon: User, label: 'Dashboard' },
            { id: 'settings', icon: Settings, label: 'Settings' },
            { id: 'security', icon: Shield, label: 'Security' },
            { id: 'notifications', icon: Bell, label: 'Notifications' },
            { id: 'appearance', icon: Palette, label: 'Appearance' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => item.id === 'settings' && null}
              className={`relative p-3 rounded-2xl transition-all duration-300 group ${
                item.id === 'settings'
                  ? 'bg-amber-50 text-amber-600 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              <item.icon size={22} strokeWidth={1.75} />
              <span className="absolute left-24 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <button className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all duration-300">
          <LogOut size={22} strokeWidth={1.75} />
        </button>
      </div>

      {/* Settings Sub-Sidebar (Left Inner Panel) */}
      <div className="w-72 bg-white border-r border-slate-100 py-8 px-6">
        <div className="mb-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors mb-4"
          >
            <ChevronLeft size={18} />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your account preferences</p>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'profile', label: 'My Profile', icon: User },
            { id: 'security', label: 'Account Security', icon: Shield },
            { id: 'preferences', label: 'Application Preferences', icon: Palette }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {}}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                tab.id === 'profile'
                  ? 'bg-gradient-to-r from-amber-50 to-amber-100/50 text-slate-800 font-semibold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <tab.icon
                size={20}
                strokeWidth={1.75}
                className={tab.id === 'profile' ? 'text-amber-600' : ''}
              />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area (Right Panel) */}
      <div className="flex-1 bg-slate-50 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-12 px-10">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Profile Information</h2>
              <p className="text-slate-400 text-sm mt-1">Update your personal details and profile photo</p>
            </div>

            {/* Status Notification */}
            <AnimatePresence>
              {status.message && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                    status.type === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-100'
                      : 'bg-red-50 text-red-700 border border-red-100'
                  }`}
                >
                  {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  <span className="text-sm font-medium">{status.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
              <form onSubmit={handleSave} className="space-y-8">
                {/* Profile Photo Section */}
                <div className="flex items-center gap-8">
                  <div className="relative">
                    <div
                      onClick={handlePhotoClick}
                      className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-1 cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                        {profilePhoto ? (
                          <img
                            src={profilePhoto}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 text-3xl font-bold">
                            {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'U'}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handlePhotoClick}
                      className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-500 hover:text-amber-600 hover:border-amber-200 transition-all"
                    >
                      <Camera size={18} strokeWidth={1.75} />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Profile Photo</h3>
                    <p className="text-slate-400 text-sm mt-1">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium text-slate-700">Full Name</label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-3.5 bg-white border rounded-xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:border-amber-400 transition-all ${
                        errors.fullName ? 'border-rose-400 focus:ring-rose-400/20' : 'border-slate-200 focus:ring-amber-500/20'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-rose-500 text-xs">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium text-slate-700">Username</label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Choose a unique username"
                      className={`w-full px-4 py-3.5 bg-white border rounded-xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:border-amber-400 transition-all ${
                        errors.username ? 'border-rose-400 focus:ring-rose-400/20' : 'border-slate-200 focus:ring-amber-500/20'
                      }`}
                    />
                    {errors.username && (
                      <p className="text-rose-500 text-xs">{errors.username}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="bio" className="text-sm font-medium text-slate-700">Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us a little about yourself..."
                      className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 mt-10 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={onBack}
                    disabled={loading}
                    className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-semibold rounded-xl shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/25 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} strokeWidth={1.75} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} strokeWidth={1.75} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumSettingsDashboard;
