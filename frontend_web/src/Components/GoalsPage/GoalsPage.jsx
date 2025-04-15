import React, { useState } from "react";
import Dashboard from "../DashboardSimple";
import { Calendar, Trophy, ArrowRight, Flame, CheckCircle, Lock } from "lucide-react";

const GoalsPage = () => {
  const [activeTab, setActiveTab] = useState("achievements");
  
  // Mock data for current streaks
  const streaks = [
    { name: "Workout", current: 4, best: 14, icon: "🏋️" },
    { name: "Diet Plan", current: 7, best: 21, icon: "🥗" },
    { name: "Water Intake", current: 9, best: 12, icon: "💧" },
    { name: "Sleep Goal", current: 3, best: 8, icon: "😴" }
  ];

  // Mock data for achievements
  const achievements = [
    { 
      id: 1, 
      name: "Early Bird", 
      description: "Complete 5 workouts before 8 AM", 
      progress: 3, 
      total: 5, 
      icon: "🌅", 
      unlocked: false,
      category: "workout" 
    },
    { 
      id: 2, 
      name: "Protein King", 
      description: "Meet your protein goal for 7 consecutive days", 
      progress: 7, 
      total: 7, 
      icon: "👑", 
      unlocked: true,
      category: "nutrition",
      unlockedDate: "Apr 12, 2025"
    },
    { 
      id: 3, 
      name: "Hydration Hero", 
      description: "Drink 3L of water daily for 5 days", 
      progress: 5, 
      total: 5, 
      icon: "🌊", 
      unlocked: true,
      category: "health",
      unlockedDate: "Apr 10, 2025"
    },
    { 
      id: 4, 
      name: "Consistency Champion", 
      description: "Log in to FitFlow for 30 days in a row", 
      progress: 18, 
      total: 30, 
      icon: "🔥", 
      unlocked: false,
      category: "general"
    },
    { 
      id: 5, 
      name: "Weight Warrior", 
      description: "Record weight 10 days in a row", 
      progress: 6, 
      total: 10, 
      icon: "⚖️", 
      unlocked: false,
      category: "tracking"
    },
    { 
      id: 6, 
      name: "Meal Master", 
      description: "Create 5 custom meals", 
      progress: 2, 
      total: 5, 
      icon: "🍽️", 
      unlocked: false,
      category: "nutrition"
    },
    { 
      id: 7, 
      name: "Cardio Crusher", 
      description: "Complete 10 cardio sessions", 
      progress: 10, 
      total: 10, 
      icon: "🏃", 
      unlocked: true,
      category: "workout",
      unlockedDate: "Apr 5, 2025"
    },
    { 
      id: 8, 
      name: "Sleep Expert", 
      description: "Get 8 hours of sleep for 7 days", 
      progress: 4, 
      total: 7, 
      icon: "💤", 
      unlocked: false,
      category: "health"
    }
  ];

  // Filter categories
  const categories = [
    { id: "all", name: "All" },
    { id: "workout", name: "Workout" },
    { id: "nutrition", name: "Nutrition" },
    { id: "health", name: "Health" },
    { id: "tracking", name: "Tracking" },
    { id: "general", name: "General" }
  ];
  
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filterType, setFilterType] = useState("all"); // "all", "unlocked", "locked"

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = selectedCategory === "all" || achievement.category === selectedCategory;
    const statusMatch = 
      filterType === "all" || 
      (filterType === "unlocked" && achievement.unlocked) || 
      (filterType === "locked" && !achievement.unlocked);
    
    return categoryMatch && statusMatch;
  });

  // Upcoming milestones
  const milestones = [
    { id: 1, description: "Reach 10,000 steps daily for a full week", reward: "Silver Walker Badge", progress: 70 },
    { id: 2, description: "Complete your first month with a calorie deficit", reward: "Weight Loss Champion Badge", progress: 90 },
    { id: 3, description: "Log 20 strength training workouts", reward: "Strength Master Badge", progress: 45 }
  ];
  
  return (
    <Dashboard>
      <div className="p-4 md:p-9 bg-white min-h-screen space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Goals & Achievements</h1>
            <p className="text-gray-600 text-sm">Track your progress and unlock rewards</p>
          </div>
          
          {/* Tabs */}
          <div className="bg-gray-100 rounded-lg p-1 flex space-x-1">
            <button 
              onClick={() => setActiveTab("achievements")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "achievements" 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-gray-600 hover:text-gray-800"
              }`}>
              <span className="flex items-center gap-2">
                <Trophy size={16} />
                Achievements
              </span>
            </button>
            <button 
              onClick={() => setActiveTab("streaks")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "streaks" 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-gray-600 hover:text-gray-800"
              }`}>
              <span className="flex items-center gap-2">
                <Flame size={16} />
                Streaks
              </span>
            </button>
          </div>
        </div>

        {/* Current Streak Status */}
        {activeTab === "streaks" && (
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
                  <div key={index} className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm transition-all hover:bg-opacity-20">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">{streak.icon}</span>
                      <h3 className="font-medium">{streak.name}</h3>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-3xl font-bold">{streak.current}</p>
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
        )}

         {/* Stats Summary */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-5 text-white shadow-md">
                <h3 className="font-bold mb-1 text-lg flex items-center">
                  <Trophy size={20} className="mr-2" /> 
                  Achievements
                </h3>
                <div className="text-3xl font-bold mb-1">
                  {achievements.filter(a => a.unlocked).length}/{achievements.length}
                </div>
                <p className="text-purple-100 text-sm">Unlocked</p>
              </div>
              
              <div className="bg-gradient-to-r from-teal-500 to-green-500 rounded-xl p-5 text-white shadow-md">
                <h3 className="font-bold mb-1 text-lg flex items-center">
                  <Flame size={20} className="mr-2" />
                  Longest Streak
                </h3>
                <div className="text-3xl font-bold mb-1">
                  {Math.max(...streaks.map(s => s.best))} days
                </div>
                <p className="text-teal-100 text-sm">{streaks.find(s => s.best === Math.max(...streaks.map(s => s.best)))?.name}</p>
              </div>
              
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-5 text-white shadow-md">
                <h3 className="font-bold mb-1 text-lg flex items-center">
                  <Calendar size={20} className="mr-2" />
                  Current Challenge
                </h3>
                <div className="text-xl font-bold mb-1">
                  30-Day Consistency
                </div>
                <div className="flex items-center mt-2">
                  <div className="flex-1">
                    <div className="h-2 bg-white bg-opacity-30 rounded-full">
                      <div 
                        className="h-full bg-white rounded-full"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                  </div>
                  <span className="ml-2 text-sm">18/30</span>
                </div>
              </div>
            </div>

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div className="space-y-6">
            {/* Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                      selectedCategory === category.id
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              
              <div className="flex rounded-md overflow-hidden border border-gray-200">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-3 py-1.5 text-sm transition-all ${
                    filterType === "all"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType("unlocked")}
                  className={`px-3 py-1.5 text-sm transition-all ${
                    filterType === "unlocked"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Unlocked
                </button>
                <button
                  onClick={() => setFilterType("locked")}
                  className={`px-3 py-1.5 text-sm transition-all ${
                    filterType === "locked"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Locked
                </button>
              </div>
            </div>
            
            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAchievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`rounded-xl p-5 border transition-all relative overflow-hidden
                    ${achievement.unlocked 
                      ? "border-green-200 bg-green-50 shadow-sm" 
                      : "border-gray-200 bg-gray-50"
                    }
                    hover:shadow-md hover:-translate-y-1
                  `}
                >
                  {achievement.unlocked && (
                    <div className="absolute top-0 right-0 m-2">
                      <div className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium flex items-center">
                        <CheckCircle size={12} className="mr-1" />
                        Unlocked
                      </div>
                    </div>
                  )}
                  
                  {!achievement.unlocked && (
                    <div className="absolute top-0 right-0 m-2">
                      <div className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-medium flex items-center">
                        <Lock size={12} className="mr-1" />
                        Locked
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center mb-3">
                    <span className="text-3xl mr-3">{achievement.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-900">{achievement.name}</h3>
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full mt-1">
                        {categories.find(c => c.id === achievement.category)?.name}
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
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Dashboard>
  );
};

export default GoalsPage;