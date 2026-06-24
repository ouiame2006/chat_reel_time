import React from 'react'
import './App.css'
import { useAuth } from './context/AuthContext'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import PremiumSettingsDashboard from './components/PremiumSettingsDashboard'

function App() {
  const { user, loading } = useAuth()
  const [view, setView] = React.useState('login')
  const [showSettingsDashboard, setShowSettingsDashboard] = React.useState(false)

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (showSettingsDashboard) {
    return <PremiumSettingsDashboard onBack={() => setShowSettingsDashboard(false)} />
  }

  if (user) {
    return <Dashboard onOpenSettings={() => setShowSettingsDashboard(true)} />
  }

  return (
    <div className="w-full h-screen">
      {view === 'login' ? (
        <Login setView={setView} />
      ) : (
        <Signup setView={setView} />
      )}
    </div>
  )
}

export default App
