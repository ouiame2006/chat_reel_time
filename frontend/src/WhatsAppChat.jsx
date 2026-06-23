import React, { useState } from 'react';

// Mock data
const mockConversations = [
  { id: 1, user: { id: 101, name: 'Ahmed Benali', avatar: 'AB', isOnline: true }, lastMessage: 'Hi, how are you?', time: '10:30 AM', unread: 3 },
  { id: 2, user: { id: 102, name: 'Sara', avatar: 'S', isOnline: false }, lastMessage: 'Can you send me the file?', time: '9:15 AM', unread: 0 },
  { id: 3, user: { id: 103, name: 'Design Team', avatar: 'DT', isOnline: true, isGroup: true }, lastMessage: 'Meeting tomorrow at 2 PM', time: 'Yesterday', unread: 1 },
];

const mockMessages = [
  { id: 1, senderId: 101, text: 'Hey there! 👋', time: '10:00 AM', isRead: true },
  { id: 2, senderId: 'me', text: 'Hi Ahmed! How are you doing today?', time: '10:02 AM', isRead: true },
  { id: 3, senderId: 101, text: 'Great, thanks! Working on the new design.', time: '10:05 AM', isRead: true },
  { id: 4, senderId: 'me', text: 'Nice! Can you share it when you\'re done?', time: '10:06 AM', isRead: true },
  { id: 5, senderId: 101, text: 'Sure, will do in 30 minutes!', time: '10:07 AM', isRead: true },
];

const WhatsAppChat = () => {
  const [currentScreen, setCurrentScreen] = useState('login'); // login, chatList, chatWindow, groupInfo, emptySearch
  const [authTab, setAuthTab] = useState('login'); // login, signup
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="w-full max-w-md mx-auto bg-white min-h-screen">
      {/* SCREEN 1: LOGIN / REGISTER */}
      {currentScreen === 'login' && (
        <div className="bg-gradient-to-b from-green-500 to-green-600 min-h-screen flex flex-col items-center justify-center px-6 py-8">
          <h1 className="text-4xl font-bold text-white mb-10">ChatApp</h1>
          
          {/* Tabs */}
          <div className="flex bg-white/20 rounded-lg p-1 mb-6 w-full max-w-sm">
            <button
              className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${authTab === 'login' ? 'bg-white text-green-600 shadow-sm' : 'text-white'}`}
              onClick={() => setAuthTab('login')}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${authTab === 'signup' ? 'bg-white text-green-600 shadow-sm' : 'text-white'}`}
              onClick={() => setAuthTab('signup')}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
            {authTab === 'login' ? (
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentScreen('chatList')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  Login
                </button>
                <p className="text-center text-green-600 font-medium cursor-pointer mt-4">
                  Forgot password?
                </p>
              </form>
            ) : (
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Ahmed Benali"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentScreen('chatList')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  Create Account
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SCREEN 2: CHAT LIST */}
      {currentScreen === 'chatList' && (
        <div className="bg-gray-100 min-h-screen flex flex-col">
          {/* Header */}
          <div className="bg-green-500 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-700">
                Me
              </div>
              <h1 className="text-xl font-bold">ChatApp</h1>
            </div>
            <button className="p-2">
              ⚙️
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-3 py-2">
            <div className="bg-white rounded-xl flex items-center gap-2 px-4 py-2">
              🔍
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length > 0) setCurrentScreen('emptySearch');
                }}
                className="flex-1 outline-none text-gray-700"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {mockConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  setSelectedConversation(conv);
                  setCurrentScreen('chatWindow');
                }}
                className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                    {conv.user.avatar}
                  </div>
                  {conv.user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-800 truncate">{conv.user.name}</h3>
                    <span className="text-xs text-gray-500">{conv.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                      <span className="ml-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Action Button */}
          <div className="absolute bottom-6 right-6">
            <button className="w-14 h-14 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-colors">
              <span className="text-2xl">+</span>
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 3: CHAT WINDOW */}
      {currentScreen === 'chatWindow' && selectedConversation && (
        <div className="bg-gray-50 min-h-screen flex flex-col">
          {/* Header */}
          <div className="bg-green-500 text-white px-3 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentScreen('chatList')} className="p-1">
                ←
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                {selectedConversation.user.avatar}
              </div>
              <div>
                <h2 className="font-semibold">{selectedConversation.user.name}</h2>
                <p className="text-xs opacity-90">
                  {selectedConversation.user.isOnline ? 'Online' : 'Last seen 5 min ago'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCurrentScreen('groupInfo')} className="p-1">
                ⋮
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
            {/* Date Separator */}
            <div className="flex justify-center">
              <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-600 shadow-sm">
                Yesterday
              </span>
            </div>

            {/* Messages */}
            {mockMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-lg px-3 py-2 ${msg.senderId === 'me' ? 'bg-green-100 rounded-tr-none' : 'bg-white rounded-tl-none shadow-sm'}`}>
                  <p className="text-gray-800">{msg.text}</p>
                  <div className={`flex items-center gap-1 justify-end mt-1 ${msg.senderId === 'me' ? '' : 'hidden'}`}>
                    <span className="text-[10px] text-gray-500">{msg.time}</span>
                    {msg.isRead && <span className="text-blue-500 text-sm">✓✓</span>}
                  </div>
                  {msg.senderId !== 'me' && (
                    <div className="flex justify-end mt-1">
                      <span className="text-[10px] text-gray-500">{msg.time}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            <div className="flex justify-start">
              <div className="bg-white rounded-lg px-3 py-2 rounded-tl-none shadow-sm">
                <span className="text-gray-500">
                  {selectedConversation.user.name} is typing...
                </span>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-white px-3 py-2 flex items-center gap-2 border-t border-gray-200">
            <button className="text-gray-600">📎</button>
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-transparent outline-none text-gray-700"
              />
              <button className="text-gray-600">😊</button>
            </div>
            <button className="text-green-500 font-semibold">
              ➤
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 4: GROUP INFO / PROFILE */}
      {currentScreen === 'groupInfo' && selectedConversation && (
        <div className="bg-gray-100 min-h-screen flex flex-col">
          {/* Header */}
          <div className="bg-green-500 text-white px-3 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentScreen('chatWindow')} className="p-1">
                ←
              </button>
              <h2 className="font-semibold">Group Info</h2>
            </div>
            <button className="p-1">
              ⋮
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Group Image & Name */}
            <div className="bg-white p-6 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-3xl mb-3">
                {selectedConversation.user.avatar}
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-800">{selectedConversation.user.name}</h3>
                <button className="text-green-500">✏️</button>
              </div>
              <p className="text-sm text-gray-600 mt-1">Created on 12 Jun 2026</p>
            </div>

            {/* Members */}
            <div className="bg-white mt-2">
              <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
                <h4 className="font-semibold text-gray-700">3 members</h4>
                <button className="text-green-500 font-medium">+ Add Member</button>
              </div>
              {[
                { name: 'Ahmed Benali', role: 'Admin', avatar: 'AB' },
                { name: 'You', role: 'Admin', avatar: 'Y' },
                { name: 'Sara', role: 'Member', avatar: 'S' },
              ].map((member, i) => (
                <div key={i} className="px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                    {member.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Media */}
            <div className="bg-white mt-2">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h4 className="font-semibold text-gray-700">Media</h4>
                <button className="text-green-500 font-medium">See all</button>
              </div>
              <div className="px-4 py-3 flex gap-2 overflow-x-auto">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="bg-white mt-2">
              {[
                { name: 'Notifications', icon: '🔔' },
                { name: 'Search in chat', icon: '🔍' },
                { name: 'Starred messages', icon: '⭐' },
              ].map((opt, i) => (
                <div key={i} className="px-4 py-3 flex items-center gap-4 border-b border-gray-100">
                  <span className="text-xl">{opt.icon}</span>
                  <span className="text-gray-800">{opt.name}</span>
                </div>
              ))}
            </div>

            {/* Danger Zone */}
            <div className="bg-white mt-2">
              <div className="px-4 py-3 flex items-center gap-4 text-red-500 cursor-pointer">
                <span className="text-xl">🚪</span>
                <span className="font-medium">Leave Group</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 5: EMPTY / SEARCH STATE */}
      {currentScreen === 'emptySearch' && (
        <div className="bg-gray-100 min-h-screen flex flex-col">
          {/* Header with back button */}
          <div className="bg-green-500 text-white px-3 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => { setSearchQuery(''); setCurrentScreen('chatList'); }} className="p-1">
                ←
              </button>
              <h2 className="font-semibold">Search</h2>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-3">
            <div className="bg-white rounded-xl flex items-center gap-2 px-4 py-2">
              🔍
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-gray-700"
                autoFocus
              />
            </div>
          </div>

          {/* Empty State */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No results found</h3>
            <p className="text-gray-600">
              We couldn't find anything matching "{searchQuery}". Try a different keyword.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppChat;
