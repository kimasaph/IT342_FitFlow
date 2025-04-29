
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Custom toolbar component for the calendar
const CustomToolbar = toolbar => {
  const { date, onNavigate } = toolbar;
  
  const navigate = (action) => {
    onNavigate(action);
  };
  
  const goToToday = () => {
    onNavigate('TODAY');
  };
  
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('PREV')}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold">
          {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={() => navigate('NEXT')}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={goToToday}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
        >
          Today
        </button>
      </div>
    </div>
  );
};

export default CustomToolbar;