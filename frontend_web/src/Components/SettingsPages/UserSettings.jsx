import { useState, useEffect, useCallback } from 'react';
import { User, Camera, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Footer from "../Footer";
import { Toaster, toast } from "react-hot-toast";

const UserSettings = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showEnlargedImage, setShowEnlargedImage] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    gender: '',
    allowWorkoutSuggestions: false,
    phoneNumber: ''
  });

  const [formData, setFormData] = useState({ ...userData });
  const [error, setError] = useState('');
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    document.title = 'Edit Profile';
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      setFormData(parsedUser);
    }
  }, []);

  useEffect(() => {
    // Check if any values changed
    const hasChanged = Object.keys(formData).some(key => formData[key] !== userData[key]);
    setIsChanged(hasChanged);
  }, [formData, userData]);

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
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const requestBody = {
        ...formData,
        userId: userData.userId,
        profilePicture: formData.profilePicture
      };
      
      const response = await fetch(`http://localhost:8080/api/auth/update-profile?userId=${userData.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
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
      
      const finalUserData = {
        ...updatedUser,
        profilePicture: formData.profilePicture
      };

      // Store updated token and role in localStorage
      localStorage.setItem('token', updatedUser.token);
      localStorage.setItem('role', updatedUser.role);
      localStorage.setItem('user', JSON.stringify(finalUserData));
      setUserData(finalUserData);
      setFormData(finalUserData);
      setIsChanged(false);
      setEditingField(null);
      toast.success('Profile updated successfully!');

    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.message || 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePictureChange = async (file) => {
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

        setIsLoading(true);

        const response = await fetch('http://localhost:8080/api/auth/upload-profile-picture', {
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
        
        const cleanPath = data.profilePicturePath.replace(/\/+/g, '/');
        const fullImagePath = `http://localhost:8080${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;

        // Verify the image is accessible
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

        toast.success('Profile picture updated!');
        setShowImageModal(false);  // <-- This closes the modal after successful upload

      } catch (error) {
        console.error('Complete error details:', error);
        const errorMessage = error.message || 'Failed to upload profile picture';
        setError(errorMessage);
        toast.error(errorMessage);
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

  const toggleEditField = (fieldName) => {
    if (editingField === fieldName) {
      setEditingField(null);
    } else {
      setEditingField(fieldName);
    }
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


  const renderField = (label, fieldName, type = 'text', options = null, alwaysEditable = false) => {
    const isEditing = alwaysEditable || editingField === fieldName;
    const value = formData[fieldName];
  
    return (
      <div className="mb-6">
        <label className="block text-[15px] font-bold mb-2">{label}</label>
  
        {isEditing ? (
          type === 'select' ? (
            <select
              name={fieldName}
              value={value || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              name={fieldName}
              value={value || ''}
              placeholder={`Enter ${label.toLowerCase()}`}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-black"
            />
          )
        ) : (
          <div
            className="px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm text-black flex justify-between items-center cursor-pointer"
            onClick={() => toggleEditField(fieldName)}
          >
            <span>{renderFieldValue(fieldName, value)}</span>
            {!alwaysEditable && (
              <button type="button" className="text-blue-500 text-sm font-medium">
                Edit
              </button>
            )}
          </div>
        )}
      </div>
    );
  };
  
  

  const renderFieldValue = (fieldName, value) => {
    if (fieldName === 'gender') {
      switch (value) {
        case 'male': return 'Male';
        case 'female': return 'Female';
        case 'non-binary': return 'Non-binary';
        case 'prefer-not-to-say': return 'Prefer not to say';
        default: return 'Not specified';
      }
    }
    
    return value || 'Not specified';
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <h1 className="text-xl font-bold mb-4 mt-6">Edit profile</h1>
        
        {/* Profile Header with Photo */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden cursor-pointer">
                <img
                  src={formData.profilePicture || '/src/assets/images/default-profile.png'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onClick={() => setShowEnlargedImage(true)}
                  onError={(e) => {
                    e.target.src = '/src/assets/images/default-profile.png';
                  }}
                />
              </div>
            </div>
            
            {/* Profile Info + Button */}
            <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    
                    {/* Username & Email */}
                    <div className="text-center sm:text-left mt-6 ml-[-4px]">
                      <h2 className="text-[18px] font-bold">{formData.username || `${formData.firstName} ${formData.lastName}`}</h2>
                      <p className="text-gray-600 text-sm">{formData.email}</p>
                    </div>

                    {/* Change Photo Button */}
                    <button
                      onClick={() => setShowImageModal(true)}
                      className="mt-6 sm:mt-6 bg-blue-500 mr-3 text-white font-bold px-5 py-2 rounded-xl hover:bg-blue-600 transition text-[13px]"
                    >
                      Change photo
                    </button>
                  </div>
                </div>
              </div>
            </div>

        {/* Form Fields */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-[15px]">
          <form onSubmit={handleSubmit} className="space-y-7">
            {renderField('First Name', 'firstName')}
            {renderField('Last Name', 'lastName')}
            {renderField('Username', 'username',)}
            {renderField('Age', 'age', 'number')}
            {renderField('Gender', 'gender', 'select', [
              { value: '', label: 'Select gender' },
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'non-binary', label: 'Non-binary' },
              { value: 'prefer-not-to-say', label: 'Prefer not to say' }
            ])}
            {renderField('Phone Number', 'phoneNumber')}

            
            {/* Toggle for workout suggestions */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold mt-4">Show workout suggestions</h3>
                  <p className="text-[13px] text-gray-500">
                    Choose whether to receive workout suggestions based on your profile
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-2 mr-3">
                  <input
                    type="checkbox"
                    name="allowWorkoutSuggestions"
                    checked={formData.allowWorkoutSuggestions || false}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm mt-2">
                {error}
              </div>
            )}

            <div className="pt-4 text-right">
              <button
                type="submit"
                disabled={isLoading || !isChanged}
                className={`px-24 py-3 rounded-lg text-white font-bold text-[14px] ${
                  isChanged && !isLoading ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300 cursor-not-allowed'
                } transition-colors`}
              >
                {isLoading ? 'Saving...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageModal && <ImageUploadModal />}
      {showEnlargedImage && <EnlargedImageModal />}

            <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#D4EDDA",
            color: "#155724",
          },
        }}
      />
      <Footer />
    </div>
  );
};

UserSettings.propTypes = {
  onLogout: PropTypes.func.isRequired
};

export default UserSettings;