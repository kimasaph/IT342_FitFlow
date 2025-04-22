import React, { useState, useRef } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Calorie options
const calorieOptions = [
  { label: "Detox", kcal: "750" },
  { label: "Cleanse", kcal: "900" },
  { label: "Cutting", kcal: "1300" },
  { label: "Decreasing", kcal: "1500" },
  { label: "Balance", kcal: "2000" },
  { label: "Lean Bulk", kcal: "2500" },
  { label: "Muscle Gain", kcal: "2800" },
  { label: "Bulking", kcal: "3000" },
  { label: "Athletic", kcal: "3200" },
  { label: "Mass Gain", kcal: "3600" },
];

const itemWidth = 100;
const gap = 8;

// 📦 Program Carousel Component
const ProgramCarousel = ({ options, selectedIndex, onSelect }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(null);
  const visibleItemCount = 5;
  const carouselRef = useRef(null);

  const visibleOptions = React.useMemo(() => {
    const result = [];
    for (let i = 0; i < visibleItemCount; i++) {
      const index = startIndex + i;
      if (index >= 0 && index < options.length) {
        result.push({ ...options[index], actualIndex: index });
      } else {
        result.push({ label: "", kcal: "", actualIndex: -1, placeholder: true });
      }
    }
    return result;
  }, [startIndex, options]);

  const handleNext = () => {
    if (startIndex + visibleItemCount < options.length && !isAnimating) {
      setIsAnimating(true);
      setDirection("right");
      setTimeout(() => {
        setStartIndex((prev) => prev + 1);
        setIsAnimating(false);
      }, 100);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setDirection("left");
      setTimeout(() => {
        setStartIndex((prev) => prev - 1);
        setIsAnimating(false);
      }, 100);
    }
  };

  return (
    <div className="flex items-center gap-4 relative mt-[-15px]">
      <button
        onClick={handlePrev}
        className={`flex items-center justify-center w-8 h-8 rounded-full bg-white shadow flex-shrink-0 
          transition-all duration-200 transform z-10
          ${startIndex > 0 ? 
            'opacity-100 hover:bg-blue-50 hover:scale-110 hover:shadow-md cursor-pointer' : 
            'opacity-50 cursor-not-allowed'}`}
        disabled={startIndex === 0}
      >
        <ChevronLeft className="text-gray-600" />
      </button>

      <div
        ref={carouselRef}
        className="relative overflow-hidden"
        style={{
          width: `${visibleItemCount * (itemWidth + gap) - gap}px`,
        }}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${startIndex * (itemWidth + gap)}px)`,
            gap: `${gap}px`,
          }}
        >
          {options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              style={{ width: `${itemWidth}px`, flexShrink: 0 }}
              className={`flex flex-col items-center justify-center px-5 py-2 rounded-lg border whitespace-nowrap
                transform transition-all duration-300
                ${selectedIndex === idx
                  ? "bg-blue-500 text-white scale-95 shadow-md"
                  : "bg-white text-gray-800 hover:bg-blue-50 hover:shadow"
                }`}
            >
              <span className="text-sm font-medium">{option.label}</span>
              <span className="text-sm">{option.kcal} kcal</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        className={`flex items-center justify-center w-8 h-8 rounded-full bg-white shadow flex-shrink-0 
          transition-all duration-200 transform z-10
          ${startIndex + visibleItemCount < options.length ? 
            'opacity-100 hover:bg-blue-50 hover:scale-110 hover:shadow-md cursor-pointer' : 
            'opacity-50 cursor-not-allowed'}`}
        disabled={startIndex + visibleItemCount >= options.length}
      >
        <ChevronRight className="text-gray-600" />
      </button>
    </div>
  );
};

// dummy calorie data
const calorieData = [
  { day: "Mon", calories: 1800 },
  { day: "Tue", calories: 2000 },
  { day: "Wed", calories: 1700 },
  { day: "Thu", calories: 2200 },
  { day: "Fri", calories: 2500 },
  { day: "Sat", calories: 2300 },
  { day: "Sun", calories: 2100 },
];

// 🧠 Main Component
const WeeklyMealPlan = ({ selectedCalorieIndex, setSelectedCalorieIndex }) => {
  return (
    <div className="w-full lg:w-7/10 bg-blue-100 bg-opacity-40 rounded-xl p-4 space-y-6 backdrop-blur">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 ml-3">Create a weekly meal plan</h1>
        <p className="text-sm text-gray-600 ml-3">Select a preferred program:</p>
      </div>

      {/* Carousel */}
      <ProgramCarousel
        options={calorieOptions}
        selectedIndex={selectedCalorieIndex}
        onSelect={setSelectedCalorieIndex}
      />

       {/* Chart - Height reduced and font sizes reduced */}
       <div className="bg-transparent rounded-xl mt-6 mr-7">
        <h2 className="text-sm font-semibold text-gray-700 mb-2 mt-1 text-center">Calorie intake for the week</h2>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={calorieData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis 
              dataKey="day" 
              stroke="#4B5563" 
              tick={{ fontSize: 14 }} // Smaller font for days
            />
            <YAxis 
              stroke="#4B5563" 
              ticks={[1000, 2000, 3000]} 
              domain={[500, 3200]}
              allowDataOverflow={true}
              tick={{ fontSize: 13 }} // Smaller font for calorie numbers
              tickFormatter={(value) => `${value}`} // Format to show just the number
            />
            <Tooltip
              contentStyle={{ backgroundColor: "white", borderRadius: "10px", borderColor: "#ccc" }}
              labelStyle={{ color: "#6B7280", fontSize: 13 }}
              itemStyle={{ fontSize: 13 }}
            />
            <Line
              type="monotone"
              dataKey="calories"
              stroke="#3B82F6"
              strokeWidth={2.5}
              activeDot={{ r: 6 }}
              dot={{ stroke: "#3B82F6", strokeWidth: 2, fill: "white", r: 3 }}
              animationDuration={700}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyMealPlan;