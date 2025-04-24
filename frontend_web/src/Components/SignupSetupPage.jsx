import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ruler, Calendar, Target, Mars, Venus, User, Anvil, VenusAndMars, Users} from 'lucide-react';

import bodyBoostVideo from '../assets/videos/BodyBoostVideo.mp4';
import whiteWordsLogo from '../assets/images/whiteWordsLogo.png';
import logoFitFlow from '../assets/images/logoFitFlow.png';

const SignupSetupPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    weight: '',
    height: '',
    age: '',
    bodyGoal: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Log the form data being sent
    console.log('Sending form data:', formData);
    
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage

      const response = await fetch('http://localhost:8080/api/auth/signup-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the Authorization header
        },
        body: JSON.stringify(formData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.error || 'Failed to save profile');
      }
  
      const userData = await response.json();
      console.log('Received user data:', userData);
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token);
      
      navigate('/signup-setup-success');
    } catch (error) {
      console.error('Profile setup error:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder:text-gray-500 placeholder:opacity-60";
  const iconClasses = "h-5 w-5 opacity-60";
  
  // Function to get select classes based on individual field's value
  const getSelectClasses = (value) => `w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none ${
    value ? 'text-gray-900' : 'text-gray-400/60'
  }`;

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

        {/* Right side with form */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-4 py-6">
          <div className="w-full max-w-lg relative">
{/* Back Button (Same as SignupVerifyPage) */}
<button
  type="button"
  onClick={() => navigate(-1)}
  className="absolute -top-1 -left-10 inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
    <path d="m15 18-6-6 6-6"/>
  </svg>
  <span className="text-sm">Back</span>
</button>

            <img
              src={logoFitFlow}
              alt="Logo"
              className="h-24 mx-auto mb-2 mt-2"
            />

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Fitness Profile</h2>
              <p className="text-gray-600 mt-1 -mb-1">Tell us more about yourself</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div className="relative col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0.3 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="opacity-50" />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name"
                      className={inputClasses}
                      required
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="relative col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0.3 pl-3 flex items-center pointer-events-none">
                      <Users size={18} className="opacity-50" />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      className={inputClasses}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Gender */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <div className="relative">
                  {/* Left-side gender icon */}
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {formData.gender === "male" ? (
                      <Mars className="w-5 h-5 text-blue-600" />
                    ) : formData.gender === "female" ? (
                      <Venus className="w-5 h-5 text-pink-600" />
                    ) : (
                      <VenusAndMars className="w-5 h-5 text-gray-600 opacity-80" />
                    )}
                  </div>

                  {/* Gender dropdown */}
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={getSelectClasses(formData.gender)}
                    required
                  >
                    <option value="">Select your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                  
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Weight */}
                <div className="relative col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0.3 pl-3 flex items-center pointer-events-none">
                        <Anvil size={18} className="opacity-50" />
                    </div>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="70"
                      className={inputClasses}
                      min="30"
                      max="300"
                      required
                    />
                  </div>
                </div>

                {/* Height */}
                <div className="relative col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0.3 pl-3 flex items-center pointer-events-none">
                      <Ruler size={18} className="opacity-50" />
                    </div>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      placeholder="175"
                      className={inputClasses}
                      min="100"
                      max="250"
                      required
                    />
                  </div>
                </div>

                {/* Age */}
                <div className="relative col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0.3 pl-3 flex items-center pointer-events-none">
                      <Calendar size={18} className="opacity-50" />
                    </div>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="25"
                      className={inputClasses}
                      min="16"
                      max="100"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Body Goal */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Goal</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0.3 pl-3 flex items-center pointer-events-none">
                    <Target size={18} className="opacity-50" />
                  </div>
                  <select
                    name="bodyGoal"
                    value={formData.bodyGoal}
                    onChange={handleInputChange}
                    className={getSelectClasses(formData.bodyGoal)}
                    required
                  >
                    <option value="">Select your body goal</option>
                    <option value="lose-weight">Lose Weight</option>
                    <option value="build-muscle">Build Muscle</option>
                    <option value="maintain-weight">Maintain Weight</option>
                    <option value="increase-endurance">Increase Endurance</option>
                    <option value="improve-flexibility">Improve Flexibility</option>
                    <option value="overall-fitness">Overall Fitness</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm mt-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Continue'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupSetupPage;