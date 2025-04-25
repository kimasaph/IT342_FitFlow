// Create a new context for meal data
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
export const MealContext = createContext();

// Create a provider component
export const MealProvider = ({ children }) => {
  const [meals, setMeals] = useState([]);
  
  // Load meals from localStorage on initial load
  useEffect(() => {
    // Get today's date as a string
    const getTodayString = () => {
      const today = new Date();
      return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    };
    
    // Try to get today's meal plan from localStorage
    const todayKey = getTodayString();
    const savedMealPlan = localStorage.getItem(`mealPlan_${todayKey}`);
    
    if (savedMealPlan) {
      // Convert the meal plan data to the format expected by the Schedule component
      const mealData = JSON.parse(savedMealPlan).map(meal => {
        // Create start and end times based on the meal time
        const start = new Date();
        const end = new Date();
        
        // Set times based on meal type
        switch(meal.time.toLowerCase()) {
          case 'breakfast':
            start.setHours(7, 0, 0);
            end.setHours(7, 30, 0);
            break;
          case '2nd breakfast':
            start.setHours(10, 0, 0);
            end.setHours(10, 30, 0);
            break;
          case 'snack':
            start.setHours(15, 0, 0);
            end.setHours(15, 30, 0);
            break;
          case 'lunch':
            start.setHours(12, 0, 0);
            end.setHours(12, 30, 0);
            break;
          case 'dinner':
            start.setHours(19, 0, 0);
            end.setHours(19, 30, 0);
            break;
          default:
            start.setHours(12, 0, 0);
            end.setHours(12, 30, 0);
        }
        
        // Convert to the format expected by the Schedule component
        return {
          id: meal.id || Math.floor(Math.random() * 10000),
          title: meal.name,
          start: start,
          end: end,
          type: "meal",
          mealType: meal.time.toLowerCase(),
          details: {
            name: meal.name,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fats: meal.fats,
            notes: meal.notes || "",
            ingredients: meal.ingredients || ""
          },
          completed: false
        };
      });
      
      setMeals(mealData);
    }
  }, []);
  
  return (
    <MealContext.Provider value={{ meals, setMeals }}>
      {children}
    </MealContext.Provider>
  );
};

// Create a custom hook to use the meal context
export const useMeals = () => useContext(MealContext);