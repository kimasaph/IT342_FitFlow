import React, { useState, useEffect, useRef } from "react";
import DashboardTemplate from "./DashboardTemplate";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import FlagIcon from "@mui/icons-material/Flag";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import alarmSoundFile from "/src/assets/sounds/sound2.mp3";

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [alarmTime, setAlarmTime] = useState("");
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);
  const [isAlarmSet, setIsAlarmSet] = useState(false);

  const alarmAudio = useRef(null);

  useEffect(() => {
    alarmAudio.current = new Audio(alarmSoundFile);
    alarmAudio.current.preload = "auto";
    alarmAudio.current.load();

    return () => {
      if (alarmAudio.current) {
        alarmAudio.current.pause();
        alarmAudio.current = null;
      }
    };
  }, []);

  useEffect (() => {
    document.title = "Dashboard | FitFlow";
  }, []);

  useEffect(() => {
    const clockInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      if (isAlarmSet && alarmTime) {
        const [alarmHours, alarmMinutes] = alarmTime.split(":").map(Number);
        if (
          now.getHours() === alarmHours &&
          now.getMinutes() === alarmMinutes &&
          !isAlarmRinging
        ) {
          triggerAlarm();
        }
      }
    }, 1000);
    return () => clearInterval(clockInterval);
  }, [alarmTime, isAlarmSet, isAlarmRinging]);

  useEffect(() => {
    let timerInterval;
    if (isTimerRunning) {
      timerInterval = setInterval(() => {
        setTimer((prev) => prev + 10);
      }, 10);
    } else {
      clearInterval(timerInterval);
    }
    return () => clearInterval(timerInterval);
  }, [isTimerRunning]);

  const handleStartTimer = () => {
    setIsTimerRunning(true);
  };

  const handleStopTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimer(0);
  };

  const triggerAlarm = () => {
    setNotifications((prev) => [
      ...prev,
      { id: Date.now(), message: "Alarm ringing! Click to stop." },
    ]);
    try {
      alarmAudio.current.loop = true;
      alarmAudio.current.play();
      setIsAlarmRinging(true);
    } catch (error) {
      console.error("Error playing alarm sound:", error);
    }
  };

  const stopAlarm = () => {
    if (alarmAudio.current) {
      alarmAudio.current.pause();
      alarmAudio.current.currentTime = 0;
      alarmAudio.current.loop = false;
    }
    setIsAlarmRinging(false);
    setNotifications((prev) =>
      prev.filter((notification) => !notification.message.includes("Alarm ringing"))
    );
    setIsAlarmSet(false);
    setAlarmTime(""); // Reset the alarm setter
  };

  const handleSetAlarm = (e) => {
    setAlarmTime(e.target.value);
    setIsAlarmSet(false);
  };

  const handleConfirmAlarm = () => {
    if (alarmTime) {
      const [hours, minutes] = alarmTime.split(":").map(Number);
      const period = hours >= 12 ? "PM" : "AM";
      const standardHours = hours % 12 || 12;
      const formattedTime = `${standardHours}:${String(minutes).padStart(2, "0")} ${period}`;
      setIsAlarmSet(true);
      setNotifications((prev) => [
        ...prev,
        { id: Date.now(), message: `Alarm set for ${formattedTime}` },
      ]);
    }
  };

  const formatTimer = (time) => {
    const milliseconds = time % 1000;
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 1000 / 60) % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(3, "0")}`;
  };

  const handleCardClick = (destination) => {
    console.log(`Navigating to ${destination}`);
  };

  return (
    <DashboardTemplate 
      notifications={notifications} 
      notificationCount={notifications.length}
      stopAlarm={stopAlarm}
    >
      {/* Tracker content */}
      <div className="p-5 space-y-10">
        {/* Header Section */}
        <div className="bg-blue-600 text-white rounded-lg p-6 shadow-lg">
          <h1 className="text-4xl font-extrabold mb-3">Track Your Daily Activities</h1>
          <p className="text-base leading-relaxed">
            Imagine waking up each morning knowing exactly what needs to be done, with a clear sense of purpose. By tracking your daily activities, you're not just jotting down tasks; you're taking control of your time, energy, and future. Every step you take, no matter how small, brings you closer to your goals.
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Workout Card */}
          <div
            className="bg-blue-100 shadow-md rounded-lg p-6 text-center transform transition-all hover:scale-110 hover:shadow-xl hover:bg-blue-200 group cursor-pointer"
            onClick={() => handleCardClick("/workout")}
          >
            <div className="relative">
              <FitnessCenterIcon
                className="text-blue-600 group-hover:hidden"
                style={{ fontSize: "50px" }}
              />
              <img
                src="/src/assets/gif/workouticon.gif"
                alt="Workout Animation"
                className="hidden group-hover:block w-12 h-12 mx-auto"
              />
            </div>
            <h2 className="text-2xl font-bold text-blue-600 mt-3 group-hover:text-blue-800">Workout</h2>
            <p className="text-gray-700 text-lg group-hover:text-gray-900">4 hrs</p>
          </div>

          {/* Steps Card */}
          <div
            className="bg-green-100 shadow-md rounded-lg p-6 text-center transform transition-all hover:scale-110 hover:shadow-xl hover:bg-green-200 group cursor-pointer"
            onClick={() => handleCardClick("/steps")}
          >
            <div className="relative">
              <DirectionsWalkIcon
                className="text-green-600 group-hover:hidden"
                style={{ fontSize: "50px" }}
              />
              <img
                src="/src/assets/gif/greensteps.gif"
                alt="Steps Animation"
                className="hidden group-hover:block w-14 h-14 mx-auto"
              />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mt-3 group-hover:text-green-800">Steps</h2>
            <p className="text-gray-700 text-lg group-hover:text-gray-900">2,000 steps</p>
          </div>

          {/* Calories Card */}
          <div
            className="bg-orange-100 shadow-md rounded-lg p-6 text-center transform transition-all hover:scale-110 hover:shadow-xl hover:bg-orange-200 group cursor-pointer"
            onClick={() => handleCardClick("/calories")}
          >
            <div className="relative">
              <LocalFireDepartmentIcon
                className="text-orange-600 group-hover:hidden"
                style={{ fontSize: "50px" }}
              />
              <img
                src="/src/assets/gif/calories.gif"
                alt="Calories Animation"
                className="hidden group-hover:block w-12 h-12 mx-auto"
              />
            </div>
            <h2 className="text-2xl font-bold text-orange-600 mt-3 group-hover:text-orange-800">Calories</h2>
            <p className="text-gray-700 text-lg group-hover:text-gray-900">1,800 kcal</p>
          </div>
        </div>

        {/* Workout Tracker */}
        <div
          className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow relative cursor-pointer"
          onClick={() => handleCardClick("/workout-tracker")}
        >
          <div className="flex items-start gap-4">
            <FitnessCenterIcon className="text-blue-600" style={{ fontSize: "40px" }} />
            <div>
              <h2 className="text-2xl font-bold mb-3 text-blue-600">Workout Tracker</h2>
              <p className="text-gray-600 mb-4">Track your daily workouts and progress here.</p>
              <ul className="list-disc list-inside space-y-2 text-gray-800">
                <li>Push-ups: <span className="font-semibold">20 reps</span></li>
                <li>Squats: <span className="font-semibold">15 reps</span></li>
                <li>Running: <span className="font-semibold">2 miles</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Goals Tracker */}
        <div
          className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow relative cursor-pointer"
          onClick={() => handleCardClick("/goals-tracker")}
        >
          <div className="flex items-start gap-4">
            <FlagIcon className="text-green-600" style={{ fontSize: "40px" }} />
            <div>
              <h2 className="text-2xl font-bold mb-3 text-green-600">Goals Tracker</h2>
              <p className="text-gray-600 mb-4">Monitor your fitness goals and achievements.</p>
              <ul className="list-disc list-inside space-y-2 text-gray-800">
                <li>Lose <span className="font-semibold">5 lbs</span> in 1 month</li>
                <li>Run a <span className="font-semibold">5k marathon</span></li>
                <li>Increase bench press by <span className="font-semibold">10 lbs</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Meal Plan Tracker */}
        <div
          className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow relative cursor-pointer"
          onClick={() => handleCardClick("/meal-plan-tracker")}
        >
          <div className="flex items-start gap-4">
            <RestaurantIcon className="text-orange-600" style={{ fontSize: "40px" }} />
            <div>
              <h2 className="text-2xl font-bold mb-3 text-orange-600">Meal Plan Tracker</h2>
              <p className="text-gray-600 mb-4">Keep track of your daily meal plans and nutrition.</p>
              <ul className="list-disc list-inside space-y-2 text-gray-800">
                <li>Breakfast: <span className="font-semibold">Oatmeal and fruits</span></li>
                <li>Lunch: <span className="font-semibold">Grilled chicken salad</span></li>
                <li>Dinner: <span className="font-semibold">Steamed fish and vegetables</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Timer and Real-Time Clock Section */}
        <div className="bg-gray-100 shadow-md rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-5 text-gray-800">Utilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Real-Time Clock */}
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <h3 className="text-xl font-semibold text-gray-700">Real-Time Clock</h3>
              <p className="text-2xl font-bold text-gray-900 mt-3">
                {currentTime.toLocaleTimeString()}
              </p>
            </div>

            {/* Timer */}
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <h3 className="text-xl font-semibold text-gray-700">Timer</h3>
              <p className="text-2xl font-bold text-gray-900 mt-3">{formatTimer(timer)}</p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={handleStartTimer}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Start
                </button>
                <button
                  onClick={handleStopTimer}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition"
                >
                  Stop
                </button>
                <button
                  onClick={handleResetTimer}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Alarm */}
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <h3 className="text-xl font-semibold text-gray-700">Alarm</h3>
              <input
                type="time"
                value={alarmTime}
                onChange={handleSetAlarm}
                className="mt-3 p-2 border rounded-md w-full"
              />
              <button
                onClick={handleConfirmAlarm}
                disabled={!alarmTime || isAlarmSet}
                className={`mt-3 px-4 py-2 rounded-md transition ${
                  isAlarmSet
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isAlarmSet ? "Alarm Confirmed" : "Confirm Alarm"}
              </button>
              {isAlarmSet && (
                <p className="text-sm text-green-600 font-semibold mt-2">
                  Alarm is set and active
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Toast for Alarm Ringing */}
        {isAlarmRinging && (
          <div className="fixed bottom-5 right-5 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-4">
            <p className="font-semibold">Alarm is ringing!</p>
            <button
              onClick={stopAlarm}
              className="bg-white text-red-600 px-3 py-1 rounded-md hover:bg-gray-200 transition"
            >
              Stop
            </button>
          </div>
        )}
      </div>
    </DashboardTemplate>
  );
};

export default Dashboard;
