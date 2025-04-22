import React, { useState, useEffect } from "react";
import Dashboard from "../DashboardSimple";
import { Trophy, Flame } from "lucide-react";

import AchievementsTab from "./AchievementsTab";
import StreaksTab from "./StreaksTab";
import StatsSummary from "./StatsSummary";
import axios from "axios";

const GoalsPage = () => {
  const [activeTab, setActiveTab] = useState("achievements");
  const [userId, setUserId] = useState(null);
  
  // Initial mock data
  const [streaks, setStreaks] = useState([
    { name: "Workout", current: 4, best: 14, icon: "🏋️" },
    { name: "Diet Plan", current: 7, best: 21, icon: "🥗" },
    { name: "Water Intake", current: 9, best: 12, icon: "💧" },
    { name: "Sleep Goal", current: 3, best: 8, icon: "😴" }
  ]);

  // Initial achievement data - will be updated from API
  const [achievements, setAchievements] = useState([
    { 
      id: 1, 
      name: "Early Bird", 
      description: "Complete 5 workouts before 8 AM", 
      progress: 3, 
      total: 5, 
      icon: "🌅", 
      unlocked: false,
      category: "workout",
      tips: "Try setting your alarm 30 minutes earlier and prepare your workout clothes the night before.",
      rewardPoints: 50
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
      unlockedDate: "Apr 12, 2025",
      tips: "High protein foods include chicken breast, Greek yogurt, eggs, and lentils.",
      rewardPoints: 75
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
      unlockedDate: "Apr 10, 2025",
      tips: "Keep a water bottle at your desk, set reminders, and drink a glass of water before each meal.",
      rewardPoints: 60
    },
    { 
      id: 4, 
      name: "Consistency Champion", 
      description: "Log in to FitFlow for 30 days in a row", 
      progress: 18, 
      total: 30, 
      icon: "🔥", 
      unlocked: false,
      category: "general",
      tips: "Set a daily reminder on your phone to check in, even if briefly.",
      rewardPoints: 100
    },
    { 
      id: 5, 
      name: "Weight Warrior", 
      description: "Record weight 10 days in a row", 
      progress: 6, 
      total: 10, 
      icon: "⚖️", 
      unlocked: false,
      category: "tracking",
      tips: "Weigh yourself at the same time each day, preferably in the morning after using the bathroom.",
      rewardPoints: 50
    },
    { 
      id: 6, 
      name: "Meal Master", 
      description: "Create 5 custom meals", 
      progress: 0,
      total: 5, 
      icon: "🍽️", 
      unlocked: false,
      category: "nutrition",
      tips: "Start with your favorite dishes and make healthier versions with better macros.",
      rewardPoints: 60
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
      unlockedDate: "Apr 5, 2025",
      tips: "Mix up your cardio routine with running, cycling, swimming, or HIIT workouts.",
      rewardPoints: 80
    },
    { 
      id: 8, 
      name: "Sleep Expert", 
      description: "Get 8 hours of sleep for 7 days", 
      progress: 4, 
      total: 7, 
      icon: "💤", 
      unlocked: false,
      category: "health",
      tips: "Establish a bedtime routine, avoid screens before bed, and keep your bedroom cool and dark.",
      rewardPoints: 70
    }
  ]);

  // Filter categories
  const categories = [
    { id: "all", name: "All" },
    { id: "workout", name: "Workout" },
    { id: "nutrition", name: "Nutrition" },
    { id: "health", name: "Health" },
    { id: "tracking", name: "Tracking" },
    { id: "general", name: "General" }
  ];

  // Upcoming milestones
  const milestones = [
    { id: 1, description: "Reach 10,000 steps daily for a full week", reward: "Silver Walker Badge", progress: 70 },
    { id: 2, description: "Complete your first month with a calorie deficit", reward: "Weight Loss Champion Badge", progress: 90 },
    { id: 3, description: "Log 20 strength training workouts", reward: "Strength Master Badge", progress: 45 }
  ];

  // Load user ID from localStorage when component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id || parsedUser.userId); // Handle both id and userId formats
    }
  }, []);

  // Load actual achievement data from API
  useEffect(() => {
    if (userId) {
      fetchAchievements();
    }
  }, [userId]);

  useEffect(() => {
    const handleAchievementUpdate = (event) => {
      const updatedData = event.detail;
      console.log("GoalsPage received achievement update:", updatedData);
      
      if (updatedData && updatedData.progress) {
        // Update achievements with the new progress
        setAchievements(prev => {
          // Create a complete copy of the previous state
          const updated = JSON.parse(JSON.stringify(prev));
          
          // Update Meal Master achievement if present in the event data
          if ('meals_created_5' in updatedData.progress) {
            const mealMasterIndex = updated.findIndex(a => a.name === "Meal Master");
            if (mealMasterIndex >= 0) {
              const mealCount = updatedData.progress.meals_created_5;
              console.log(`Updating Meal Master achievement progress to ${mealCount}`);
              
              // Important: Create a new object to trigger React's state update
              updated[mealMasterIndex] = {
                ...updated[mealMasterIndex],
                progress: mealCount,
                unlocked: mealCount >= updated[mealMasterIndex].total,
                unlockedDate: mealCount >= updated[mealMasterIndex].total ? 
                  new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }) : undefined
              };
            }
          }
          
          return updated;
        });
      }
    };
  
    window.addEventListener('achievements-updated', handleAchievementUpdate);
    
    return () => {
      window.removeEventListener('achievements-updated', handleAchievementUpdate);
    };
  }, []); // Empty dependency array to only set up the listener once

  const fetchAchievements = async () => {
    if (!userId) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No authentication token found");
        return;
      }
      
      const response = await axios.get(
        `http://localhost:8080/api/achievements/my-progress?userId=${userId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      // Process the API response to update achievement data
      if (response.data && response.data.progress) {
        console.log("API returned achievement data:", response.data);
        
        // Update all achievements based on API data
        setAchievements(prev => {
          const updated = [...prev];
          
          // Update Meal Master achievement specifically
          if ('meals_created_5' in response.data.progress) {
            const mealMasterIndex = updated.findIndex(a => a.name === "Meal Master");
            if (mealMasterIndex >= 0) {
              const mealCount = response.data.progress.meals_created_5;
              console.log(`Setting initial Meal Master progress to ${mealCount}`);
              
              updated[mealMasterIndex] = {
                ...updated[mealMasterIndex],
                progress: mealCount || 0, // Default to 0 if null/undefined
                unlocked: mealCount >= updated[mealMasterIndex].total,
                unlockedDate: mealCount >= updated[mealMasterIndex].total ? 
                  new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }) : undefined
              };
            }
          }
          
          return updated;
        });
      }
    } catch (error) {
      console.error("Error fetching achievement data:", error);
    }
  };
  
  return (
    <Dashboard>
      <div className="p-4 md:p-9 bg-white min-h-screen space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Goals & Achievements</h1>
            <p className="text-gray-600 text-sm">Track your progress and unlock rewards</p>
          </div>

          {/* Group Points Badge + Tabs Together */}
          <div className="flex items-center space-x-4">
            {/* Total Points Badge */}
            <div className="bg-yellow-100 px-3 py-1 rounded-full flex items-center">
              <Trophy size={16} className="text-yellow-600 mr-1" />
              <span className="font-semibold text-yellow-800">
                {achievements.reduce((total, achievement) => 
                  achievement.unlocked ? total + achievement.rewardPoints : total, 0
                )} points
              </span>
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
        </div>

        {/* Stats Summary */}
        <StatsSummary achievements={achievements} streaks={streaks} />

        {/* Tab Content */}
        {activeTab === "streaks" ? (
          <StreaksTab streaks={streaks} milestones={milestones} />
        ) : (
          <AchievementsTab 
            achievements={achievements} 
            categories={categories} 
          />
        )}
      </div>
    </Dashboard>
  );
};

export default GoalsPage;