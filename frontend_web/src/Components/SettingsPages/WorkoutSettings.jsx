import React, { useState, useEffect } from "react";
import Footer from "../Footer";

const WorkoutSettings = () => {
  const [difficulty, setDifficulty] = useState("");
  const [intensity, setIntensity] = useState("");
  const [duration, setDuration] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState("");
  const [equipment, setEquipment] = useState([]);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (
      difficulty ||
      intensity ||
      duration ||
      daysPerWeek ||
      equipment.length > 0
    ) {
      setIsModified(true);
    } else {
      setIsModified(false);
    }
  }, [difficulty, intensity, duration, daysPerWeek, equipment]);

  const handleEquipmentChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setEquipment([...equipment, value]);
    } else {
      setEquipment(equipment.filter((item) => item !== value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      difficulty,
      intensity,
      duration,
      daysPerWeek,
      equipment,
    });
    // Save settings
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-8 w-full max-w-[680px] mx-auto flex-grow">
        <h1 className="text-xl font-bold mb-6 mt-4">Workout Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Difficulty Level */}
          <div>
            <label className="block text-[15px] font-bold mb-2">Workout Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none"
            >
              <option value="">Select level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Training Intensity */}
          <div>
            <label className="block text-[15px] font-bold mb-2">Training Intensity</label>
            <select
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none"
            >
              <option value="">Select intensity</option>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Preferred Duration */}
          <div>
            <label className="block text-[15px] font-bold mb-2">Preferred Workout Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 30"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none"
              min="10"
              max="120"
            />
          </div>

          {/* Days per Week */}
          <div>
            <label className="block text-[15px] font-bold mb-2">Days per Week</label>
            <input
              type="number"
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(e.target.value)}
              placeholder="e.g., 4"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none"
              min="1"
              max="7"
            />
          </div>

          {/* Equipment Access */}
          <div>
            <label className="block text-[15px] font-bold mb-3">Available Equipment</label>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {["Dumbbells", "Bodyweight", "Gym", "Resistance Bands", "Kettlebell"].map((item) => (
                <label key={item} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={item}
                    checked={equipment.includes(item)}
                    onChange={handleEquipmentChange}
                    className="accent-[#3797EF] focus:outline-none focus:ring-2 focus:ring-[#3797EF]/0"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6 text-[12px] text-gray-600">
            We’ll use this data to tailor your workouts to your preferences, equipment, and availability.
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

export default WorkoutSettings;
