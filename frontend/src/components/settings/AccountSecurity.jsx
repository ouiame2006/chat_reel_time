import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Shield, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AccountSecurity = () => {
  const { updatePassword } = useAuth();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.oldPassword) newErrors.oldPassword = 'Current password is required';
    if (!formData.newPassword) newErrors.newPassword = 'New password is required';
    if (formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await updatePassword(formData);
      setStatus({ type: 'success', message: 'Password updated successfully!' });
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (error) {
      console.error('Error updating password:', error);
      setStatus({ type: 'error', message: 'Failed to update password. Please try again.' });
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-10">
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Account Security</h2>
          <p className="text-slate-400 text-sm mt-1">Manage your password and security settings</p>
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
              <div className="space-y-2">
                <label htmlFor="oldPassword" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Lock size={16} /> Current Password
                </label>
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3.5 bg-white border rounded-xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:border-amber-400 transition-all ${
                    errors.oldPassword ? 'border-rose-400 focus:ring-rose-400/20' : 'border-slate-200 focus:ring-amber-500/20'
                  }`}
                />
                {errors.oldPassword && (
                  <p className="text-rose-500 text-xs">{errors.oldPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Shield size={16} /> New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3.5 bg-white border rounded-xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:border-amber-400 transition-all ${
                    errors.newPassword ? 'border-rose-400 focus:ring-rose-400/20' : 'border-slate-200 focus:ring-amber-500/20'
                  }`}
                />
                {errors.newPassword && (
                  <p className="text-rose-500 text-xs">{errors.newPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Lock size={16} /> Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3.5 bg-white border rounded-xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:border-amber-400 transition-all ${
                    errors.confirmPassword ? 'border-rose-400 focus:ring-rose-400/20' : 'border-slate-200 focus:ring-amber-500/20'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-rose-500 text-xs">{errors.confirmPassword}</p>
                )}
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
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={18} strokeWidth={1.75} />
                    Update Password
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

export default AccountSecurity;
