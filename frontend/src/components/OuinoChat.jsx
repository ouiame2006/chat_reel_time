import React, { useState, useRef, useEffect } from 'react';
import {
  Phone,
  Video,
  Image as ImageIcon,
  Mic,
  Smile,
  Send,
  Play,
  Pause,
  X
} from 'lucide-react';

// Mock data for demonstration
const mockContact = {
  id: 1,
  name: 'Sarah Johnson',
  avatar: 'SJ',
  isOnline: true
};

const mockMessages = [
  {
    id: 1,
    type: 'text',
    content: 'Hey! How are you doing today?',
    sender: 'other',
    time: '10:30 AM'
  },
  {
    id: 2,
    type: 'text',
    content: 'I\'m doing great! Just finished working on the new design. What do you think?',
    sender: 'me',
    time: '10:32 AM'
  },
  {
    id: 3,
    type: 'image',
    content: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
    sender: 'me',
    time: '10:33 AM'
  },
  {
    id: 4,
    type: 'text',
    content: 'Wow, that looks amazing! Great job!',
    sender: 'other',
    time: '10:34 AM'
  },
  {
    id: 5,
    type: 'audio',
    content: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '0:14',
    sender: 'other',
    time: '10:35 AM'
  },
  {
    id: 6,
    type: 'sticker',
    content: '👍',
    sender: 'me',
    time: '10:36 AM'
  }
];

const emojis = ['😀', '😂', '😍', '🥳', '😎', '🤔', '😢', '😡', '👍', '👎', '❤️', '🎉', '🔥', '✨', '🌟'];

const OuinoChat = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const messagesEndRef = useRef(null);
  const audioRefs = useRef({});

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a text message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: 'text',
      content: inputText,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    setShowEmojiPicker(false);
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setInputText(prev => prev + emoji);
  };

  // Handle audio play/pause
  const toggleAudio = (messageId) => {
    if (playingAudioId === messageId) {
      audioRefs.current[messageId]?.pause();
      setPlayingAudioId(null);
    } else {
      if (playingAudioId) {
        audioRefs.current[playingAudioId]?.pause();
      }
      audioRefs.current[messageId]?.play();
      setPlayingAudioId(messageId);
    }
  };

  // Handle audio end
  const handleAudioEnd = () => {
    setPlayingAudioId(null);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold text-lg">
              {mockContact.avatar}
            </div>
            {mockContact.isOnline && (
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{mockContact.name}</h2>
            <p className="text-sm text-green-500">{mockContact.isOnline ? 'Online' : 'Offline'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-500 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-all">
            <Phone size={22} />
          </button>
          <button className="p-2 text-gray-500 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-all">
            <Video size={22} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-pink-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] ${
                  message.type === 'sticker' ? '' :
                  message.sender === 'me'
                    ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-2xl rounded-br-sm'
                    : 'bg-white text-gray-800 rounded-2xl rounded-bl-sm shadow-sm'
                } px-4 py-3`}
              >
                {message.type === 'text' && (
                  <p className="text-sm leading-relaxed">{message.content}</p>
                )}

                {message.type === 'image' && (
                  <div className="rounded-xl overflow-hidden">
                    <img
                      src={message.content}
                      alt="Message image"
                      className="w-full h-auto"
                    />
                  </div>
                )}

                {message.type === 'audio' && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleAudio(message.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        message.sender === 'me'
                          ? 'bg-white/20 hover:bg-white/30'
                          : 'bg-pink-100 hover:bg-pink-200 text-pink-500'
                      }`}
                    >
                      {playingAudioId === message.id ? (
                        <Pause size={18} />
                      ) : (
                        <Play size={18} className="ml-1" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className={`h-2 rounded-full ${
                        message.sender === 'me' ? 'bg-white/30' : 'bg-gray-200'
                      }`}>
                        <div className={`h-full rounded-full ${
                          message.sender === 'me' ? 'bg-white/60' : 'bg-pink-400'
                        } w-1/3`}></div>
                      </div>
                    </div>
                    <span className="text-xs opacity-75">{message.duration}</span>
                    <audio
                      ref={(el) => (audioRefs.current[message.id] = el)}
                      src={message.content}
                      onEnded={handleAudioEnd}
                    />
                  </div>
                )}

                {message.type === 'sticker' && (
                  <div className="text-6xl">{message.content}</div>
                )}

                {message.type !== 'sticker' && (
                  <div className={`text-xs mt-1 ${
                    message.sender === 'me' ? 'text-white/70' : 'text-gray-400'
                  } text-right`}>
                    {message.time}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-100 p-4">
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-2xl shadow-xl p-4 mb-2 z-10">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-gray-700">Quick Emojis</span>
              <button
                onClick={() => setShowEmojiPicker(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="text-2xl p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-end gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-all"
            >
              <ImageIcon size={22} />
            </button>
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-all"
            >
              <Mic size={22} />
            </button>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-500 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-all"
            >
              <Smile size={22} />
            </button>
          </div>

          <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
              className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-500"
            />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`p-3 rounded-full transition-all ${
              inputText.trim()
                ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white hover:shadow-lg hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default OuinoChat;