// Represents a single achievement card

import React from "react";
import { CheckCircle, Lock } from "lucide-react";

const AchievementCard = ({ achievement, categoryName, onClick }) => {
  return (
    <div 
      className={`rounded-xl p-5 border transition-all relative overflow-hidden cursor-pointer group
        ${achievement.unlocked 
          ? "border-green-200 bg-green-50 shadow-sm hover:bg-green-100" 
          : "border-gray-200 bg-gray-50 hover:bg-gray-100"
        }
        hover:shadow-md hover:-translate-y-1
      `}
      onClick={onClick}
    >
      {/* Decorative background elements */}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gray-200 opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
      
      {achievement.unlocked && (
        <div className="absolute top-0 right-0 m-2">
          <div className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium flex items-center group-hover:bg-green-600 group-hover:text-white transition-colors">
            <CheckCircle size={12} className="mr-1" />
            Unlocked
          </div>
        </div>
      )}
      
      {!achievement.unlocked && (
        <div className="absolute top-0 right-0 m-2">
          <div className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-medium flex items-center group-hover:bg-gray-600 group-hover:text-white transition-colors">
            <Lock size={12} className="mr-1" />
            Locked
          </div>
        </div>
      )}
      
      <div className="flex items-center mb-3">
        <span className="text-3xl mr-3 group-hover:scale-125 transition-transform">{achievement.icon}</span>
        <div>
          <h3 className="font-bold text-gray-900">{achievement.name}</h3>
          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full mt-1 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
            {categoryName}
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 mb-3 text-sm">{achievement.description}</p>
      
      {achievement.unlocked ? (
        <div className="mt-2 text-sm text-green-600 font-medium">
          ✅ Completed on {achievement.unlockedDate}
        </div>
      ) : (
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{achievement.progress}/{achievement.total}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full group-hover:bg-blue-600 transition-colors"
              style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
};

export default AchievementCard;