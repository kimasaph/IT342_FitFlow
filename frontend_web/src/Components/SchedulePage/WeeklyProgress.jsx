// Weekly Progress Component
import React from "react";
import { Dumbbell, Coffee } from "lucide-react";

const WeeklyProgress = ({ events }) => {
  // Get the current date and start of the week
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  // Calculate completed workouts and meals for the week
  const workouts = events.filter(event => event.type !== "meal");
  const completedWorkouts = workouts.filter(event => event.completed).length;
  const totalWorkouts = workouts.length;
  
  const meals = events.filter(event => event.type === "meal");
  const completedMeals = meals.filter(event => event.completed).length;
  const totalMeals = meals.length;
  
  // Calculate percentages
  const workoutPercentage = totalWorkouts > 0 
    ? Math.round((completedWorkouts / totalWorkouts) * 100) 
    : 0;
  
  const mealPercentage = totalMeals > 0 
    ? Math.round((completedMeals / totalMeals) * 100) 
    : 0;
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-bold mb-4">Weekly Progress</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="font-medium flex items-center gap-1">
              <Dumbbell size={16} className="text-purple-600" /> Workouts
            </p>
            <p className="text-sm font-medium">{completedWorkouts}/{totalWorkouts}</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-purple-600 h-2.5 rounded-full" 
              style={{ width: `${workoutPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="font-medium flex items-center gap-1">
              <Coffee size={16} className="text-green-600" /> Meals
            </p>
            <p className="text-sm font-medium">{completedMeals}/{totalMeals}</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${mealPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Week of {startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeeklyProgress;