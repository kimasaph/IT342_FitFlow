// Contains the current streaks and milestones UI

import React from "react";
import { Calendar } from "lucide-react";
import { Trophy } from "lucide-react";

const StreaksTab = ({ streaks, milestones }) => {
  // Fetch total workouts for each style and sum for total
  const userID = localStorage.getItem("userID") || "guest";
  const strengthTotal = parseInt(localStorage.getItem(`strengthTotalWorkouts_${userID}`) || "0", 10);
  const cardioTotal = parseInt(localStorage.getItem(`cardioTotalWorkouts_${userID}`) || "0", 10);
  const flexiYogaTotal = parseInt(localStorage.getItem(`flexiYogaTotalWorkouts_${userID}`) || "0", 10);
  const totalWorkouts = strengthTotal + cardioTotal + flexiYogaTotal;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Current Streaks</h2>
          <div className="bg-white bg-opacity-20 px-4 py-1 rounded-full text-sm">
            {new Date().toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'})}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {streaks.map((streak, index) => (
            <div 
              key={index} 
              className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm transition-all hover:bg-opacity-20 hover:scale-105 hover:shadow-lg cursor-pointer group"
            >
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2 group-hover:scale-110 transition-transform">{streak.icon}</span>
                <h3 className="font-medium">{streak.name}</h3>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  {/* Replace static value "4" with totalWorkouts for the "Workout" streak */}
                  <p className="text-3xl font-bold group-hover:text-yellow-300 transition-colors">
                    {streak.name.toLowerCase().includes("workout") ? totalWorkouts : streak.current}
                  </p>
                  <p className="text-xs opacity-80">Current streak</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">{streak.best}</p>
                  <p className="text-xs opacity-80">Best</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Calendar size={18} className="mr-2 text-blue-500" />
          Upcoming Milestones
        </h2>
        
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="relative">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-800">{milestone.description}</h3>
                <span className="text-sm text-blue-600 font-semibold">{milestone.progress}%</span>
              </div>
              
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-teal-500" 
                  style={{ width: `${milestone.progress}%` }}
                ></div>
              </div>
              
              <div className="mt-1 text-xs text-gray-500 flex items-center">
                <Trophy size={12} className="mr-1 text-amber-500" />
                Reward: {milestone.reward}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StreaksTab;