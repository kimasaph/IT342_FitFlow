// Upcoming Reminders Component

import React from "react";
import { Bell, Dumbbell, Coffee } from "lucide-react";

const UpcomingReminders = ({ events }) => {
  const today = new Date();
  
  // Get upcoming events (within the next 48 hours)
  const upcoming = events
    .filter(event => {
      const eventDate = new Date(event.start);
      const hoursUntil = (eventDate - today) / (1000 * 60 * 60);
      return !event.completed && hoursUntil > 0 && hoursUntil < 48;
    })
    .sort((a, b) => a.start - b.start)
    .slice(0, 4);
  
  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date relative to today
  const formatRelativeDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.getDate() === today.getDate() && 
        date.getMonth() === today.getMonth() && 
        date.getFullYear() === today.getFullYear()) {
      return "Today";
    } else if (date.getDate() === tomorrow.getDate() && 
               date.getMonth() === tomorrow.getMonth() && 
               date.getFullYear() === tomorrow.getFullYear()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-bold mb-4">Upcoming Reminders</h3>
      
      {upcoming.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <Bell className="mx-auto mb-2 opacity-50" size={24} />
          <p>No upcoming activities</p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcoming.map((event) => (
            <div 
              key={event.id} 
              className="p-3 rounded-lg bg-gray-50 border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {formatRelativeDate(new Date(event.start))} at {formatTime(event.start)}
                  </p>
                  <p className="font-medium mt-1">{event.title}</p>
                </div>
                
                {event.type === "meal" ? (
                  <Coffee size={16} className="text-green-600" />
                ) : (
                  <Dumbbell size={16} className="text-purple-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingReminders;