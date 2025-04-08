import React, { useState } from "react";
import Footer from "../Footer";

const ThemeSettings = () => {
  const [darkMode, setDarkMode] = useState(false);

  const handleToggle = () => {
    setDarkMode(!darkMode);
    console.log(`Switched to ${!darkMode ? "Dark" : "Light"} Mode`);
    // Optionally: apply a class to <html> or update theme context here
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-8 w-full max-w-[680px] mx-auto flex-grow">
        <h1 className="text-xl font-bold mb-6 mt-4">Theme</h1>

        <div className="bg-white border border-gray-120 rounded-2xl shadow-sm px-4 py-5">
          <div className="flex justify-between items-center">
            <span className="text-base font-medium">Dark mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={handleToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-black"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
            </label>
          </div>
        </div>

        <div className="mt-4 text-[13px] text-gray-600">
          <p>
            Choose your preferred theme. Dark mode is easier on the eyes in low-light environments, while light mode is better for daylight use.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ThemeSettings;
