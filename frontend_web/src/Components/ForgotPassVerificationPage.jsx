import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import bodyBoostVideo from '../assets/videos/BodyBoostVideo.mp4';
import whiteWordsLogo from '../assets/images/whiteWordsLogo.png';
import logoFitFlow from '../assets/images/logoFitFlow.png';

const ForgotPassVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [errorMessages, setErrorMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minute countdown
  const [resendDisabled, setResendDisabled] = useState(true);
  const [email, setEmail] = useState('');

  // Get email from location state or localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem('resetEmail');
    const locationEmail = location.state?.email;
    const emailToUse = locationEmail || storedEmail || '';
    
    if (!emailToUse) {
      // If no email is found, redirect back to forgot password page
      navigate('/forgot1');
      return;
    }
    
    setEmail(emailToUse);
  }, [location, navigate]);

  // Setup timer for resend functionality
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setResendDisabled(false);
    }
  }, [timer]);

  const handleCodeChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    // Auto-focus next input if a digit was entered
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (!/^\d+$/.test(pastedData)) return;
    
    const digits = pastedData.slice(0, 6).split('');
    const newCode = [...verificationCode];
    
    digits.forEach((digit, index) => {
      if (index < 6) newCode[index] = digit;
    });
    
    setVerificationCode(newCode);
    
    // Focus the next empty input or the last input
    for (let i = digits.length; i < 6; i++) {
      const nextInput = document.getElementById(`code-${i}`);
      if (nextInput) {
        nextInput.focus();
        break;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setErrorMessages(['Please enter the complete 6-digit verification code.']);
      return;
    }
    
    setIsLoading(true);
    setErrorMessages([]);
    
    try {
      // Verify the code
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verification/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          code: code
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid verification code');
      }
      
      // If verification successful, redirect to password reset page
      navigate('/reset-password', { state: { email, verified: true } });
      
    } catch (error) {
      console.error('Verification error:', error);
      setErrorMessages([error.message]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendDisabled) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verification/send-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to resend verification code');
      }
      
      // Reset timer
      setTimer(120);
      setResendDisabled(true);
      
    } catch (error) {
      console.error('Resend error:', error);
      setErrorMessages([error.message]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col md:flex-row h-screen">
        {/* Left side with video and logo */}
        <div className="hidden md:flex md:w-1/2 relative bg-gray-100">
          <div className="w-full h-full">
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={bodyBoostVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div className="absolute inset-0 flex items-center justify-center" 
                style={{
                  background: 'linear-gradient(rgba(36, 36, 37, 0.7), rgba(19, 22, 47, 0.9))'
                }}>
              <img
                src={whiteWordsLogo}
                alt="FitFlow"
                className="w-2/3 max-w-md"
              />
            </div>
          </div>
        </div>

        {/* Right side with verification form */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative px-8">
          <button
            type="button"
            onClick={() => navigate('/forgot1')}
            className="absolute top-6 left-6 inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors"
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            <span className="text-sm">Back</span>
          </button>

          <div className="w-full max-w-md">
            <img
              src={logoFitFlow}
              alt="Logo"
              className="h-20 mx-auto mb-3"
            />

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
              <p className="text-gray-600 mt-2">We've sent a verification code to:</p>
              <p className="text-blue-600 font-medium">{email}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center space-x-2">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {errorMessages.length > 0 && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {errorMessages.map((message, index) => (
                    <p key={index} className="text-sm">{message}</p>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || verificationCode.join('').length !== 6}
                className="w-3/4 ml-[56px] flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-800 transition duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">Didn't receive the code?</p>
              <div className="mt-2 flex items-center justify-center">
                <button
                  onClick={handleResendCode}
                  disabled={resendDisabled || isLoading}
                  className={`text-blue-600 hover:text-blue-800 transition duration-200 ${
                    resendDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Resend Code
                </button>
                {resendDisabled && (
                  <span className="ml-2 text-gray-500">({formatTime(timer)})</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassVerificationPage;