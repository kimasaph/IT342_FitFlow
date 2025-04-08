import React, { useState, useEffect } from "react";
import Footer from "../Footer";

const BodyMetricsSettings = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");

  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    // Trigger change detection if any field has a value
    if (height || weight || age) {
      setIsModified(true);
    } else {
      setIsModified(false);
    }
  }, [height, weight, age]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ height, weight, age });
    // Submit logic here
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-8 w-full max-w-[680px] mx-auto flex-grow">
        <h1 className="text-xl font-bold mb-6 mt-4">Body Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Height */}
          <div>
            <label className="block text-[15px] font-bold mb-2">Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g., 170"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-[15px] font-bold mb-2">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g., 65"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-[15px] font-bold mb-2">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g., 21"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none"
            />
          </div>

          <div className="mt-6 text-[12px] text-gray-600">
            This information helps us personalize your fitness journey. It would be part of your public profile.
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

export default BodyMetricsSettings;
