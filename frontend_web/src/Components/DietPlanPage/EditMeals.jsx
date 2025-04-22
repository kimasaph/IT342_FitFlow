import React, { useState } from 'react';

const EditMeals = ({ allMeals, onAssignMeal }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMealTime, setSelectedMealTime] = useState(null);
  const [selectedFoodTag, setSelectedFoodTag] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const mealTimes = ["Breakfast", "2nd breakfast", "Lunch", "Dinner", "Snack"];
  
  // Food tags from the DietPlan component
  const foodTags = [
    { emoji: "🥑", label: "Vegan" },
    { emoji: "🥕", label: "Healthy" },
    { emoji: "🌽", label: "Gains" },
    { emoji: "🌶️", label: "Spicy" },
    { emoji: "🍝", label: "High carb" },
    { emoji: "🦐", label: "Seafood" },
    { emoji: "🫐", label: "Fruity" },
  ];

  const mealTimeIcons = {
    "Breakfast": "🌅",
    "2nd breakfast": "🍳",
    "Lunch": "🍽️",
    "Dinner": "🌙",
    "Snack": "🍿"
  };
  

  // Open the modal
  const openModal = () => {
    setIsModalOpen(true);
    setSelectedMealTime(null);
    setSelectedFoodTag(null);
    setSelectedMeal(null);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMealTime(null);
    setSelectedFoodTag(null);
    setSelectedMeal(null);
  };

  // Handle meal time selection
  const handleMealTimeSelect = (time) => {
    if (selectedMealTime === time) {
      setSelectedMealTime(null);
    } else {
      setSelectedMealTime(time);
    }
  };

  // Handle food tag selection
  const handleFoodTagSelect = (tag) => {
    // If clicking the same tag, deselect it
    if (selectedFoodTag && selectedFoodTag.label === tag.label) {
      setSelectedFoodTag(null);
    } else {
      setSelectedFoodTag(tag);
    }
  };

  // Handle meal selection
  const handleMealSelect = (meal) => {
    setSelectedMeal(meal);
  };

  // Handle assigning a meal to a specific time
  const handleConfirmSelection = () => {
    if (selectedMeal && selectedMealTime) {
      onAssignMeal(selectedMeal, selectedMealTime);
      closeModal();
    }
  };

  // Filter meals based on selected criteria
  const getFilteredMeals = () => {
    let filtered = [...allMeals];
    
    // Filter by food tag if selected
    if (selectedFoodTag) {
      filtered = filtered.filter(meal => 
        meal.tags && meal.tags.includes(selectedFoodTag.label)
      );
    }
    
    return filtered;
  };

  return (
    <>
      {/* Edit Meals Button */}
      <div className="w-full bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={openModal}>
        <div className="p-6 flex flex-col items-center justify-center space-y-3">
          <div className="bg-blue-100 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg text-gray-800">Edit Meals</h3>
          <p className="text-gray-500 text-sm text-center">Personalize your meals to different times</p>
        </div>
      </div>

      {/* Modal for editing meals */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-blue-50 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Edit Your Meal Plan
              </h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Step 1: Meal Time Selection */}
              <div className="mb-8">
                <h4 className="font-medium text-gray-800 mb-3">1. Select meal time:</h4>
                <div className="flex flex-wrap gap-3">
                  {mealTimes.map((time, index) => (
                    <button
                      key={index}
                      onClick={() => handleMealTimeSelect(time)}
                      className={`relative px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all duration-300 transform
                        ${selectedMealTime === time
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white scale-105 font-bold'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'}
                      `}
                    >
                      <span className="font-medium">{mealTimeIcons[time]} {time}</span>
                      {/* Cool animated selection ring */}
                      {selectedMealTime === time && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-indigo-500 animate-ping" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Food Tag Selection - Updated with enhanced selection effect */}
              <div className="mb-8">
                <h4 className="font-medium text-gray-800 mb-3">2. Filter by food category (optional):</h4>
                <div className="flex flex-wrap gap-2">
                  {foodTags.map((tag, index) => (
                    <div
                      key={index}
                      onClick={() => handleFoodTagSelect(tag)}
                      className={`relative flex items-center gap-2 px-3 py-1.5 border rounded-md text-sm 
                        transition-all duration-300 cursor-pointer
                        ${selectedFoodTag && selectedFoodTag.label === tag.label
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white scale-105 font-semibold'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'}`}
                    >
                      <span>{tag.emoji}</span>
                      <span>{tag.label}</span>
                      {selectedFoodTag && selectedFoodTag.label === tag.label && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-indigo-500 animate-ping" />
                      )}
                    </div>
                  ))}
                </div>
              </div>


              {/* Step 3: Select a Meal */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">
                  3. Select a meal{selectedMealTime ? ` for ${selectedMealTime}` : ''}:
                </h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {getFilteredMeals().map((meal, index) => (
                    <div 
                      key={index} 
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:-translate-y-1 hover:shadow
                        ${selectedMeal === meal 
                          ? 'bg-blue-50 border-blue-300 shadow-md' 
                          : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300'}`}
                      onClick={() => handleMealSelect(meal)}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 mb-3">
                          <img 
                            src={`/images/foods/${meal.image || 'default.png'}`}
                            alt={meal.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <h4 className="font-medium text-center text-sm">{meal.name}</h4>
                        
                        {/* Show calories */}
                        <p className="text-xs text-gray-500 mt-1">{meal.calories} kcal</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Show message when no meals match the filter */}
                {getFilteredMeals().length === 0 && (
                  <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mt-2">
                    <p className="text-yellow-800">
                      No meals found with the selected filters. Try selecting different options.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 mr-2 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmSelection}
                disabled={!selectedMeal || !selectedMealTime}
                className={`px-4 py-2 rounded-lg transition
                  ${(!selectedMeal || !selectedMealTime) 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white font-bold'}`}
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditMeals;