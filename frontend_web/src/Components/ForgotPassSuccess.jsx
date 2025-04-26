import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

import bodyBoostVideo from '../assets/videos/BodyBoostVideo.mp4';
import whiteWordsLogo from '../assets/images/whiteWordsLogo.png';

const ForgotPassSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side with video and logo */}
      <div className="hidden md:flex md:w-1/2 relative">
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

        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <img
            src={whiteWordsLogo}
            alt="FitFlow"
            className="w-2/3 max-w-md"
          />
        </div>
      </div>

      {/* Right side with success message */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 md:px-12 lg:px-20 relative">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          <span className="text-sm">Back</span>
        </button>

        <div className="w-full max-w-md text-center">
          {/* Logo and Check Container */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <CheckCircle 
              className="w-16 h-16 text-green-500 animate-draw-check" 
              style={{
                strokeDasharray: 100,
                strokeDashoffset: 100,
                animation: 'drawCheck 1.6s ease forwards'
              }}
            />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Password Reset Successful!
          </h1>

          <p className="text-gray-600 mb-8">
            Your password has been successfully reset. You can now log in with your new password.
          </p>

          <Link
            to="/login"
            className="block w-full py-3 px-4 rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-800 transition duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassSuccess;