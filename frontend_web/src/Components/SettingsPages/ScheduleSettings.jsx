import React, { useState } from "react";
import Footer from "../Footer";

const ScheduleSettings = () => {
  const [schedulingEnabled, setSchedulingEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [preferredTime, setPreferredTime] = useState("08:00 AM");

  const timeOptions = [
    "06:00 AM", "08:00 AM", "10:00 AM",
    "12:00 PM", "02:00 PM", "04:00 PM",
    "06:00 PM", "08:00 PM"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-8 w-full max-w-[680px] mx-auto flex-grow">
        <h1 className="text-xl font-bold mb-6 mt-4">Schedule Settings</h1>

        <div className="bg-white border border-gray-120 rounded-2xl shadow-sm px-4 py-5 space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-base font-medium">Enable scheduling</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={schedulingEnabled}
                onChange={() => setSchedulingEnabled(!schedulingEnabled)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-base font-medium">Daily reminders</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={remindersEnabled}
                onChange={() => setRemindersEnabled(!remindersEnabled)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="text-base font-medium block mb-2">
              Preferred time slot
            </label>
            <select
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 text-[13px] text-gray-600 space-y-2">
          <p>
            Enable scheduling to automatically organize your tasks and activities.
            Daily reminders help keep you on track.
          </p>
          <p>
            Your preferred time slot determines when your reminders or scheduled activities will be prioritized throughout the day.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ScheduleSettings;
