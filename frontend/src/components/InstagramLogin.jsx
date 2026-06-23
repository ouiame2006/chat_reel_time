import React, { useState } from 'react';

const countryCodes = [
  { code: '+212', country: 'Morocco', flag: '🇲🇦' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
];

const InstagramLogin = ({ setView }) => {
  const [step, setStep] = useState(1);
  const [countryCode, setCountryCode] = useState('+212');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    setLoading(true);
    setError('');

    // For demo purposes, we'll just simulate sending the code
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter the full code');
      return;
    }

    // For demo purposes, any 6-digit code works
    setLoading(true);
    setError('');

    setTimeout(() => {
      const userData = {
        id: Date.now(),
        name: 'user_' + phone.slice(-4),
        phone: countryCode + phone,
        countryCode: countryCode,
      };
      
      localStorage.setItem('instagram_user', JSON.stringify(userData));
      localStorage.setItem('instagram_token', 'demo_token_' + Date.now());
      
      setLoading(false);
      setView('instagram-main');
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return (
    <div className="instagram-auth-wrapper">
      <div className="instagram-auth-card">
        <div className="instagram-auth-logo">ChatReel</div>

        {error && (
          <div style={{ color: '#ED4956', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendCode} className="instagram-auth-form">
            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="instagram-input"
                style={{ width: '30%', padding: '10px' }}
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="Phone number"
                className="instagram-input"
                style={{ width: '70%' }}
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="instagram-btn"
              style={{ width: '100%', marginTop: '12px', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Sending...' : 'Send Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="instagram-auth-form">
            <p style={{ color: '#737373', fontSize: '14px', textAlign: 'center', marginBottom: '16px' }}>
              We sent a code to {countryCode} {phone}
            </p>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '12px' }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !digit && index > 0) {
                      document.getElementById(`otp-${index - 1}`)?.focus();
                    }
                  }}
                  className="instagram-input"
                  style={{ width: '48px', height: '48px', textAlign: 'center', fontSize: '24px' }}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="instagram-btn"
              style={{ width: '100%', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="instagram-btn-text"
              style={{ marginTop: '12px', width: '100%', textAlign: 'center' }}
            >
              Back
            </button>
          </form>
        )}

        <div className="instagram-auth-footer">
          Don't have an account?{' '}
          <span className="instagram-auth-link">Sign up</span>
        </div>
      </div>
    </div>
  );
};

export default InstagramLogin;
