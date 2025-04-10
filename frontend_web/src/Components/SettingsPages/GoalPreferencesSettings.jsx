import React, { useState, useEffect } from "react";
import Footer from "../Footer";

const GoalPreferencesSettings = () => {
  const [goal, setGoal] = useState("");
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (goal) {
      setIsModified(true);
    } else {
      setIsModified(false);
    }
  }, [goal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ goal });
    // Handle saving goal
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-8 w-full max-w-[680px] mx-auto flex-grow">
        <h1 className="text-xl font-bold mb-6 mt-4">Goal Preferences</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[15px] font-bold mb-2">Choose Your Fitness Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white"
            >
              <option value="">Select goal</option>
              <option value="bulking">Bulking</option>
              <option value="cutting">Cutting</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="mt-6 text-[12px] text-gray-600">
            This helps us tailor your workouts and nutrition advice to meet your fitness goals. You can always change this later.
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

export default GoalPreferencesSettings;
