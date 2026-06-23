import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Volume2, 
  VolumeX,
  Maximize2
} from 'lucide-react';

const VideoCall = ({ user, contact, onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isIncoming, setIsIncoming] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnecting(false);
      if (!isIncoming) {
        setCallAccepted(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (callAccepted) {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callAccepted]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera/mic:', error);
      }
    };

    if (callAccepted) {
      startCamera();
    }
  }, [callAccepted]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  const acceptCall = () => {
    setCallAccepted(true);
  };

  if (isIncoming && !callAccepted) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        background: 'var(--bg-deep)', 
        zIndex: 9999,
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'var(--text-bright)'
      }}>
        <div style={{ 
          width: '120px', 
          height: '120px', 
          borderRadius: '50%', 
          background: 'var(--primary-glow)', 
          border: '3px solid var(--primary)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginBottom: '2rem' 
        }}>
          <div className="avatar" style={{ width: '100%', height: '100%', fontSize: '2.5rem' }}>
            {contact?.name?.[0]?.toUpperCase()}
          </div>
        </div>
        
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{contact?.name}</h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '3rem' }}>Incoming Video Call...</p>

        <div style={{ display: 'flex', gap: '3rem' }}>
          <button 
            onClick={onEndCall} 
            style={{ 
              width: '70px', 
              height: '70px', 
              borderRadius: '50%', 
              background: 'var(--error)', 
              border: 'none', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white'
            }}>
            <PhoneOff size={32} />
          </button>
          <button 
            onClick={acceptCall} 
            style={{ 
              width: '70px', 
              height: '70px', 
              borderRadius: '50%', 
              background: 'var(--success)', 
              border: 'none', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white'
            }}>
            <Video size={32} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      background: '#000', 
      zIndex: 9999,
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isConnecting ? (
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div className="loading-spinner" style={{ width: '60px', height: '60px', margin: '0 auto 2rem', borderWidth: '3px' }}></div>
            <h2 style={{ fontSize: '1.5rem' }}>Calling {contact?.name}...</h2>
          </div>
        ) : (
          <>
            <video 
              ref={remoteVideoRef}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                display: isVideoOff ? 'none' : 'block'
              }} 
              autoPlay 
              playsInline 
              muted 
            />

            <div style={{ 
              position: 'absolute', 
              bottom: '2rem', 
              right: '2rem', 
              width: '200px', 
              height: '150px', 
              borderRadius: '1rem', 
              overflow: 'hidden',
              border: '2px solid var(--primary)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
              <video 
                ref={localVideoRef}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  transform: 'scaleX(-1)'
                }} 
                autoPlay 
                playsInline 
                muted 
              />
            </div>

            <div style={{ 
              position: 'absolute', 
              top: '2rem', 
              left: '2rem', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.5rem', 
              color: 'white' 
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{contact?.name}</h2>
              {callAccepted && <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>{formatDuration(callDuration)}</p>}
            </div>
          </>
        )}
      </div>

      <div style={{ 
        padding: '2rem', 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '2rem',
        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
      }}>
        <button 
          onClick={toggleMute}
          style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '50%', 
            background: isMuted ? 'var(--error)' : 'rgba(255,255,255,0.2)', 
            border: 'none', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white'
          }}>
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>

        <button 
          onClick={toggleVideo}
          style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '50%', 
            background: isVideoOff ? 'var(--error)' : 'rgba(255,255,255,0.2)', 
            border: 'none', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white'
          }}>
            {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
        </button>

        <button 
          onClick={toggleSpeaker}
          style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '50%', 
            background: 'rgba(255,255,255,0.2)', 
            border: 'none', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white'
          }}>
            {isSpeakerOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>

        <button 
          onClick={onEndCall}
          style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '50%', 
            background: 'var(--error)', 
            border: 'none', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white'
          }}>
            <PhoneOff size={24} />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
