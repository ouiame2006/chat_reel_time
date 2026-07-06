import React from 'react'
import './App.css'
import { useAuth } from './context/AuthContext'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import SettingsLayout from './components/settings/SettingsLayout'
import MyProfile from './components/settings/MyProfile'
import AccountSecurity from './components/settings/AccountSecurity'
import AppPreferences from './components/settings/AppPreferences'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" replace /> : <AuthWrapper type="login" />} 
        />
        <Route 
          path="/signup" 
          element={user ? <Navigate to="/" replace /> : <AuthWrapper type="signup" />} 
        />

        {/* Protected Routes */}
        <Route 
          path="/" 
          element={user ? <DashboardWrapper /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/settings" 
          element={user ? <SettingsLayout /> : <Navigate to="/login" replace />} 
        >
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="security" element={<AccountSecurity />} />
          <Route path="preferences" element={<AppPreferences />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function AuthWrapper({ type }) {
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen">
      {type === 'login' ? (
        <Login setView={(v) => navigate(v === 'login' ? '/login' : '/signup')} />
      ) : (
        <Signup setView={(v) => navigate(v === 'login' ? '/login' : '/signup')} />
      )}
    </div>
  );
}

function DashboardWrapper() {
  const navigate = useNavigate();
  return <Dashboard onOpenSettings={() => navigate('/settings')} />;
}

export default App
