import React, { useState } from "react";
import Footer from "../Footer";

const BadgeSettings = () => {
  const [showBadges, setShowBadges] = useState(true);
  const [autoDisplay, setAutoDisplay] = useState(true);

  const handleReset = () => {
    // replace with a confirmation modal or API call
    console.log("Achievements reset");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-8 w-full max-w-[680px] mx-auto flex-grow">
        <h1 className="text-xl font-bold mb-6 mt-4">Achievements & Badges</h1>

        <div className="bg-white border border-gray-120 rounded-2xl shadow-sm px-4 py-5 space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-base font-medium">Show badges on profile</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showBadges}
                onChange={() => setShowBadges(!showBadges)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-base font-medium">Auto-display new achievements</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoDisplay}
                onChange={() => setAutoDisplay(!autoDisplay)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleReset}
            className="bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-4 rounded-xl transition ml-2"
          >
            Reset Achievements
          </button>
        </div>

        <div className="mt-5 text-[12px] text-gray-600 space-y-2">
          <p>
            You can choose whether to show your badges on your profile and if new achievements will be automatically visible.
          </p>
          <p>
            Resetting your achievements will permanently remove all earned badges. This action cannot be undone.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BadgeSettings;
