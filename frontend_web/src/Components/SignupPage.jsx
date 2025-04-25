import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { EyeClosed, Eye } from 'lucide-react';

import bodyBoostVideo from '../assets/videos/BodyBoostVideo.mp4';
import whiteWordsLogo from '../assets/images/whiteWordsLogo.png';
import logoFitFlow from '../assets/images/logoFitFlow.png';
import userIcon from '../assets/images/userIcon.png';
import phoneIcon from '../assets/images/phoneIcon.png';
import lockIcon1 from '../assets/images/lockIcon1.png';
import lockIcon2 from '../assets/images/lockIcon2.png';
import facebookIcon from '../assets/images/facebookIcon2.png';
import githubIcon from '../assets/images/github.png';
import googleIcon from '../assets/images/googleIcon2.png';
import groupIcon from '../assets/images/group.png';

const API_URL = import.meta.env.VITE_API_URL;

const SignupPage = ({ onSignupSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'MEMBER' // Default role
  });

  const [errorMessages, setErrorMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [phoneError, setPhoneError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      // Check if input contains only numbers
      if (!/^\d*$/.test(value)) {
        setPhoneError('Please enter numbers only');
      } else {
        setPhoneError('');
      }
    }
    
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  useEffect(() => {
    document.title = 'Signup | FitFlow';
  }, []);

  // Check password complexity
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
    
    // Validate password
    const passwordErrors = validatePassword(formData.password);
    
    if (passwordErrors.length > 0) {
      setErrorMessages(passwordErrors);
      setIsLoading(false);
      return;
    }

    if (!/^\d+$/.test(formData.phoneNumber)) {
      setErrorMessages(['Phone number must contain only numbers']);
      setIsLoading(false);
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMessages(['Passwords do not match']);
      setIsLoading(false);
      return;
    }
  
    const requestBody = {
      username: formData.email,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      role: formData.role, // Include role
      created_at: new Date()
    };
    
    try {
      // Step 1: Create the user account
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody), 
      });

      // Get response text first
      const responseText = await response.text();

      if (!response.ok) {
        // Check for specific SQL error patterns
        if (responseText.includes('Duplicate entry') && responseText.includes('uk_email')) {
          throw new Error('An account with this email already exists.');
        }
        
        // For other SQL errors, provide a generic message
        if (responseText.includes('could not execute statement')) {
          throw new Error('Unable to create account. Please try again later.');
        }

        // For any other errors
        throw new Error(responseText || 'An unexpected error occurred. Please try again.');
      }

      // Try to parse successful response as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing response:', e);
        data = {};
      }

      // Handle successful signup
      localStorage.setItem('isAuthenticated', 'true');
      if (data.token) {
        localStorage.setItem('token', data.token); // Store token
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('role', data.user.role); // Store the role
      }
      
      // Store the email for the verification page
      localStorage.setItem('signupEmail', formData.email);
      
      // Step 2: Send verification email
      const verificationResponse = await fetch(`${API_URL}/api/verification/send-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });
      
      if (!verificationResponse.ok) {
        console.warn('Verification email could not be sent, but account was created');
      } else {
        console.log('Verification email sent successfully');
      }
      
      if (onSignupSuccess) {
        onSignupSuccess();
      }
      
      // Redirect to the verification page
      navigate('/signup-verify', { state: { email: formData.email } });
      
    } catch (error) {
      console.error('Signup error:', error);
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

        {/* Right side with signup form */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-8 relative">
            {/* Back button positioned at top-left */}
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

            <div className="w-full max-w-md">
            <img
              src={logoFitFlow}
              alt="Logo"
              className="h-16 mx-auto mb-3"
            />

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Let&apos;s get started!</h2>
              <p className="text-gray-600">Enter necessary details.</p>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <div className="flex items-center">
                
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <img
                    src={groupIcon}
                    alt="Role"
                    className="h-5 w-5 opacity-60"
                  />
                  </div>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={`${inputClasses} appearance-none pl-10`}
                    required
                  >
                    <option value="MEMBER">Member</option>
                    <option value="TRAINER">Trainer</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <img
                    src={userIcon}
                    alt="User"
                    className="h-4 w-4 opacity-60"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className={inputClasses}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <img
                    src={phoneIcon}
                    alt="Phone"
                    className="h-5 w-5 opacity-60"
                  />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className={inputClasses}
                  required
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <img
                    src={lockIcon1}
                    alt="Password"
                    className="h-5 w-5 opacity-60"
                  />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
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
                    src={lockIcon2}
                    alt="Confirm Password"
                    className="h-5 w-5 opacity-60"
                  />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className={inputClasses}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowConfirmPassword(prev => !prev)}>
                  {showConfirmPassword ? <Eye className="h-4 w-4 opacity-60" /> : <EyeClosed className="h-4 w-4 opacity-60" />}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-800 transition duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </button>

              {errorMessages.length > 0 && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {errorMessages.map((message, index) => (
                    <p key={index} className="text-sm">{message}</p>
                  ))}
                </div>
              )}
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or Sign Up With:
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50">
                  <img
                    src={facebookIcon}
                    alt="Facebook"
                    className="h-7 w-7"
                  />
                </button>
                <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50">
                  <img
                    src={githubIcon}
                    alt="Github"
                    className="h-7 w-7"
                  />
                </button>
                <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50">
                  <img
                    src={googleIcon}
                    alt="Google"
                    className="h-7 w-7"
                  />
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Already have an account? Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
SignupPage.propTypes = {
  onSignupSuccess: PropTypes.func
};

export default SignupPage;