import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import bodyBoostVideo from '../assets/videos/BodyBoostVideo.mp4';
import whiteWordsLogo from '../assets/images/whiteWordsLogo.png';
import logoFitFlow from '../assets/images/logoFitFlow.png';
import emailIcon from '../assets/images/emailIcon.png';

const ForgotPassPage1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: ''
  });
  const [errorMessages, setErrorMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  useEffect(() => {
    document.title = 'Forgot Password | FitFlow';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessages([]);

    try {
      // Step 1: Check if the email exists in the database
      const checkEmailResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email
        })
      });
      
      if (checkEmailResponse.status === 404) {
        throw new Error('Email not found. Please check your email address.');
      }
      
      if (!checkEmailResponse.ok) {
        const errorData = await checkEmailResponse.json();
        throw new Error(errorData.error || 'Email verification failed');
      }
      
      // Step 2: Send verification email (similar to SignupPage)
      const verificationResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/verification/send-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });
      
      if (!verificationResponse.ok) {
        console.warn('Verification email could not be sent');
        throw new Error('Failed to send verification code. Please try again later.');
      }
      
      console.log('Verification email sent successfully');
      
      // Step 3: Store email in localStorage and redirect
      localStorage.setItem('resetEmail', formData.email);
      navigate('/forgot-verify', { state: { email: formData.email } });
      
    } catch (error) {
      console.error('Password reset process error:', error);
      setErrorMessages([`Error: ${error.message}`]);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder:text-gray-500 placeholder:opacity-60";

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

        {/* Right side with forgot password form */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative">
        <button
            type="button"
            onClick={() => navigate('/login')}
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
            <h2 className="text-4xl font-bold text-gray-900 text-center" style={{ marginTop: '-20px' }}>Forgot Password</h2>
            <p className="text-[0.90rem] text-gray-600 text-center" style={{ marginBottom: '-25px' }}>Enter your email address and we will</p>
            <p className="text-[0.90rem] text-gray-600 text-center" style={{ marginBottom: '50px' }}>send you a code to reset your password</p>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <img
                  src={emailIcon}
                  alt="Email"
                  className="h-4 w-4 opacity-60"
                />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={inputClasses}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
            {errorMessages.length > 0 && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {errorMessages.map((msg, index) => (
                  <p key={index} className="text-sm">{msg}</p>
                ))}
              </div>
            )}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Email'}
            </button>
            <div className="text-center">
              <Link to="/login" className="text-blue-600 hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassPage1;