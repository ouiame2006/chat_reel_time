import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Settings,
  User,
  Shield,
  Bell,
  Palette,
  ChevronLeft,
  LogOut
} from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const SettingsLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-white w-full">
      {/* Main Navigation Sidebar (Far Left) */}
      <div className="w-20 bg-slate-50 border-r border-slate-100 flex flex-col items-center py-8 gap-6">
        <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center text-white font-bold">
          O
        </div>

        <nav className="flex flex-col gap-4 flex-1">
          {[
            { id: 'dashboard', icon: User, label: 'Dashboard', path: '/' },
            { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => item.path && navigate(item.path)}
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

        <button
          onClick={logout}
          className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all duration-300"
        >
          <LogOut size={22} strokeWidth={1.75} />
        </button>
      </div>

      {/* Settings Sub-Sidebar (Left Inner Panel) */}
      <div className="w-72 bg-white border-r border-slate-100 py-8 px-6">
        <div className="mb-10">
          <button
            onClick={() => navigate('/')}
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
            { id: 'profile', label: 'My Profile', icon: User, path: '/settings/profile' },
            { id: 'security', label: 'Account Security', icon: Shield, path: '/settings/security' },
            { id: 'preferences', label: 'Application Preferences', icon: Palette, path: '/settings/preferences' }
          ].map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.path}
              end={tab.id === 'profile'}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-50 to-amber-100/50 text-slate-800 font-semibold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <tab.icon
                    size={20}
                    strokeWidth={1.75}
                    className={isActive ? 'text-amber-600' : ''}
                  />
                  <span className="text-sm">{tab.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content Area (Right Panel) */}
      <div className="flex-1 bg-slate-50 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsLayout;
