import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

import bodyBoostVideo from '../assets/videos/BodyBoostVideo.mp4';
import whiteWordsLogo from '../assets/images/whiteWordsLogo.png';
import logoFitFlow from '../assets/images/logoFitFlow.png';

const SignupVerifyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get email from state or localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem('signupEmail') || 
      (location.state && location.state.email) || '';
    setEmail(storedEmail);
  }, [location]);

  const handleCodeChange = (e) => {
    // Only allow numbers and limit to 6 digits
    const input = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(input);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessages([]);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verification/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      if (!response.ok) {
        throw new Error('Invalid verification code');
      }

      const data = await response.json();

      // Store token and role in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('isAuthenticated', 'true');

      // Navigate to the signup success page
      navigate('/signup-success');
    } catch (error) {
      setErrorMessages([error.message]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      
      // Updated endpoint to match your backend API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verification/send-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend verification code');
      }
      
      setErrorMessages(['A new verification code has been sent to your email.']);
    } catch (error) {
      console.error('Resend code error:', error);
      setErrorMessages([`Error: ${error.message}`]);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder:text-gray-500 placeholder:opacity-60 text-center tracking-widest text-xl";

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
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative">
          {/* Back button positioned at top-left */}
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="absolute top-6 left-6 inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors"
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            <span className="text-sm">Back</span>
          </button>
          <img
            src={logoFitFlow}
            alt="Logo"
            className="h-24 mx-auto mb-3"
          />
          <form onSubmit={handleSubmit} className="w-full max-w-md p-8 space-y-6">
            <h2 className="text-4xl font-bold text-gray-900 text-center" style={{ marginTop: '-20px' }}>Confirm Verification Code</h2>
            <p className="text-[0.90rem] text-gray-600 text-center" style={{ marginBottom: '-5px' }}>
              Enter the 6-digit code sent to
            </p>
            <p className="text-[0.90rem] font-medium text-gray-800 text-center" style={{ marginBottom: '30px' }}>
              {email}
            </p>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-1 pl-3 flex items-center pointer-events-none">
                  <ShieldCheck size={20} className="opacity-50" />
                </div>
              <input
                type="text"
                name="verificationCode"
                value={verificationCode}
                onChange={handleCodeChange}
                className={`${inputClasses} text-left pl-3`} // Adjust `pl-10` as needed
                placeholder="000000"
                required
                maxLength="6"
                pattern="\d{6}"
                disabled={isLoading}
              />
            </div>
            
            {errorMessages.length > 0 && (
              <div className={errorMessages[0].includes('new verification code') ? 'text-green-500' : 'text-red-500'}>
                {errorMessages.map((msg, index) => (
                  <p key={index}>{msg}</p>
                ))}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || verificationCode.length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                className="text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Didn't receive a code? Resend
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupVerifyPage;