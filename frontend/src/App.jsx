import React from 'react'
import './App.css'
import { useAuth } from './context/AuthContext'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import OuinoChat from './components/OuinoChat'

function App() {
  const { user, loading } = useAuth()
  const [view, setView] = React.useState('login')
  const [showOuinoChat, setShowOuinoChat] = React.useState(false)

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (showOuinoChat) {
    return <OuinoChat />
  }

  if (user) {
    return (
      <div>
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setShowOuinoChat(!showOuinoChat)}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Test OuinoChat
          </button>
        </div>
        <Dashboard />
      </div>
    )
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
