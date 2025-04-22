// Shows achievement and streak statistics at the top of the page

import React from "react";
import { Trophy, Flame, Calendar } from "lucide-react";

const StatsSummary = ({ achievements, streaks }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-5 text-white shadow-md relative overflow-hidden group hover:shadow-lg hover:scale-105 transition-all cursor-pointer duration-300">
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
        <h3 className="font-bold mb-1 text-lg flex items-center relative z-10">
          <Trophy size={20} className="mr-2 group-hover:rotate-12 transition-transform" /> 
          Achievements
        </h3>
        <div className="text-3xl font-bold mb-1 group-hover:text-yellow-300 transition-colors">
          {achievements.filter(a => a.unlocked).length}/{achievements.length}
        </div>
        <p className="text-purple-100 text-sm">Unlocked</p>
      </div>
      
      <div className="bg-gradient-to-r from-teal-500 to-green-500 rounded-xl p-5 text-white shadow-md relative overflow-hidden group hover:shadow-lg hover:scale-105 transition-all cursor-pointer duration-300">
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
        <h3 className="font-bold mb-1 text-lg flex items-center relative z-10">
          <Flame size={20} className="mr-2 group-hover:scale-125 transition-transform" />
          Longest Streak
        </h3>
        <div className="text-3xl font-bold mb-1 group-hover:text-yellow-300 transition-colors">
          {Math.max(...streaks.map(s => s.best))} days
        </div>
        <p className="text-teal-100 text-sm">{streaks.find(s => s.best === Math.max(...streaks.map(s => s.best)))?.name}</p>
      </div>
      
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-5 text-white shadow-md relative overflow-hidden group hover:shadow-lg hover:scale-105 transition-all cursor-pointer duration-300">
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
        <h3 className="font-bold mb-1 text-lg flex items-center relative z-10">
          <Calendar size={20} className="mr-2 group-hover:rotate-12 transition-transform" />
          Current Challenge
        </h3>
        <div className="text-xl font-bold mb-1">
          30-Day Consistency
        </div>
        <div className="flex items-center mt-2">
          <div className="flex-1">
            <div className="h-2 bg-white bg-opacity-30 rounded-full">
              <div 
                className="h-full bg-white rounded-full group-hover:bg-yellow-300 transition-colors"
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>
          <span className="ml-2 text-sm">18/30</span>
        </div>
      </div>
    </div>
  );
};

export default StatsSummary;