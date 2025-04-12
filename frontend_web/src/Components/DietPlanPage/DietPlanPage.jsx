import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../DashboardSimple";
import { ChevronRight, ChevronLeft, Plus, X } from "lucide-react";
import { dietPlanApi, mealApi } from "../../services/api";

import AddDrink from "./AddDrink";

const sampleMeals = [
  {
    time: "Breakfast",
    name: "Oatmeal with fresh berries and almonds",
    calories: 587,
    protein: 12,
    carbs: 45,
    fats: 10,
    notes: "Add peanut butter if needed.",
    image: 'oatmeal.png',
  },
  {
    time: "2nd breakfast",
    name: "Grilled toast with pickle and eggs",
    calories: 587,
    protein: 40,
    carbs: 50,
    fats: 20,
    notes: "Include mixed veggies.",
    image: 'salmon.png',
  },
  {
    time: "Lunch",
    name: "Cheeseburger with bacon and fried egg",
    calories: 587,
    protein: 35,
    carbs: 40,
    fats: 18,
    notes: "Add lemon for taste.",
    image: 'salmon2.png',
  },
  {
    time: "Dinner",
    name: "Salmon and Brown Rice",
    calories: 500,
    protein: 35,
    carbs: 40,
    fats: 18,
    notes: "Add lemon for taste.",
    image: 'pasta.png',
  },
  {
    time: "Snack",
    name: "Greek Yogurt & Berries",
    calories: 200,
    protein: 15,
    carbs: 20,
    fats: 5,
    notes: "Use low-fat yogurt.",
    image: 'yogurt2.png',
  },
];

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

// MealCard Component
const MealCard = ({ meal, index }) => {
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
    <div className={`
      relative rounded-2xl p-5 pt-20
      ${getBgColor(meal.time)}
      shadow-md w-70 mt-20
      transition-all duration-300 ease-in-out
      hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02]
      hover:ring-1 hover:ring-gray-200
    `}>    
      {/* Floating plate image */}
      <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
        <img 
          src={`/images/foods/${meal.image || 'default.png'}`}
          alt={meal.name}
          className="w-58 h-58 object-contain shadow-xl rounded-full"
        />
      </div>

      {/* Meal time */}
      <p className="text-sm font-medium text-grey-600 capitalize mb-1">{meal.time}</p>

      {/* Meal name */}
      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">{meal.name}</h3>

      {/* Calories and total weight */}
      <p className="text-sm text-gray-500">
        {meal.calories}kcal | {meal.protein}p | {meal.carbs}c | {meal.fats}g of fat
      </p>

      {/* Optional Change button */}
      {index === 2 && (
        <button className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition">
          Change
        </button>
      )}
    </div>
  );
};

// Add Meal Component
const AddMealButton = ({ onAddMeal, dietPlanId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mealData, setMealData] = useState({
    name: '',
    description: '',
    protein: '',
    fats: '',
    carbs: '',
    ingredients: '',
    calories: '',
    time: 'Breakfast'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMealData({
      ...mealData,
      [name]: value
    });
  };

  // In the AddMealButton component
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if we have a diet plan ID
    if (!dietPlanId) {
      alert("No active diet plan found. Please create a diet plan first.");
      setIsModalOpen(false);
      return;
    }
    
    // Format the meal data to match the expected format
    const newMeal = {
      time: mealData.time,
      name: mealData.name,
      calories: Number(mealData.calories),
      protein: Number(mealData.protein),
      carbs: Number(mealData.carbs),
      fats: Number(mealData.fats),
      notes: mealData.description,
      ingredients: mealData.ingredients
    };
    
    try {
      // Call the API to create the meal
      const response = await mealApi.createMeal(dietPlanId, newMeal);
      
      // Add the newly created meal to the local state
      if (onAddMeal) {
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
        time: 'Breakfast'
      });
      
      // Optional: Show success message
      alert('Meal added successfully!');
    } catch (error) {
      console.error('Error creating meal:', error);
      alert('Failed to add meal. Please try again.');
    }
  };

  return (
    <div className="relative">
      {/* Add Meal Button */}
      <div 
        className="bg-white rounded-xl p-4 shadow-sm border text-sm w-full md:w-auto md:min-w-40 text-gray-700 flex-shrink-0 cursor-pointer hover:bg-gray-50 transition-colors mr-[-32px]"
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
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4 relative">
            <button 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Meal</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Name</label>
                  <input
                    type="text"
                    name="name"
                    value={mealData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
                  <select
                    name="time"
                    value={mealData.time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="2nd breakfast">2nd breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description/Notes</label>
                  <textarea
                    name="description"
                    value={mealData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
                  <textarea
                    name="ingredients"
                    value={mealData.ingredients}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Meal
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

const itemWidth = 100;
const gap = 8;

// Program Carousel Component
const ProgramCarousel = ({ options, selectedIndex, onSelect }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(null);
  
  // Fixed number of visible items
  const visibleItemCount = 5;
  const carouselRef = useRef(null);
  
  // Always show 4 items in the carousel
  const visibleOptions = React.useMemo(() => {
    // Ensure we always have visibleItemCount items
    const result = [];
    for (let i = 0; i < visibleItemCount; i++) {
      const index = startIndex + i;
      // If we're within bounds, use actual option
      if (index >= 0 && index < options.length) {
        result.push({ ...options[index], actualIndex: index });
      } else {
        // Otherwise use a placeholder (shouldn't be visible)
        result.push({ label: "", kcal: "", actualIndex: -1, placeholder: true });
      }
    }
    return result;
  }, [startIndex, options]);

  const handleNext = () => {
    if (startIndex + visibleItemCount < options.length && !isAnimating) {
      setIsAnimating(true);
      setDirection('right');
      
      // Delay the actual state update until animation completes
      setTimeout(() => {
        setStartIndex(prev => prev + 1);
        setIsAnimating(false);
      }, 100); // Match duration with CSS transition
    }
  };

  const handlePrev = () => {
    if (startIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setDirection('left');
      
      // Delay the actual state update until animation completes
      setTimeout(() => {
        setStartIndex(prev => prev - 1);
        setIsAnimating(false);
      }, 100); // Match duration with CSS transition
    }
  };

  return (
  <div className="flex items-center gap-4 relative">
    {/* Left arrow */}
    <button
      onClick={handlePrev}
      className={`flex items-center justify-center w-8 h-8 rounded-full bg-white shadow flex-shrink-0 
        transition-all duration-200 transform z-10
        ${startIndex > 0 ? 
          'opacity-100 hover:bg-blue-50 hover:scale-110 hover:shadow-md cursor-pointer' : 
          'opacity-50 cursor-not-allowed'}`}
      disabled={startIndex === 0}
    >
      <ChevronLeft className="text-gray-600" />
    </button>

    {/* Carousel container with fixed size and hidden overflow */}
    <div
      ref={carouselRef}
      className="relative overflow-hidden"
      style={{
        width: `${visibleItemCount * (itemWidth + gap) - gap}px`
      }}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${startIndex * (itemWidth + gap)}px)`,
          gap: `${gap}px`,
        }}
      >
        {options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            style={{ width: `${itemWidth}px`, flexShrink: 0 }}
            className={`flex flex-col items-center justify-center px-5 py-2 rounded-lg border whitespace-nowrap
              transform transition-all duration-300
              ${selectedIndex === idx
                ? "bg-blue-500 text-white scale-95 shadow-md"
                : "bg-white text-gray-800 hover:bg-blue-50 hover:shadow"
              }`}
          >
            <span className="text-sm font-medium">{option.label}</span>
            <span className="text-sm">{option.kcal} kcal</span>
          </button>
        ))}
      </div>
    </div>

  {/* Right arrow */}
  <button
    onClick={handleNext}
    className={`flex items-center justify-center w-8 h-8 rounded-full bg-white shadow flex-shrink-0 
      transition-all duration-200 transform z-10
      ${startIndex + visibleItemCount < options.length ? 
        'opacity-100 hover:bg-blue-50 hover:scale-110 hover:shadow-md cursor-pointer' : 
        'opacity-50 cursor-not-allowed'}`}
    disabled={startIndex + visibleItemCount >= options.length}
  >
    <ChevronRight className="text-gray-600" />
  </button>
</div>

  );
};

const DietPlan = () => {
  const [meals, setMeals] = useState(sampleMeals);
  const [drinks, setDrinks] = useState([]); // Add state for drinks
  const [selectedCalorieIndex, setSelectedCalorieIndex] = useState(1);
  const [dietPlanId, setDietPlanId] = useState(null); // Add state for diet plan ID
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId') || 1; // Default to 1 for testing

  // Fetch or create diet plan on component mount
  useEffect(() => {
    const fetchOrCreateDietPlan = async () => {
      try {
        setIsLoading(true);
        
        // Try to get user's diet plans
        const response = await dietPlanApi.getDietPlansByUserId(userId);
        
        if (response.data && response.data.length > 0) {
          // Use the first diet plan if available
          const plan = response.data[0];
          setDietPlanId(plan.id);
          
          // Fetch meals for this diet plan
          const mealsResponse = await mealApi.getMealsByDietPlanId(plan.id);
          if (mealsResponse.data && mealsResponse.data.length > 0) {
            setMeals(mealsResponse.data);
          }
          
          // Update selected calorie program
          const programIndex = calorieOptions.findIndex(
            option => `${option.label} ${option.kcal}` === plan.calorieProgram
          );
          if (programIndex !== -1) {
            setSelectedCalorieIndex(programIndex);
          }
        } else {
          // Create a new diet plan if none exists
          const newPlan = {
            name: "My Diet Plan",
            calorieProgram: `${calorieOptions[selectedCalorieIndex].label} ${calorieOptions[selectedCalorieIndex].kcal}`,
            totalCalories: parseInt(calorieOptions[selectedCalorieIndex].kcal),
            userId: userId,
            meals: []
          };
          
          const createResponse = await dietPlanApi.createDietPlan(newPlan);
          setDietPlanId(createResponse.data.id);
        }
      } catch (error) {
        console.error("Error fetching or creating diet plan:", error);
        alert("Failed to initialize diet plan. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrCreateDietPlan();
  }, [userId]);

  const totalMacros = meals.reduce(
    (acc, meal) => {
      acc.calories += meal.calories;
      acc.protein += meal.protein;
      acc.carbs += meal.carbs;
      acc.fats += meal.fats;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const dailyMacros = {
    protein: 180,
    carbs: 250,
    fats: 70,
    kcal: 300
  };
  
   // Handle adding a new meal
   const handleAddMeal = async (newMeal) => {
    // Update the UI optimistically
    setMeals([...meals, newMeal]);
  };

  {/* Add Meal Button */}
  <AddMealButton onAddMeal={handleAddMeal} dietPlanId={dietPlanId} />

  // Handle adding a new drink
  const handleAddDrink = (newDrink) => {
    setDrinks([...drinks, newDrink]);
  };
  
  const handleTagClick = (tagIndex) => {
    // Toggle tag selection
    if (selectedTags.includes(tagIndex)) {
      setSelectedTags(selectedTags.filter(index => index !== tagIndex));
    } else {
      setSelectedTags([...selectedTags, tagIndex]);
    }
  };

  const dietPlanContent = (
    <div className="p-4 md:p-9 bg-white min-h-screen space-y-6">
      {/* Top section - meal plan options */}
      <div className="flex flex-col lg:flex-row gap-4">

        {/* Left Box */}
        <div className="w-full lg:w-7/10 bg-blue-100 rounded-xl p-4 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Create a weekly meal plan</h1>
            <p className="text-sm text-gray-600">Select a preferable programme</p>
          </div>
  
          {/* Program Carousel Component */}
          <ProgramCarousel 
            options={calorieOptions} 
            selectedIndex={selectedCalorieIndex}
            onSelect={setSelectedCalorieIndex}
          />
        </div>
  
        {/* Right Box */}
        <div className="w-full lg:w-3/10 bg-blue-50 rounded-xl p-4 space-y-2 ml-2">
          <h2 className="text-lg font-bold text-gray-700">Your made meals</h2>
          <p className="text-sm text-gray-600">You can explore more options by scrolling or clicking the arrows.</p>
        </div>
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
                ${selectedTags.includes(index) ? 
                  'bg-blue-500 text-white border-blue-500 shadow-md transform scale-105' : 
                  'bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:-translate-y-1 hover:shadow'}`}
            >
              <span>{tag.emoji}</span>
              <span>{tag.label}</span>
            </div>
          ))}
        </div>
  
        {/* Add Meal Button */}
        <AddMealButton onAddMeal={handleAddMeal} />

        {/* Daily Macro Summary Box 2*/}
        <div className="bg-white rounded-xl p-5 shadow-sm border text-sm w-full md:w-auto md:min-w-64 text-gray-700 flex-shrink-0 ml-2">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-gray-800 text-[15px]">
              {new Date().toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="text-xs text-gray-500">{dailyMacros.kcal} kcal</span>
          </div>
          <div className="flex justify-between text-center font-semibold text-gray-900">
            <div>
              <p className="text-lg">{dailyMacros.protein}</p>
              <p className="text-xs font-normal text-gray-500">Proteins</p>
            </div>
            <div>
              <p className="text-lg">{dailyMacros.fats}</p>
              <p className="text-xs font-normal text-gray-500">Fat</p>
            </div>
            <div>
              <p className="text-lg">{dailyMacros.carbs}</p>
              <p className="text-xs font-normal text-gray-500">Carbs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main heading */}
      <div>
        <h1 className="text-2xl font-bold mb-1 ml-3 mt-[-65px]">Your Diet Plan</h1>
        <p className="text-gray-600 mb-[-4px] text-[14px] ml-3">
          Based on your goal to build muscle and maintain {calorieOptions[selectedCalorieIndex].kcal} kcal/day
        </p>
      </div>

      {/* Meal cards - Updated to use the new MealCard component */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {meals.map((meal, idx) => (
          <MealCard key={idx} meal={meal} index={idx} />
        ))}

        {/* Add Drink component with proper handler */}
        <div className="mt-20">
          <AddDrink onAddDrink={handleAddDrink} />
        </div>
      </div>
      {/* Display selected drinks (optional) */}
      {drinks.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-3 ml-3">Your Selected Drinks</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {drinks.map((drink, idx) => (
                <div key={idx} className="bg-teal-50 rounded-lg p-4 shadow-sm border border-teal-100">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex-shrink-0 flex items-center justify-center mr-3">
                      <img 
                        src={`/images/foods/${drink.image}`} 
                        alt={drink.name} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/foods/default-drink.png";
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{drink.name}</h3>
                      <p className="text-sm text-gray-600">{drink.calories} calories</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );

  return <Dashboard>{dietPlanContent}</Dashboard>;
};

export default DietPlan;