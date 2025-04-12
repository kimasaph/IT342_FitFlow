import React, { useState, useEffect } from "react";
import Footer from "../Footer";
import { Toaster, toast } from "react-hot-toast";

const GoalPreferencesSettings = () => {
  const [goal, setGoal] = useState("");
  const [isModified, setIsModified] = useState(false);
  const [initialGoal, setInitialGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load goal on mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));

    if (userData && userData.bodyGoal) {
      setGoal(userData.bodyGoal);
      setInitialGoal(userData.bodyGoal);
    }
  }, []);

  // Track if user changed the goal
  useEffect(() => {
    setIsModified(goal !== initialGoal);
  }, [goal, initialGoal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) {
        throw new Error("No user or token found");
      }

      const userData = JSON.parse(storedUser);

      // Update request payload
      const updatedData = {
        ...userData,
        bodyGoal: goal,
      };

      const res = await fetch(`http://localhost:8080/api/auth/update-profile?userId=${userData.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to update goal.");
      }

      const updatedUser = await res.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setInitialGoal(updatedUser.bodyGoal);
      setIsModified(false);
      toast.success("Fitness goal updated!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Update failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toaster position="top-right" toastOptions={{ style: { background: "#ffffff", color: "#333333" } }} />

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
              <option value="lose-weight">Lose Weight</option>
              <option value="build-muscle">Build Muscle</option>
              <option value="maintain-weight">Maintain Weight</option>
              <option value="increase-endurance">Increase Endurance</option>
              <option value="improve-flexibility">Improve Flexibility</option>
              <option value="overall-fitness">Overall Fitness</option>
            </select>
          </div>

          <div className="mt-6 text-[12px] text-gray-600">
            This helps us tailor your workouts and nutrition advice to meet your fitness goals. You can always change this later.
          </div>

          <div className="pt-2 text-right">
            <button
              type="submit"
              disabled={!isModified || isLoading}
              className={`transition px-16 py-3 rounded-xl text-sm font-semibold ${
                isModified && !isLoading
                  ? "bg-[#3797EF] text-white hover:bg-[#318ce7] cursor-pointer"
                  : "bg-[#3797EF]/30 text-white cursor-not-allowed"
              }`}
            >
              {isLoading ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default GoalPreferencesSettings;
