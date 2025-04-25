// Component for viewing schedule item details

import React, { useState } from "react";
import { Check } from "lucide-react";
import { workoutTypes } from "../SchedulePage/ScheduleData";
import { formatTime } from "../SchedulePage/eventUtils";

const ScheduleItemDetails = ({ event, onClose, onToggleComplete, onDelete }) => {
  if (!event) return null;
  
  const isMeal = event.type === "meal";
  const isCompleted = event.completed;
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{event.title}</h3>
          <p className="text-sm text-gray-500">
            {formatTime(event.start)} - {formatTime(event.end)}
          </p>
        </div>
        
        {isMeal ? (
          <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            Meal
          </div>
        ) : (
          <div 
            className="text-xs px-2 py-1 rounded-full"
            style={{ 
              backgroundColor: `${workoutTypes[event.type]?.color}20`, 
              color: workoutTypes[event.type]?.color 
            }}
          >
            {workoutTypes[event.type]?.label}
          </div>
        )}
      </div>
      
      {isMeal ? (
        // Meal details
        <div className="mt-4">
          <h4 className="font-medium text-gray-700">Nutritional Information</h4>
          <div className="grid grid-cols-4 gap-2 mt-2 text-center">
            <div className="bg-gray-50 rounded p-2">
              <p className="text-lg font-semibold">{event.details.calories}</p>
              <p className="text-xs text-gray-500">Calories</p>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <p className="text-lg font-semibold">{event.details.protein}g</p>
              <p className="text-xs text-gray-500">Protein</p>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <p className="text-lg font-semibold">{event.details.carbs}g</p>
              <p className="text-xs text-gray-500">Carbs</p>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <p className="text-lg font-semibold">{event.details.fats}g</p>
              <p className="text-xs text-gray-500">Fats</p>
            </div>
          </div>
        </div>
      ) : (
        // Workout details
        <div className="mt-4">
          <h4 className="font-medium text-gray-700">Exercises</h4>
          <div className="mt-2 space-y-2">
            {event.details.exercises.map((exercise, index) => (
              <div key={index} className="bg-gray-50 rounded p-2 flex justify-between">
                <div>
                  <p className="font-medium">{exercise.name}</p>
                  {exercise.sets && (
                    <p className="text-xs text-gray-500">
                      {exercise.sets} sets x {exercise.reps} @ {exercise.weight}
                    </p>
                  )}
                  {exercise.duration && (
                    <p className="text-xs text-gray-500">Duration: {exercise.duration}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {event.details.rounds && (
            <p className="text-sm text-gray-600 mt-2">
              Complete {event.details.rounds} rounds
            </p>
          )}
        </div>
      )}
      
      {event.details.notes && (
        <div className="mt-4 bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-gray-700">{event.details.notes}</p>
        </div>
      )}
      
      <div className="flex justify-between mt-6">
        <button
          onClick={() => onDelete(event.id)}
          className="text-red-600 text-sm hover:text-red-800"
        >
          Delete
        </button>
        
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Close
          </button>
          <button
            onClick={() => onToggleComplete(event.id)}
            className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
              isCompleted 
                ? "bg-gray-200 text-gray-700" 
                : "bg-green-600 text-white"
            }`}
          >
            {isCompleted ? (
              <>Completed</>
            ) : (
              <>Mark Complete<Check size={16} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleItemDetails;