// Daily Schedule View Component
import { workoutTypes } from "./ScheduleData";
import { CalendarIcon, Coffee, Dumbbell, Check } from "lucide-react";
import React from "react";

const DailyScheduleView = ({ date, events, onToggleComplete, onDelete }) => {
  // Sort events by start time
  const sortedEvents = [...events].sort((a, b) => a.start - b.start);
  
  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-bold mb-4">{formatDate(date)}</h3>
      
      {sortedEvents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <CalendarIcon className="mx-auto mb-2 opacity-50" size={32} />
          <p>No scheduled activities for this day</p>
          <p className="text-sm mt-1">Click the "+" button to add something</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedEvents.map((event) => (
            <div 
              key={event.id} 
              className={`
                p-4 rounded-lg border-l-4 flex justify-between items-center
                ${event.completed ? "opacity-60" : ""}
              `}
              style={{
                borderLeftColor: event.type === "meal" 
                  ? "#10b981" 
                  : workoutTypes[event.type]?.color,
                backgroundColor: event.type === "meal" 
                  ? "#ecfdf5"  
                  : `${workoutTypes[event.type]?.color}10`
              }}
            >
              <div>
                <div className="flex items-center gap-2">
                  {event.type === "meal" ? (
                    <Coffee size={16} className="text-green-600" />
                  ) : (
                    <Dumbbell size={16} className="text-gray-600" />
                  )}
                  <span className="font-medium">
                    {formatTime(event.start)} - {formatTime(event.end)}
                  </span>
                </div>
                <p className="font-semibold mt-1">{event.title}</p>
                {event.type === "meal" && (
                  <p className="text-xs text-gray-600 mt-1">
                    {event.details.calories} kcal · {event.details.protein}g protein
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleComplete(event.id)}
                  className={`
                    p-2 rounded-full
                    ${event.completed 
                      ? "bg-gray-200 text-gray-600" 
                      : "bg-green-100 text-green-600 hover:bg-green-200"}
                  `}
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => onDelete(event.id)}
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyScheduleView;