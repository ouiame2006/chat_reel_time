import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Camera,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MyProfile = () => {
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
  );
};

export default MyProfile;
