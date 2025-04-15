import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../DashboardSimple";

import AddDrink from "./AddDrink";
import AddMealButton from "./AddMealButton";
import UserMadeMeals from "./UserMadeMeals";
import WeeklyMealPlan from "./WeeklyMealPlan";

const sampleMeals = [
  {
    time: "Breakfast",
    name: "Oatmeal with Fresh Berries and Almonds",
    calories: 587,
    protein: 12,
    carbs: 45,
    fats: 10,
    notes: "Add peanut butter if needed.",
    image: 'oatmeal.png',
  },
  {
    time: "2nd breakfast",
    name: "Grilled Crab with Cabbage and Tomatoes",
    calories: 587,
    protein: 40,
    carbs: 50,
    fats: 20,
    notes: "Include mixed veggies.",
    image: 'salmon.png',
  },
  {
    time: "Lunch",
    name: "Salmon with Lemon and Spinach",
    calories: 587,
    protein: 35,
    carbs: 40,
    fats: 18,
    notes: "Add lemon for taste.",
    image: 'salmon2.png',
  },
  {
    time: "Dinner",
    name: "Pasta with Tomatoes and Cheese",
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
  
  const handleAddUserMadeMeal = (newMeal) => {
    setUserMadeMeals(prevMeals => {
      if (newMeal.id && prevMeals.some(meal => meal.id === newMeal.id)) {
        return prevMeals;
      }
      return [...prevMeals, newMeal];
    });
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

const DietPlan = () => {
  const [meals, setMeals] = useState(sampleMeals);
  const [drinks, setDrinks] = useState([]); // Add state for drinks
  const [selectedCalorieIndex, setSelectedCalorieIndex] = useState(1);
  const [selectedTags, setSelectedTags] = useState([]);
  const [userMadeMeals, setUserMadeMeals] = useState([]); // Add this line
  const navigate = useNavigate();

  // Calculate total macros from all meals
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

  // Daily target macros
  const dailyMacros = {
    protein: 180,
    carbs: 250,
    fats: 70,
    kcal: 300
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
  
  // Handle adding a new meal
  const handleAddMeal = (newMeal) => {
    setMeals([...meals, newMeal]);
  };

  const handleDeleteUserMeal = (deletedMeal) => {
    setUserMadeMeals(prevMeals => prevMeals.filter(meal => meal.id !== deletedMeal.id));
  };

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
            // Optional: Add the selected meal to your meals array
            // setMeals([...meals, selectedMeal]);
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
        <AddMealButton onAddMeal={handleAddUserMadeMeal} />
        
        {/* Daily Macro Summary Box */}
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
        <h1 className="text-2xl font-bold ml-3 mt-[-77px]">Your Daily Intakes</h1>
        <p className="text-gray-600 mb-4 text-[14px] ml-3">
          Based on your goal to build muscle and maintain {calorieOptions[selectedCalorieIndex].kcal} kcal/day
        </p>
      </div>

      {/* Meal cards */}
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