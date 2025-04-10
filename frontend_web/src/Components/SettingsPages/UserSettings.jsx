import { useState, useEffect, useCallback } from 'react';
import { User, Edit, Camera, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const UserSettings = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showEnlargedImage, setShowEnlargedImage] = useState(false);
  
  const [activeTab, setActiveTab] = useState('profile');

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    weight: '',
    height: '',
    bodyGoal: '',
    age: '',
    gender: '',
    trainingIntensity: '',
    allergies: '',
    profilePicture: ''
  });

  const [formData, setFormData] = useState({ ...userData });
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'User Profile';
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      setFormData(parsedUser);
    }
  }, []);

  const handleLogout = () => {
    // Call the onLogout function from props first
    onLogout();
    // Then navigate to login
    navigate('/login');
  };


  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProfilePictureChange(e.dataTransfer.files[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token); // Debug log
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Log the full request details
      const requestBody = {
        ...formData,
        userId: userData.userId,
        profilePicture: formData.profilePicture
      };
      
      console.log('Request details:', {
        url: `http://localhost:8080/api/user/update-profile?userId=${userData.userId}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: requestBody
      });

      const response = await fetch(`http://localhost:8080/api/user/update-profile?userId=${userData.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('Response status:', response.status); // Debug log
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText); // Debug log
        let errorMessage;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || 'Failed to update profile';
        } catch (e) {
          errorMessage = errorText || 'Failed to update profile';
        }
        throw new Error(errorMessage);
      }

      const updatedUser = await response.json();
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUserData(updatedUser);
      setFormData(updatedUser);
      setIsEditing(false);

      const finalUserData = {
        ...updatedUser,
        profilePicture: formData.profilePicture // Keep the existing profile picture URL
      };

      localStorage.setItem('user', JSON.stringify(finalUserData));
      setUserData(finalUserData);
      setFormData(finalUserData);
      setIsEditing(false);

    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
};

const handleProfilePictureChange = async (file) => {
  console.log('File selected:', file);
  if (file) {
    try {
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userData.userId);

      // Show loading state
      setIsLoading(true);

      const response = await fetch('http://localhost:8080/api/user/upload-profile-picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || 'Failed to upload profile picture';
        } catch (e) {
          errorMessage = errorText || 'Failed to upload profile picture';
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Server response:', data);
      
      const cleanPath = data.profilePicturePath.replace(/\/+/g, '/');
      const fullImagePath = `http://localhost:8080${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
      console.log('Constructed image URL:', fullImagePath);

      // Verify the image is accessible before updating the UI
      const imageExists = await checkImageExists(fullImagePath);
      if (!imageExists) {
        throw new Error('Uploaded image is not accessible');
      }

      // Update both form data and user data
      setFormData(prev => ({
        ...prev,
        profilePicture: fullImagePath
      }));
      
      setUserData(prev => ({
        ...prev,
        profilePicture: fullImagePath
      }));

      // Update the user data in localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = {
        ...storedUser,
        profilePicture: fullImagePath
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setShowImageModal(false);
      setError('');

    } catch (error) {
      console.error('Complete error details:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }
};

const checkImageExists = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

  const ImageUploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className={`bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4 relative ${
          dragActive ? 'border-2 border-dashed border-blue-500' : ''
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <button
          onClick={() => setShowImageModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
        
        <h3 className="text-xl font-semibold mb-4">Upload Profile Picture</h3>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleProfilePictureChange(e.target.files[0])}
              className="hidden"
              id="profile-upload"
            />
            <label
              htmlFor="profile-upload"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <Camera className="h-12 w-12 text-gray-400" />
              <span className="text-sm text-gray-500">
                Click to upload or drag and drop
              </span>
              <span className="text-xs text-gray-400">
                PNG, JPG up to 10MB
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const EnlargedImageModal = () => (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-8"
      onClick={() => setShowEnlargedImage(false)}
    >
      <div className="relative max-w-full max-h-full flex items-center justify-center">
        <button
          onClick={() => setShowEnlargedImage(false)}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-60"
        >
          <X className="h-8 w-8" />
        </button>
        <img
          src={formData.profilePicture || '/src/assets/images/default-profile.png'}
          alt="Enlarged Profile"
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          onError={(e) => {
            console.error('Enlarged image failed to load:', e);
            e.target.src = '/src/assets/images/default-profile.png';
          }}
        />
      </div>
    </div>
  );

  const ProfileHeader = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center space-x-6">
        <div className="relative group">
        <div 
          className="w-24 h-24 rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => !isEditing && setShowEnlargedImage(true)}
        >
            <img
              src={formData.profilePicture || '/src/assets/images/default-profile.png'} // Add fallback image
              alt="Profile"
              className="w-full h-full object-cover"
              onClick={() => !isEditing && setShowEnlargedImage(true)}
              onError={(e) => {
                console.error('Image failed to load:', e);
                console.log('Attempted image URL:', formData.profilePicture);
                e.target.src = '/src/assets/images/default-profile.png'; // Set fallback image on error
              }}
            />
          </div>
          {isEditing && (
            <button
              onClick={() => setShowImageModal(true)}
              className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
              ) : (
                <Camera className="h-6 w-6 text-white" />
              )}
            </button>
          )}
        </div>
        
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">
            {userData.firstName} {userData.lastName}
          </h1>
          <p className="text-gray-600 text-[14px]">{userData.email}</p>
          <p className="text-sm text-gray-500 mt-1">
            {userData.bodyGoal && `Goal: ${userData.bodyGoal.charAt(0).toUpperCase() + userData.bodyGoal.slice(1)}`}
          </p>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 text-sm text-blue-600 hover:text-blue-800 transition"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">

       {/* Main Content */}
        <div className="p-16 flex-1 mt-[-27px]">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-black to-black bg-clip-text text-transparent">
                Edit profile
              </h1>
            </div>
            <p className="text-gray-500 text-[14px] mt-[-6px]">
              Manage your personal information and fitness details
            </p>
          </div>
          <ProfileHeader />

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {isEditing ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Training Intensity</label>
                      <select
                        name="trainingIntensity"
                        value={formData.trainingIntensity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select intensity level</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="elite">Elite</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Body Goal</label>
                      <select
                        name="bodyGoal"
                        value={formData.bodyGoal}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select your goal</option>
                        <option value="weight-loss">Weight Loss</option>
                        <option value="muscle-gain">Muscle Gain</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="endurance">Endurance</option>
                        <option value="strength">Strength</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non-binary">Non-binary</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Allergies/Dietary Restrictions</label>
                      <textarea
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleInputChange}
                        placeholder="List any allergies or dietary restrictions"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 text-sm mt-2">
                    {error}
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                      type="button"
                      onClick={() => {
                        setFormData(userData);
                        setIsEditing(false);
                      }}
                      className="flex-1 py-2 px-4 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-500">Full Name</label>
                            <p className="text-gray-900 mt-1">{userData.firstName} {userData.lastName}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">Email</label>
                            <p className="text-gray-900 mt-1">{userData.email}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">Age</label>
                            <p className="text-gray-900 mt-1">{userData.age || 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">Gender</label>
                            <p className="text-gray-900 mt-1">
                              {userData.gender ? userData.gender.split('-').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ') : 'Not specified'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fitness Information</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-500">Height</label>
                            <p className="text-gray-900 mt-1">{userData.height ? `${userData.height} cm` : 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">Weight</label>
                            <p className="text-gray-900 mt-1">{userData.weight ? `${userData.weight} kg` : 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">Body Goal</label>
                            <p className="text-gray-900 mt-1">
                              {userData.bodyGoal ? userData.bodyGoal.split('-').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ') : 'Not specified'}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">Training Intensity</label>
                            <p className="text-gray-900 mt-1">{userData.trainingIntensity || 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">Allergies/Dietary Restrictions</label>
                            <p className="text-gray-900 mt-1">{userData.allergies || 'None specified'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </form>
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageModal && <ImageUploadModal />}
      {showEnlargedImage && <EnlargedImageModal />}
    </div>
  );
};

UserSettings.propTypes = {
  onLogout: PropTypes.func.isRequired
};

export default UserSettings;