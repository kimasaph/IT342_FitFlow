import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const SignupSuccessPage = () => {
  const navigate = useNavigate();

  // Add a function to handle profile setup navigation
  const handleProfileSetup = () => {
    // Double check authentication is set before navigating
    if (!localStorage.getItem('isAuthenticated')) {
      localStorage.setItem('isAuthenticated', 'true');
    }
    navigate('/profile-setup');
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
              <source src="/src/assets/videos/BodyBoostVideo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

             <div className="absolute inset-0 flex items-center justify-center" 
                  style={{
                    background: 'linear-gradient(rgba(36, 36, 37, 0.7), rgba(19, 22, 47, 0.9))'
                  }}>
              <img
                src="/src/assets/images/whiteWordsLogo.png"
                alt="FitFlow"
                className="w-2/3 max-w-md"
              />
            </div>
          </div>
        </div>

        {/* Right side with success message */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-8">
          <div className="w-full max-w-md text-center">
            {/* Logo and Check Container */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <img
                src="/src/assets/images/logoFitFlow.png"
                alt="Logo"
                className="h-20 w-auto"
              />
              <CheckCircle 
                className="w-16 h-16 text-green-500 animate-draw-check" 
                style={{
                  strokeDasharray: 100,
                  strokeDashoffset: 100,
                  animation: 'drawCheck 1.4s ease forwards'
                }}
              />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to FitFlow!
            </h1>

            <p className="text-gray-600 mb-8">
              Your account has been successfully created. You&apos;re now ready to begin your journey with us.
            </p>

            <div className="space-y-4">
              <Link
                to="/dashboard"
                className="block w-full py-3 px-4 rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-800 transition duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Dashboard
              </Link>

              <button
                onClick={handleProfileSetup}
                className="block w-full py-3 px-4 rounded-md shadow-sm text-blue-600 bg-white border border-blue-600 hover:bg-blue-50 transition duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Complete Your Profile
              </button>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Next Steps:
              </h2>
              <ul className="text-left text-gray-600 space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  Complete your profile information
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  Set up your preferences
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  Explore our features and tools
                </li>
              </ul>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              Need help? <a href="/support" className="text-blue-600 hover:text-blue-500">Contact Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupSuccessPage;