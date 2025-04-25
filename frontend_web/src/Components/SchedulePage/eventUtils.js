import { workoutTypes } from "../SchedulePage/ScheduleData";

// Event styles for the calendar
export const eventStyleGetter = (event) => {
  let style = {
    borderRadius: "8px",
    opacity: 0.9,
    border: "0px",
    color: "white",
    display: "block",
    fontWeight: "500",
  };
  
  if (event.type === "meal") {
    style.backgroundColor = "#10b981"; // Green for meals
  } else {
    style.backgroundColor = workoutTypes[event.type]?.color || "#6b7280";
  }
  
  if (event.completed) {
    style.opacity = 0.6;
    style.textDecoration = "line-through";
  }
  
  return { style };
};

// Format time for display
export const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Format date for display
export const formatDate = (date) => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Format date relative to today
export const formatRelativeDate = (date) => {
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