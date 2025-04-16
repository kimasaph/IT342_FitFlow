import React, { useState, useEffect } from "react";
import { X, Plus, Image as ImageIcon } from "lucide-react";
import { Toaster, toast } from 'react-hot-toast';
import axios from "axios";

const AddMealButton = ({ onAddMeal }) => {
  const [userId, setUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [mealData, setMealData] = useState({
    name: '',
    description: '',
    protein: '',
    fats: '',
    carbs: '',
    ingredients: '',
    calories: '',
    time: 'Breakfast',
    imageFile: null,
    imageName: ''
  });

  // Available tags for meal categorization
  const tags = [
    { emoji: "🥑", label: "Vegan" },
    { emoji: "🥕", label: "Healthy" },
    { emoji: "🌽", label: "Gains" },
    { emoji: "🌶️", label: "Spicy" },
    { emoji: "🍝", label: "High carb" },
    { emoji: "🦐", label: "Seafood" },
    { emoji: "🫐", label: "Fruity" },
  ];

  // Load user ID from localStorage when component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id || parsedUser.userId); // Handle both id and userId formats
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMealData({
      ...mealData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // We won't actually upload the file, just store its name
      // In a real implementation with server file upload, this would be different
      setMealData({
        ...mealData,
        imageFile: file,
        imageName: file.name
      });
    }
  };

  const handleTagClick = (index) => {
    setSelectedTags(prevSelectedTags => {
      if (prevSelectedTags.includes(index)) {
        return prevSelectedTags.filter(i => i !== index);
      } else {
        return [...prevSelectedTags, index];
      }
    });
  };

  const clearImage = () => {
    setMealData({
      ...mealData,
      imageFile: null,
      imageName: ''
    });
    setImagePreview(null);
    // Reset the file input
    const fileInput = document.getElementById('meal-image-input');
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      setError("User ID not found. Please login again.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Determine image name to use
      let imageName = mealData.imageName;
      if (!imageName) {
        // Use default image based on meal type if no image was selected
        imageName = mealData.time.toLowerCase().includes('breakfast') ? 'oatmeal.png' :
                    mealData.time.toLowerCase().includes('lunch') ? 'salmon2.png' :
                    mealData.time.toLowerCase().includes('dinner') ? 'pasta.png' : 'yogurt2.png';
      }
      
      // Get selected tags
      const mealTags = selectedTags.map(index => tags[index].label);
      
      // Create meal object with image name only, not the file
      const newMeal = {
        userId: userId,
        time: mealData.time,
        name: mealData.name,
        calories: Number(mealData.calories),
        protein: Number(mealData.protein),
        carbs: Number(mealData.carbs),
        fats: Number(mealData.fats),
        notes: mealData.description,
        ingredients: mealData.ingredients,
        image: imageName,
        tags: mealTags
      };
      
      // Send JSON data to backend API
      const response = await axios.post('http://localhost:8080/api/meals', newMeal, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      toast.success('Meal added successfully!');
      console.log('Meal added successfully:', response.data);
      
      // Add the new meal to the local state if callback exists
      if (onAddMeal && response.data) {
        onAddMeal(response.data);
      }
      
      // Close the modal and reset the form
      setIsModalOpen(false);
      setMealData({
        name: '',
        description: '',
        protein: '',
        fats: '',
        carbs: '',
        ingredients: '',
        calories: '',
        time: 'Breakfast',
        imageFile: null,
        imageName: ''
      });
      setImagePreview(null);
      setSelectedTags([]);
    } catch (err) {
      console.error('Error adding meal:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add meal. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <Toaster
        position="top-center"
        toastOptions={{ style: { background: "#D4EDDA", color: "#155724" } }}
      />
      {/* Add Meal Button */}
      <div 
        className="bg-white rounded-xl p-4 shadow-sm border text-sm w-full md:w-auto md:min-w-40 text-gray-700 flex-shrink-0 cursor-pointer hover:bg-gray-50 transition-colors mr-[-24px]"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center justify-center text-center p-2">
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 rounded-full p-2 mb-2">
              <Plus className="text-blue-600" size={20} />
            </div>
            <p className="text-blue-600 font-medium">Add New Meal</p>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4 relative max-h-[90vh] overflow-y-auto">
            <button 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Meal</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Name</label>
                  <input
                    type="text"
                    name="name"
                    value={mealData.name}
                    onChange={handleInputChange}
                    placeholder="E.g., Avocado Toast"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-sm placeholder: opacity-70"
                    required
                  />
                </div>
                
                <select
                  name="time"
                  value={mealData.time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  required
                >
                  <option value="" disabled hidden>
                    Select meal type
                  </option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="2nd breakfast">2nd breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>


                {/* Image Selection Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Image</label>
                  <div className="border border-gray-300 rounded-md p-3">
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Meal preview" 
                          className="w-full h-40 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={clearImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center bg-gray-50 h-40 rounded-md border-2 border-dashed border-gray-300">
                        <ImageIcon className="text-gray-400 mb-2" size={32} />
                        <p className="text-sm text-gray-500 mb-2">Select an image for your meal</p>
                        <label className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-md cursor-pointer transition-colors">
                          Choose Image
                          <input
                            type="file"
                            id="meal-image-input"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Tags Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Tags</label>
                  <div className="flex flex-wrap gap-2 mt-1 mb-2">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        onClick={() => handleTagClick(index)}
                        className={`flex items-center gap-2 px-3 py-1.5 border rounded-md text-xs md:text-sm 
                          transition-all duration-300 cursor-pointer
                          ${selectedTags.includes(index) ? 
                            'bg-blue-500 text-white border-blue-500 shadow-md transform scale-105' : 
                            'bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:-translate-y-1 hover:shadow'}`}
                      >
                        <span>{tag.emoji}</span>
                        <span>{tag.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description/Notes</label>
                  <textarea
                    name="description"
                    value={mealData.description}
                    onChange={handleInputChange}
                    placeholder="Add notes about preparation, taste, or any other details"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-20 placeholder:text-xs placeholder: opacity-70"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
                  <textarea
                    name="ingredients"
                    value={mealData.ingredients}
                    onChange={handleInputChange}
                    placeholder="List ingredients separated by commas"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20 placeholder:text-xs placeholder: opacity-70"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                    <input
                      type="number"
                      name="calories"
                      value={mealData.calories}
                      onChange={handleInputChange}
                      placeholder="kcal"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-sm placeholder: opacity-70"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Protein</label>
                    <input
                      type="number"
                      name="protein"
                      value={mealData.protein}
                      onChange={handleInputChange}
                      placeholder="g"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-sm placeholder: opacity-70"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Carbs</label>
                    <input
                      type="number"
                      name="carbs"
                      value={mealData.carbs}
                      onChange={handleInputChange}
                      placeholder="g"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-sm placeholder: opacity-70"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fats</label>
                    <input
                      type="number"
                      name="fats"
                      value={mealData.fats}
                      onChange={handleInputChange}
                      placeholder="g"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-sm placeholder: opacity-70"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Adding...' : 'Add Meal'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMealButton;