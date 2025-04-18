import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Plus, Trash2 } from "lucide-react";
import axios from "axios";

const UserMadeMeals = ({ onSelectMeal, onAddMeal, onDeleteMeal, userMealsData = [] }) => {
  const [userMeals, setUserMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [showEnlargedImage, setShowEnlargedImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredMealId, setHoveredMealId] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [mealToDelete, setMealToDelete] = useState(null);

  // Number of meals to show at once
  const displayCount = 2;

  useEffect(() => {
    fetchUserMeals();
  }, []);

  // Update meals when userMealsData prop changes
  useEffect(() => {
    if (userMealsData && userMealsData.length > 0) {
      // Merge the API-fetched meals with the prop-passed meals
      setUserMeals(currentMeals => {
        // Create a new array with all existing meals
        const newMeals = [...currentMeals];
        
        // Add any meals from userMealsData that aren't already in the array
        userMealsData.forEach(propMeal => {
          // Only add if not already present (prevent duplicates)
          if (!newMeals.some(meal => meal.id === propMeal.id)) {
            newMeals.push(propMeal);
          }
        });
        
        return newMeals;
      });
      
      // If we just added our first meal, set loading to false
      if (loading && userMealsData.length > 0) {
        setLoading(false);
      }
    }
  }, [userMealsData]);

  const fetchUserMeals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (!token || !storedUser) {
        throw new Error('Authentication information not found');
      }
      
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.id || parsedUser.userId;
      
      const response = await axios.get(`http://localhost:8080/api/meals/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // No need to process images here anymore as we'll handle it in getMealImage
      setUserMeals(response.data || []);
    } catch (err) {
      console.error('Error fetching user meals:', err);
      setError('Failed to load your meals');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    setStartIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex(prev => Math.min(userMeals.length - displayCount, prev + 1));
  };

  const visibleMeals = userMeals.slice(startIndex, startIndex + displayCount);
  const canScrollLeft = startIndex > 0;
  const canScrollRight = startIndex + displayCount < userMeals.length;

  // Calculate the current range of meals being shown
  const currentStartPosition = userMeals.length > 0 ? startIndex + 1 : 0;
  const currentEndPosition = Math.min(startIndex + displayCount, userMeals.length);

  // Change this function to use the correct path
  const getDefaultMealImage = (mealTime) => {
    const time = (mealTime || "").toLowerCase();
    if (time.includes('breakfast')) return '/assets/images/oatmeal.png';
    if (time.includes('lunch')) return '/assets/images/salmon2.png';
    if (time.includes('dinner')) return '/assets/images/pasta.png';
    return '/assets/images/default.png'; // Updated path
  };

  const getMealImage = (meal) => {
    if (!meal.image) {
      return getDefaultMealImage(meal.time);
    }
    // Format according to your specification
    return `/images/foods/${meal.image}`;
  };

  const handleImageClick = (e, meal) => {
    e.stopPropagation(); // Prevent triggering the meal selection
    setSelectedImage(getMealImage(meal));
    setShowEnlargedImage(true);
  };

  const handleAddClick = (e, meal) => {
    e.stopPropagation(); // Prevent triggering meal selection
    if (onAddMeal) {
      onAddMeal(meal);
      
      // Optionally provide feedback in the UserMadeMeals component as well
      setHoveredMealId(meal.id);
      setTimeout(() => {
        setHoveredMealId(null);
      }, 2000);
    }
  };

  const handleDeleteClick = (e, meal) => {
    e.stopPropagation(); // Prevent triggering meal selection
    setMealToDelete(meal);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!mealToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication information not found');
      }
      
      // Send delete request to the API
      await axios.delete(`http://localhost:8080/api/meals/${mealToDelete.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Remove the meal from local state
      setUserMeals(prevMeals => prevMeals.filter(m => m.id !== mealToDelete.id));
      
      // Call the parent's onDeleteMeal callback if provided
      if (onDeleteMeal) onDeleteMeal(mealToDelete);
      
    } catch (err) {
      console.error('Error deleting meal:', err);
      // Handle error - you could set an error state or show a toast notification
    } finally {
      // Close the confirmation dialog
      setShowDeleteConfirmation(false);
      setMealToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setMealToDelete(null);
  };

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
          src={selectedImage}
          alt="Enlarged Meal Image"
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          onError={(e) => {
            console.error('Enlarged image failed to load:', e);
            e.target.src = '/images/foods/default.png';
          }}
        />
      </div>
    </div>
  );

  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-2xl">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Confirm Deletion</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "{mealToDelete?.name}"? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={cancelDelete}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full lg:w-3/10 bg-blue-50 rounded-xl p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-700">Your made meals</h2>
        <div className="flex space-x-2">
          <button 
            onClick={handlePrevious} 
            disabled={!canScrollLeft}
            className={`p-1 rounded-full ${canScrollLeft ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-gray-100 text-gray-400'}`}
            aria-label="Previous meals"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={handleNext} 
            disabled={!canScrollRight}
            className={`p-1 rounded-full ${canScrollRight ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-gray-100 text-gray-400'}`}
            aria-label="Next meals"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      <p className="text-[13px] text-gray-600 mb-6">Here's a list of the meals you have created:</p>
      
      {loading ? (
        <div className="flex justify-center py-6">
          <div className="animate-pulse text-gray-500">Loading your meals...</div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">{error}</div>
      ) : userMeals.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500 mb-1 mt-14">You haven't added any meals yet.</p>
          <p className="text-sm text-gray-400">Create your first meal using the "Add New Meal" button.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleMeals.map((meal) => (
            <div 
              key={meal.id} 
              className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer relative group"
              onClick={() => onSelectMeal && onSelectMeal(meal)}
              onMouseEnter={() => setHoveredMealId(meal.id)}
              onMouseLeave={() => setHoveredMealId(null)}
            >
              {/* Action buttons that appear on hover */}
              <div className="absolute top-2 right-2 flex space-x-1 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                <div className="relative">
                  <button 
                    className={`p-1 rounded-full transition-colors duration-200 ${
                      hoveredButton === `add-${meal.id}` ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={(e) => handleAddClick(e, meal)}
                    aria-label="Add meal"
                    onMouseEnter={() => setHoveredButton(`add-${meal.id}`)}
                    onMouseLeave={() => setHoveredButton(null)}
                  >
                    <Plus size={16} />
                  </button>
                  {hoveredButton === `add-${meal.id}` && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                      Add meal
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <button 
                    className={`p-1 rounded-full transition-colors duration-200 ${
                      hoveredButton === `delete-${meal.id}` ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={(e) => handleDeleteClick(e, meal)}
                    aria-label="Delete meal"
                    onMouseEnter={() => setHoveredButton(`delete-${meal.id}`)}
                    onMouseLeave={() => setHoveredButton(null)}
                  >
                    <Trash2 size={16} />
                  </button>
                  {hoveredButton === `delete-${meal.id}` && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                      Delete meal
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div 
                  className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0 cursor-pointer shadow-md"
                  onClick={(e) => handleImageClick(e, meal)}
                >
                  <img 
                    src={getMealImage(meal)} 
                    alt={meal.name} 
                    onError={(e) => {
                      e.target.src = '/images/foods/default.png';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-800 truncate">{meal.name}</h3>
                  <p className="text-xs text-gray-500">{meal.time} • {meal.calories || '0'} cal</p>
                </div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-600">
                <span>P: {meal.protein || 0}g</span>
                <span>C: {meal.carbs || 0}g</span>
                <span>F: {meal.fats || 0}g</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {userMeals.length > 0 && (
        <div className="text-center pt-2">
          <p className="text-xs text-gray-500 mt-4">
            Showing {currentStartPosition}-{currentEndPosition} of {userMeals.length} meals
          </p>
        </div>
      )}

      {/* Image Enlargement Modal */}
      {showEnlargedImage && <EnlargedImageModal />}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && <DeleteConfirmationModal />}
    </div>
  );
};

export default UserMadeMeals;