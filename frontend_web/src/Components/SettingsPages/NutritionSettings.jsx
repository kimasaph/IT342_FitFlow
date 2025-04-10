import React, { useState, useEffect } from "react";
import Footer from "../Footer";

const NutritionSettings = () => {
  const [dietType, setDietType] = useState("");
  const [calorieGoal, setCalorieGoal] = useState("");
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");
  const [fats, setFats] = useState("");
  const [allergies, setAllergies] = useState("");
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (
      dietType ||
      calorieGoal ||
      carbs ||
      protein ||
      fats ||
      allergies
    ) {
      setIsModified(true);
    } else {
      setIsModified(false);
    }
  }, [dietType, calorieGoal, carbs, protein, fats, allergies]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      dietType,
      calorieGoal,
      macronutrients: {
        carbs,
        protein,
        fats,
      },
      allergies,
    });
    // Handle API save
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-8 w-full max-w-[680px] mx-auto flex-grow">
        <h1 className="text-xl font-bold mb-6 mt-4">Nutrition Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Diet Type */}
          <div>
            <label className="block text-[15px] font-bold mb-2">Diet Type</label>
            <select
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none"
            >
              <option value="">Select diet type</option>
              <option value="balanced">Balanced</option>
              <option value="keto">Keto</option>
              <option value="vegan">Vegan</option>
              <option value="highprotein">High-Protein</option>
              <option value="mediterranean">Mediterranean</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Calorie Goal */}
          <div>
            <label className="block text-[15px] font-bold mb-2">Daily Calorie Goal</label>
            <input
              type="number"
              value={calorieGoal}
              onChange={(e) => setCalorieGoal(e.target.value)}
              placeholder="e.g., 2200"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none"
              min="1000"
            />
          </div>

          {/* Macronutrients */}
          <div>
            <label className="block text-[15px] font-bold mb-3">Macronutrient Ratio (%)</label>
            <div className="grid grid-cols-3 gap-4">
              <input
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="Carbs"
                className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none"
              />
              <input
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="Protein"
                className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none"
              />
              <input
                type="number"
                value={fats}
                onChange={(e) => setFats(e.target.value)}
                placeholder="Fats"
                className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Allergies */}
          <div>
            <label className="block text-[15px] font-bold mb-2">Food Allergies</label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g., peanuts, dairy, gluten"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none"
            />
          </div>

          <div className="mt-6 text-[12px] text-gray-600">
            This helps us tailor your meal plans, food suggestions, and avoid ingredients you're allergic to.
          </div>

          <div className="pt-2 text-right">
            <button
              type="submit"
              disabled={!isModified}
              className={`transition px-16 py-3 rounded-xl text-sm font-semibold ${
                isModified
                  ? "bg-[#3797EF] text-white hover:bg-[#318ce7] cursor-pointer"
                  : "bg-[#3797EF]/30 text-white cursor-not-allowed"
              }`}
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default NutritionSettings;
