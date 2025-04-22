// Handles the detailed view of an achievement

import React from "react";
import { X, CheckCircle, Info, Award, Clock } from "lucide-react";

const AchievementModal = ({ achievement, categoryName, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden relative animate-fadeIn">
        {/* Modal Header */}
        <div className={`px-6 py-4 relative flex items-center justify-between ${
          achievement.unlocked ? "bg-green-500" : "bg-blue-500"
        } text-white`}>
          <div className="flex items-center">
            <span className="text-3xl mr-3">{achievement.icon}</span>
            <h3 className="font-bold text-xl">{achievement.name}</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">{achievement.description}</p>
          
          <div className="flex items-center mb-4">
            <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
              {categoryName}
            </span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-sm flex items-center text-amber-600">
              <Award size={14} className="mr-1" />
              {achievement.rewardPoints} points
            </span>
          </div>
          
          {achievement.unlocked ? (
            <div className="flex items-center text-green-600 mb-4">
              <CheckCircle size={18} className="mr-2" />
              <span>Completed on {achievement.unlockedDate}</span>
            </div>
          ) : (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{achievement.progress}/{achievement.total}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-700 flex items-center mb-2">
              <Info size={16} className="mr-2" />
              Tips to Achieve
            </h4>
            <p className="text-blue-800 text-sm">{achievement.tips}</p>
          </div>
          
          {!achievement.unlocked && (
            <div className="mt-4 text-sm text-gray-500 flex items-center">
              <Clock size={14} className="mr-1" />
              Keep going! You're {((achievement.progress / achievement.total) * 100).toFixed(0)}% of the way there.
            </div>
          )}
        </div>
        
        {/* Modal Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementModal;