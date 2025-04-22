// Contains the achievements list with filtering functionality

import React, { useState, useEffect } from "react";
import AchievementCard from "./AchievementCard";
import AchievementModal from "./AchievementModal";

const AchievementsTab = ({ achievements, categories }) => {
  const [selectedAchievement, setSelectedAchievement] = useState(null);
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

  const openAchievementModal = (achievement) => {
    setSelectedAchievement(achievement);
  };

  const closeAchievementModal = () => {
    setSelectedAchievement(null);
  };

  return (
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
          <AchievementCard 
            key={achievement.id}
            achievement={achievement}
            categoryName={categories.find(c => c.id === achievement.category)?.name}
            onClick={() => openAchievementModal(achievement)}
          />
        ))}
      </div>

      {/* Achievement Modal */}
      {selectedAchievement && (
        <AchievementModal 
          achievement={selectedAchievement}
          categoryName={categories.find(c => c.id === selectedAchievement.category)?.name}
          onClose={closeAchievementModal}
        />
      )}
    </div>
  );
};

export default AchievementsTab;
