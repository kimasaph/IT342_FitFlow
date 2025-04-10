import React, { useState } from "react";
import Footer from "../Footer";

const AccountPrivacySettings = () => {
  const [isPrivate, setIsPrivate] = useState(true);

  const togglePrivacy = () => {
    setIsPrivate(!isPrivate);
    console.log(`Account is now ${!isPrivate ? "Private" : "Public"}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-8 w-full max-w-[680px] mx-auto flex-grow">
        <h1 className="text-xl font-bold mb-6 mt-4">Account privacy</h1>

        <div className="bg-white border border-gray-120 rounded-2xl shadow-sm px-4 py-5">
          <div className="flex justify-between items-center">
            <span className="text-base font-medium">Private account</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={togglePrivacy}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-black"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
            </label>
          </div>
        </div>

        <div className="mt-7 space-y-2 text-[12px] text-gray-600">
          <p>
            When your account is public, your profile and details can be seen by anyone, on or off FitFlow, even if they don't have a FitFlow account.
          </p>
          <p>
            When your account is private, only the people you approve can see what you share, including your workouts completed or diets and location pages, and your workout and food lists. Certain info on your profile, view your profile picture and username, is visible to everyone on and off FitFlow.{" "}
            <a href="#" className="text-blue-500">Learn more</a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AccountPrivacySettings;
