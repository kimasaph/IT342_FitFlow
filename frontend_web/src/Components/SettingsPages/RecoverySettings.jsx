import React, { useState, useEffect } from "react";
import Footer from "../Footer";

const RecoverySettings = () => {
  const [sleepGoal, setSleepGoal] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (sleepGoal || wakeTime) {
      setIsModified(true);
    } else {
      setIsModified(false);
    }
  }, [sleepGoal, wakeTime]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ sleepGoal, wakeTime });
    // Handle save or API call
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-8 w-full max-w-[680px] mx-auto flex-grow">
        <h1 className="text-xl font-bold mb-6 mt-4">Sleep & Recovery</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[15px] font-bold mb-2">Target Sleep Hours</label>
            <input
              type="number"
              value={sleepGoal}
              onChange={(e) => setSleepGoal(e.target.value)}
              placeholder="e.g., 8"
              min="4"
              max="12"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[15px] font-bold mb-2">Preferred Wake-Up Time</label>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none"
            />
          </div>

          <div className="mt-6 text-[12px] text-gray-600">
            Quality sleep supports muscle repair, energy levels, and cognitive performance.
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

export default RecoverySettings;
