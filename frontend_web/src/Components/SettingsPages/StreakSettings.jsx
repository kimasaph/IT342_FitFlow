import React, { useState } from "react";
import Footer from "../Footer";

const StreakSettings = () => {
  const [streakTracking, setStreakTracking] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);
  const [pauseStreaks, setPauseStreaks] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-8 w-full max-w-[680px] mx-auto flex-grow">
        <h1 className="text-xl font-bold mb-6 mt-4">Streak Tracking</h1>

        <div className="bg-white border border-gray-120 rounded-2xl shadow-sm px-4 py-5 space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-base font-medium">Enable streak tracking</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={streakTracking}
                onChange={() => setStreakTracking(!streakTracking)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-black"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
            </label>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-base font-medium">Streak reminders</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={streakReminders}
                onChange={() => setStreakReminders(!streakReminders)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-black"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
            </label>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-base font-medium">Pause streak tracking</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pauseStreaks}
                onChange={() => setPauseStreaks(!pauseStreaks)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-black"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
            </label>
          </div>
        </div>

        <div className="mt-4 text-[13px] text-gray-600 space-y-2">
          <p>
            Streaks help you build momentum by tracking how many consecutive days you've completed a task or activity.
          </p>
          <p>
            Enabling reminders helps you stay consistent. Pausing streak tracking will freeze your current streak without breaking it — useful during breaks or travel.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StreakSettings;
