import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Palette, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AppPreferences = () => {
  const { user, updatePreferences } = useAuth();
  const [formData, setFormData] = useState({
    notificationsEnabled: user?.notifications_enabled ?? true,
    twoFactorEnabled: user?.two_factor_enabled ?? false
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        notificationsEnabled: user.notifications_enabled ?? true,
        twoFactorEnabled: user.two_factor_enabled ?? false
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await updatePreferences(formData);
      setStatus({ type: 'success', message: 'Preferences saved successfully!' });
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (error) {
      console.error('Error updating preferences:', error);
      setStatus({ type: 'error', message: 'Failed to save preferences. Please try again.' });
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-10">
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Application Preferences</h2>
          <p className="text-slate-400 text-sm mt-1">Customize your app experience</p>
        </div>

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
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Bell className="text-amber-600" size={20} />
                  <div>
                    <div className="font-medium text-slate-800">Notifications</div>
                    <div className="text-sm text-slate-500">Receive push notifications</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData(prev => ({ ...prev, notificationsEnabled: !prev.notificationsEnabled }))
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    formData.notificationsEnabled ? 'bg-amber-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                      formData.notificationsEnabled ? 'left-6' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Palette className="text-amber-600" size={20} />
                  <div>
                    <div className="font-medium text-slate-800">Two-Factor Authentication</div>
                    <div className="text-sm text-slate-500">Add an extra layer of security</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    formData.twoFactorEnabled ? 'bg-amber-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                      formData.twoFactorEnabled ? 'left-6' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

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
                    Save Preferences
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

export default AppPreferences;
