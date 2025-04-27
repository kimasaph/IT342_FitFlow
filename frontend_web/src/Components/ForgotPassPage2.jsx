import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { EyeClosed, Eye } from 'lucide-react';

import bodyBoostVideo from '../assets/videos/BodyBoostVideo.mp4';
import whiteWordsLogo from '../assets/images/whiteWordsLogo.png';
import logoFitFlow from '../assets/images/logoFitFlow.png';

const ForgotPassPage2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errorMessages, setErrorMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [verified, setVerified] = useState(false);

  // Get email and verification status from location state or localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem('resetEmail');
    const locationEmail = location.state?.email;
    const emailToUse = locationEmail || storedEmail || '';
    
    // Check if the user is coming from the verification page
    const isVerified = location.state?.verified || false;
    
    if (!emailToUse || !isVerified) {
      // If not verified or no email, redirect back to forgot password page
      navigate('/forgot-password');
      return;
    }
    
    setEmail(emailToUse);
    setVerified(isVerified);
  }, [location, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validatePassword = (password) => {
    const errors = [];
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one capital letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character (e.g., !@#$%)');
    }
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessages([]);

    const passwordErrors = validatePassword(formData.password);

    if (formData.password !== formData.confirmPassword) {
      setErrorMessages(['Passwords do not match']);
      setIsLoading(false);
      return;
    }

    if (passwordErrors.length > 0) {
      setErrorMessages(passwordErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          newPassword: formData.password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }

      // Clear the reset email from localStorage
      localStorage.removeItem('resetEmail');
      
      // Redirect to login page with success message
      navigate('/forgot-success', { 
        state: { 
          message: 'Password reset successful! You can now login with your new password.', 
          type: 'success' 
        } 
      });
      
    } catch (error) {
      console.error('Password reset error:', error);
      setErrorMessages([error.message]);
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

        {/* Right side with password reset form */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative px-8">
        {/* Back button positioned at top-left */}
        <button
            type="button"
            onClick={() => navigate('/forgot-password')}
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
              <h2 className="text-2xl font-bold text-gray-900">Reset Your Password</h2>
              <p className="text-gray-600 mt-2">Create a new password for your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <img
                    src="/src/assets/images/lockIcon1.png"
                    alt="Password"
                    className="h-5 w-5 opacity-60"
                  />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="New Password"
                  className={inputClasses}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(prev => !prev)}>
                  {showPassword ? <Eye className="h-4 w-4 opacity-60" /> : <EyeClosed className="h-4 w-4 opacity-60" />}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <img
                    src="/src/assets/images/lockIcon2.png"
                    alt="Confirm Password"
                    className="h-5 w-5 opacity-60"
                  />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm New Password"
                  className={inputClasses}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowConfirmPassword(prev => !prev)}>
                  {showConfirmPassword ? <Eye className="h-4 w-4 opacity-60" /> : <EyeClosed className="h-4 w-4 opacity-60" />}
                </div>
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
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-800 transition duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassPage2;