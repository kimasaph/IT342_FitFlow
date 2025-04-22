  import React, { useState, useRef, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import toast, { Toaster } from "react-hot-toast";
  import Dashboard from "../DashboardSimple";

  import AddMealButton from "./AddMealButton";
  import UserMadeMeals from "./UserMadeMeals";
  import WeeklyMealPlan from "./WeeklyMealPlan";
  import EditMeals from "./EditMeals";
  import PreMadeMeals from "./PreMadeMeals";

  const calorieOptions = [
    { label: "Detox", kcal: "750" },
    { label: "Cleanse", kcal: "900" },
    { label: "Cutting", kcal: "1300" },
    { label: "Decreasing", kcal: "1500" },
    { label: "Balance", kcal: "2000" },
    { label: "Lean Bulk", kcal: "2500" },
    { label: "Muscle Gain", kcal: "2800" },
    { label: "Bulking", kcal: "3000" },
    { label: "Athletic", kcal: "3200" },
    { label: "Mass Gain", kcal: "3600" },
  ];

  const tags = [
    { emoji: "🥑", label: "Vegan" },
    { emoji: "🥕", label: "Healthy" },
    { emoji: "🌽", label: "Gains" },
    { emoji: "🌶️", label: "Spicy" },
    { emoji: "🍝", label: "High carb" },
    { emoji: "🦐", label: "Seafood" },
    { emoji: "🫐", label: "Fruity" },
  ];

  // MealCardModal Component
  const MealCardModal = ({ meal, isOpen, onClose }) => {
    if (!isOpen) return null;
    
    // Define background colors for different meal times for the header
    const getHeaderBgColor = (mealTime) => {
      switch (mealTime.toLowerCase()) {
        case 'breakfast':
          return 'bg-amber-100';
        case '2nd breakfast':
          return 'bg-pink-100';
        case 'snack':
          return 'bg-lime-100';
        case 'lunch':
          return 'bg-cyan-100';
        case 'dinner':
          return 'bg-violet-100';
        default:
          return 'bg-gray-100';
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header with Meal Time */}
          <div className={`${getHeaderBgColor(meal.time)} px-6 py-4 flex justify-between items-center`}>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{meal.time}</h3>
              <p className="text-sm text-gray-600">{meal.calories} calories</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image Section */}
              <div className="md:w-1/3 flex-shrink-0 mt-16">
                <div className="rounded-lg">
                  <img 
                    src={`/images/foods/${meal.image || 'default.png'}`}
                    alt={meal.name}
                    className="w-50 h-50 object-contain shadow-xl rounded-full"
                  />
                </div>
              </div>
              
              {/* Details Section */}
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{meal.name}</h2>
                
                {/* Description */}
                <p className="text-gray-700 mb-6 text-sm">{meal.description || "No description available."}</p>
                
                {/* Tags Section */}
                {meal.tags && meal.tags.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {meal.tags.map((tag, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Macros Cards */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-blue-600 font-semibold text-lg">{meal.protein}g</p>
                    <p className="text-sm text-gray-600">Protein</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-green-600 font-semibold text-lg">{meal.carbs}g</p>
                    <p className="text-sm text-gray-600">Carbs</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3 text-center">
                    <p className="text-yellow-600 font-semibold text-lg">{meal.fats}g</p>
                    <p className="text-sm text-gray-600">Fats</p>
                  </div>
                </div>
                
                {/* Ingredients */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Ingredients:</h3>
                  <p className="text-gray-700 text-sm">{meal.ingredients || "No ingredients listed."}</p>
                </div>
                
                {/* Notes */}
                {meal.notes && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <h3 className="text-md font-semibold text-gray-800 mb-1">Notes</h3>
                    <p className="text-gray-700 text-sm">{meal.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Modal Footer */}
          <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 mr-2 transition"
            >
              Close
            </button>
            <button 
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-white transition"
            >
              Add to Today's Plan
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Updated MealCard component to include replacement feedback 
  const MealCard = ({ meal, index, onMealClick, isReplaced }) => {
    // Define background colors for different meal times
    const getBgColor = (mealTime) => {
      switch (mealTime.toLowerCase()) {
        case 'breakfast':
          return 'bg-amber-50';
        case '2nd breakfast':
          return 'bg-pink-50';
        case 'snack':
          return 'bg-lime-50';
        case 'lunch':
          return 'bg-cyan-50';
        case 'dinner':
          return 'bg-violet-50';
        default:
          return 'bg-gray-50';
      }
    };

    return (
      <div 
        className={`
          relative rounded-2xl p-5 pt-20
          ${getBgColor(meal.time)}
          shadow-md w-70 mt-20
          transition-all duration-300 ease-in-out
          hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02]
          hover:ring-1 hover:ring-gray-200
          cursor-pointer
          ${isReplaced ? 'ring-2 ring-green-500' : ''}
        `}
        onClick={() => onMealClick(meal)}
      >    
        {/* Floating plate image */}
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
          <img 
            src={`/images/foods/${meal.image || 'default.png'}`}
            alt={meal.name}
            className="w-58 h-58 object-contain shadow-xl rounded-full"
          />
        </div>

        {/* Show replacement badge if needed */}
        {isReplaced && (
          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Replaced
          </div>
        )}

        {/* Meal time */}
        <p className="text-sm font-medium text-grey-600 capitalize mb-1">{meal.time}</p>

        {/* Meal name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">{meal.name}</h3>

        {/* Tags */}
        {meal.tags && meal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {meal.tags.map((tag, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                {typeof tag === 'object' ? tag.label : tag}
              </span>
            ))}
          </div>
        )}

        {/* Calories and total weight */}
        <p className="text-sm text-gray-500">
          {meal.calories}kcal | {meal.protein}p | {meal.carbs}c | {meal.fats}g of fat
        </p>
      </div>
    );
  };

  const DietPlan = () => {
    const [allMeals, setAllMeals] = useState(PreMadeMeals); // Store all meals
    const [filteredMeals, setFilteredMeals] = useState([]); // Store filtered meals to display
    const [drinks, setDrinks] = useState([]); // Add state for drinks
    const [selectedCalorieIndex, setSelectedCalorieIndex] = useState(1);
    const [selectedTag, setSelectedTag] = useState(null); // Track the selected tag (only one at a time)
    const [userMadeMeals, setUserMadeMeals] = useState([]);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [dailyPlanGenerated, setDailyPlanGenerated] = useState(false);
    const [replacedMealTimes, setReplacedMealTimes] = useState([]);
    const navigate = useNavigate();
    
    // Get today's date as a string to use as a key for storing daily plan
    const getTodayString = () => {
      const today = new Date();
      return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    };

    // Function to get one random meal of each type
    const getOneMealPerType = (meals) => {
      const mealTypes = ['breakfast', '2nd breakfast', 'lunch', 'dinner', 'snack'];
      const selectedMeals = [];
      
      // For each meal type, find all meals of that type
      mealTypes.forEach(type => {
        const mealsOfType = meals.filter(meal => 
          meal.time.toLowerCase() === type.toLowerCase()
        );
        
        // If there are meals of this type, select one randomly
        if (mealsOfType.length > 0) {
          const randomIndex = Math.floor(Math.random() * mealsOfType.length);
          selectedMeals.push(mealsOfType[randomIndex]);
        }
      });
      
      return selectedMeals;
    };

    // Get a random meal of a specific type from available meals
    const getRandomMealOfType = (mealType) => {
      const mealsOfType = allMeals.filter(meal => 
        meal.time.toLowerCase() === mealType.toLowerCase()
      );
      
      if (mealsOfType.length > 0) {
        const randomIndex = Math.floor(Math.random() * mealsOfType.length);
        return mealsOfType[randomIndex];
      }
      
      return null;
    };

    // Initialize with one meal per type when the component mounts or check local storage
    useEffect(() => {
      // Try to get today's meal plan from localStorage
      const todayKey = getTodayString();
      const savedMealPlan = localStorage.getItem(`mealPlan_${todayKey}`);

      if (savedMealPlan) {
        // We have a saved meal plan for today
        setFilteredMeals(JSON.parse(savedMealPlan));
        setDailyPlanGenerated(true);
      } else {
        // Generate a new meal plan for today
        const oneMealPerType = getOneMealPerType(allMeals);
        setFilteredMeals(oneMealPerType);
        // Save to localStorage
        localStorage.setItem(`mealPlan_${todayKey}`, JSON.stringify(oneMealPerType));
        setDailyPlanGenerated(true);
      }
      
      setIsInitialLoad(false);
    }, []);

    // Save meal plan to localStorage whenever it changes (but only after initial load)
    useEffect(() => {
      if (!isInitialLoad && dailyPlanGenerated) {
        const todayKey = getTodayString();
        localStorage.setItem(`mealPlan_${todayKey}`, JSON.stringify(filteredMeals));
      }
    }, [filteredMeals, isInitialLoad, dailyPlanGenerated]);

    // Calculate total macros from filtered meals
    const totalMacros = filteredMeals.reduce(
      (acc, meal) => {
        acc.calories += meal.calories;
        acc.protein += meal.protein;
        acc.carbs += meal.carbs;
        acc.fats += meal.fats;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
    
    // Handle clicking on a meal card
    const handleMealClick = (meal) => {
      setSelectedMeal(meal);
      setIsModalOpen(true);
    };

    // Add this function to handle meal reassignment
    const handleAssignMeal = (meal, newTime) => {
      // First, check if there's already a meal with this time in the filtered meals (daily plan)
      const mealTimeExists = filteredMeals.some(m => m.time.toLowerCase() === newTime.toLowerCase());
      
      if (mealTimeExists) {
        // Replace the meal in filtered meals (daily plan)
        const updatedFilteredMeals = filteredMeals.map(existingMeal => {
          if (existingMeal.time.toLowerCase() === newTime.toLowerCase()) {
            // Create a new meal object with the selected meal's properties but with the specified time
            return { ...meal, time: newTime };
          }
          return existingMeal;
        });
        
        setFilteredMeals(updatedFilteredMeals);
        
        // Set this meal time as recently replaced for visual feedback
        setReplacedMealTimes([newTime.toLowerCase()]);
        
        // Show success toast when meal is replaced
        toast.success(`Changed your ${newTime} to ${meal.name}!`, {
          duration: 3000,
          position: 'top-center',
          icon: '🔄',
        });
        
        // Clear the replaced status after 3 seconds
        setTimeout(() => {
          setReplacedMealTimes([]);
        }, 3000);
      } else {
        // If no meal with this time exists, add it to the filtered meals
        setFilteredMeals([...filteredMeals, { ...meal, time: newTime }]);
        
        // Show success toast
        toast.success(`Added ${meal.name} as your ${newTime}!`, {
          duration: 3000,
          position: 'top-center',
          icon: '🍽️',
        });
      }
      
      // Optionally update allMeals if needed (this might not be necessary depending on your app logic)
      // But make sure we're updating with the correct time
      const updatedMeal = { ...meal, time: newTime };
      
      // Save updated meal plan to localStorage
      const todayKey = getTodayString();
      localStorage.setItem(`mealPlan_${todayKey}`, JSON.stringify(
        mealTimeExists ? 
        filteredMeals.map(m => m.time.toLowerCase() === newTime.toLowerCase() ? updatedMeal : m) :
        [...filteredMeals, updatedMeal]
      ));
    };
    
    // Handle closing the modal
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    // Handle adding a new meal to the user's made meals
    const handleAddUserMadeMeal = (newMeal) => {
      // Add the new meal to the userMadeMeals state
      setUserMadeMeals(prevMeals => {
        // Check if meal already exists by id to prevent duplicates
        if (newMeal.id && prevMeals.some(meal => meal.id === newMeal.id)) {
          return prevMeals;
        }
        return [...prevMeals, newMeal];
      });
    };

    // Update handleAddMeal function to ensure description is preserved
    const handleAddMeal = (meal) => {
      // Check if this is a replacement from user made meals
      if (meal.time) {
        // Find and replace an existing meal with the same time
        const updatedMeals = filteredMeals.map(existingMeal => {
          if (existingMeal.time.toLowerCase() === meal.time.toLowerCase()) {
            console.log('Replacing meal with:', meal); // Add this for debugging
            return {...meal}; // Use spread operator to ensure we're not losing properties
          }
          return existingMeal;
        });
        
        setFilteredMeals(updatedMeals);
        
        // Also update allMeals to reflect this change
        setAllMeals(prevMeals => {
          // Replace the meal with the same time
          const mealIndex = prevMeals.findIndex(m => 
            m.time.toLowerCase() === meal.time.toLowerCase() && 
            filteredMeals.some(fm => fm.id === m.id)
          );
          
          if (mealIndex !== -1) {
            // Create a new array with the replacement
            const newMeals = [...prevMeals];
            newMeals[mealIndex] = {...meal}; // Use spread operator here too
            return newMeals;
          }
          
          // If no match was found, just add the meal
          return [...prevMeals, {...meal}];
        });
        
        // Set this meal time as recently replaced for visual feedback
        setReplacedMealTimes([meal.time.toLowerCase()]);
        
        // Show success toast when meal is added to daily plan
        toast.success(`Added ${meal.name} to your ${meal.time}!`, {
          duration: 3000,
          position: 'top-center',
          icon: '🍽️',
        });
        
        // Clear the replaced status after 3 seconds
        setTimeout(() => {
          setReplacedMealTimes([]);
        }, 3000);
      } else {
        // Original behavior for adding new meals
        const mealWithTags = { ...meal, tags: meal.tags || [] };
        console.log('Adding new meal with data:', mealWithTags); // Add this for debugging
        setAllMeals(prevMeals => [...prevMeals, mealWithTags]);
        filterMealsByTag(selectedTag, [...allMeals, mealWithTags]);
        
        // Show success toast
        toast.success('New meal added!', {
          duration: 3000,
          position: 'top-center',
        });
      }
    };

    const handleDeleteUserMeal = (deletedMeal) => {
      // First, check if this meal is in the current filtered meals (daily plan)
      const mealInPlan = filteredMeals.find(meal => meal.id === deletedMeal.id);
      
      if (mealInPlan) {
        // Store the meal time that was deleted/replaced
        const deletedMealTime = deletedMeal.time.toLowerCase();
        
        // Get a random meal of the same type to replace it
        const replacementMeal = getRandomMealOfType(deletedMealTime);
        
        if (replacementMeal) {
          // Update the filtered meals to replace the deleted meal
          const updatedMeals = filteredMeals.map(meal => {
            if (meal.id === deletedMeal.id) {
              return replacementMeal; // Replace with the randomly selected meal
            }
            return meal;
          });
          
          // Update the filtered meals
          setFilteredMeals(updatedMeals);
          
          // Track the meal time that was replaced
          setReplacedMealTimes([deletedMealTime]);
          
          // Show replacement toast
          toast.success(`${deletedMeal.name} was deleted, replaced with ${replacementMeal.name}`, {
            duration: 4000,
            position: 'top-center',
            icon: '🔄',
          });
          
          // Clear the replaced status after 3 seconds
          setTimeout(() => {
            setReplacedMealTimes([]);
          }, 3000);
        }
      } else {
        // If the meal wasn't in the plan, ensure we clear any replacement highlights
        setReplacedMealTimes([]);
      }
      
      // Remove from userMadeMeals as before
      setUserMadeMeals(prevMeals => prevMeals.filter(meal => meal.id !== deletedMeal.id));
      
      // Basic delete toast
      toast.success(`Deleted ${deletedMeal.name}`, {
        duration: 3000,
        position: 'top-center',
        icon: '🗑️',
        style: {
          backgroundColor: '#fee2e2', // light red
          color: '#991b1b', // dark red
        },
      });
    };
    
    // Filter meals based on selected tag - but don't randomize after initial load
    const filterMealsByTag = (tagIndex, mealsToFilter = allMeals) => {
      if (tagIndex === null) {
        // If daily plan was already generated, don't randomize again
        if (dailyPlanGenerated) {
          return; // Keep current filtered meals
        }
        
        // Otherwise, generate one meal per type
        const oneMealPerType = getOneMealPerType(mealsToFilter);
        setFilteredMeals(oneMealPerType);
        return;
      }
      
      const tagLabel = tags[tagIndex].label;
      
      // Filter meals that have the selected tag
      const filteredByTag = mealsToFilter.filter(meal => 
        meal.tags && meal.tags.includes(tagLabel)
      );
      
      // If we have a daily plan generated and we're just filtering by tag:
      if (dailyPlanGenerated) {
        // Update filtered meals to only show ones that match both the current plan's meal types
        // and the selected tag
        const currentMealTypes = filteredMeals.map(meal => meal.time.toLowerCase());
        
        const updatedFilteredMeals = [...filteredMeals];
        
        // For each meal type in our current plan
        currentMealTypes.forEach(mealType => {
          // Find meals of this type that match the tag
          const mealsOfTypeWithTag = filteredByTag.filter(
            meal => meal.time.toLowerCase() === mealType
          );
          
          // If we found matches, replace the current meal of this type with a random one that matches tag
          if (mealsOfTypeWithTag.length > 0) {
            const randomIndex = Math.floor(Math.random() * mealsOfTypeWithTag.length);
            const replacementMeal = mealsOfTypeWithTag[randomIndex];
            
            // Replace the meal of this type in our filtered list
            const indexToReplace = updatedFilteredMeals.findIndex(
              meal => meal.time.toLowerCase() === mealType
            );
            
            if (indexToReplace !== -1) {
              updatedFilteredMeals[indexToReplace] = replacementMeal;
            }
          }
        });
        
        setFilteredMeals(updatedFilteredMeals);
      } else {
        // If we're still initializing, just get one of each type from filtered meals
        const filteredByTagAndType = getOneMealPerType(filteredByTag);
        setFilteredMeals(filteredByTagAndType);
        setDailyPlanGenerated(true);
      }
    };
    
    // Handle tag selection
    const handleTagClick = (tagIndex) => {
      // If the clicked tag is already selected, deselect it
      if (selectedTag === tagIndex) {
        setSelectedTag(null);
        filterMealsByTag(null);
      } else {
        // Otherwise, select the new tag
        setSelectedTag(tagIndex);
        filterMealsByTag(tagIndex);
      }
    };

    const dietPlanContent = (
      <div className="p-4 md:p-9 bg-white min-h-screen space-y-6">
        {/* Toast Container */}
        <Toaster />
      
        {/* Modal for meal details */}
        <MealCardModal 
          meal={selectedMeal} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />

        {/* Top section - meal plan options */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Weekly Meal Plan Creator Component */}
          <WeeklyMealPlan
            selectedCalorieIndex={selectedCalorieIndex}
            setSelectedCalorieIndex={setSelectedCalorieIndex}
          />
    
          {/* UserMadeMeals Component */}
          <UserMadeMeals 
            onSelectMeal={(selectedMeal) => {
              // Handle meal selection, maybe add it to meals array
              console.log("Selected meal:", selectedMeal);
            }} 
            onAddMeal={handleAddMeal}
            onDeleteMeal={handleDeleteUserMeal}
            userMealsData={userMadeMeals} // Pass user-made meals data
          />
        </div>
    
        {/* Tags and Daily Macro Summary Box - Improved responsive layout */}
        <div className="mt-4 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 md:max-w-3/4 mt-[-2px]">
            {tags.map((tag, index) => (
              <div
                key={index}
                onClick={() => handleTagClick(index)}
                className={`flex items-center gap-2 px-3 py-1.5 border rounded-md text-xs md:text-md 
                  transition-all duration-300 cursor-pointer
                  ${selectedTag === index ? 
                    'bg-blue-500 text-white border-blue-500 shadow-md transform scale-105' : 
                    'bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:-translate-y-1 hover:shadow'}`}
              >
                <span>{tag.emoji}</span>
                <span>{tag.label}</span>
              </div>
            ))}
          </div>
    
          {/* Add Meal Button */}
          <AddMealButton onAddMeal={handleAddUserMadeMeal} />
          
          {/* Daily Macro Summary Box - Now using calculated totalMacros */}
          <div className="bg-white rounded-xl p-5 shadow-sm border text-sm w-full md:w-auto md:min-w-64 text-gray-700 flex-shrink-0 ml-2">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-800 text-[15px]">
                {new Date().toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className="text-xs text-gray-500">{Math.round(totalMacros.calories)} kcal</span>
            </div>
            <div className="flex justify-between text-center font-semibold text-gray-900">
              <div>
                <p className="text-lg">{Math.round(totalMacros.protein)}</p>
                <p className="text-xs font-normal text-gray-500">Proteins</p>
              </div>
              <div>
                <p className="text-lg">{Math.round(totalMacros.fats)}</p>
                <p className="text-xs font-normal text-gray-500">Fat</p>
              </div>
              <div>
                <p className="text-lg">{Math.round(totalMacros.carbs)}</p>
                <p className="text-xs font-normal text-gray-500">Carbs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main heading */}
        <div>
          <h1 className="text-2xl font-bold ml-3 mt-[-77px]">Your Daily Recommendations</h1>
          <p className="text-gray-600 mb-4 text-[14px] ml-3">
            Based on your goal to build muscle and maintain {calorieOptions[selectedCalorieIndex].kcal} kcal/day
          </p>
          
          
          {/* Show message when no meals match the filter */}
          {filteredMeals.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mt-2 ml-3 max-w-md">
              <p className="text-yellow-800">
                No meals found with the tag "{tags[selectedTag]?.label}". 
                Try selecting a different tag.
              </p>
            </div>
          )}
        </div>

  {/* Meal cards */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
    {filteredMeals.map((meal, idx) => (
      <MealCard 
        key={idx} 
        meal={meal} 
        index={idx} 
        onMealClick={handleMealClick}
        isReplaced={replacedMealTimes.includes(meal.time.toLowerCase())}
      />
    ))}
  </div>
        
        <div className="mt-10">
          <EditMeals 
            allMeals={allMeals} 
            onAssignMeal={handleAssignMeal} 
          />
        </div>
      </div>
    );

    return <Dashboard>{dietPlanContent}</Dashboard>;
  };

  export default DietPlan;