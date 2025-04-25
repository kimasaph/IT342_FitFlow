import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Dashboard from "../DashboardSimple";
import { 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Calendar as CalendarIcon, 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import "react-big-calendar/lib/css/react-big-calendar.css";

import CustomToolbar from "./CustomToolbar";
import AddScheduleItemModal from "./AddScheduleItemModal";
import ScheduleItemDetails from "./ScheduleItemDetails";
import DailyScheduleView from "./DailyScheduleView";
import WeeklyProgress from "./WeeklyProgress";
import UpcomingReminders from "./UpcomingReminders";

// Import helper functions and data
import { initialScheduleData, workoutTypes } from "../SchedulePage/ScheduleData";
import { eventStyleGetter } from "../SchedulePage/eventUtils";

// Set up the localizer for the calendar
const localizer = momentLocalizer(moment);

// Main Schedule Page Component
const MySchedule = () => {
  const [view, setView] = useState("calendar"); // "calendar" or "daily"
  const [events, setEvents] = useState(initialScheduleData);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();
  
  // Get events for the selected date
  const getEventsForSelectedDate = () => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === selectedDate.getDate() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  };
  
  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };
  
  // Handle selecting a date
  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setView("daily");
  };
  
  // Toggle event completion status
  const handleToggleComplete = (eventId) => {
    setEvents(prevEvents => 
      prevEvents.map(event => {
        if (event.id === eventId) {
          const updatedEvent = { ...event, completed: !event.completed };
          
          // Show toast notification
          if (!event.completed) {
            toast.success(`${event.title} completed!`, {
              duration: 3000,
              position: 'top-center',
            });
          }
          
          return updatedEvent;
        }
        return event;
      })
    );
    
    // Close modal if open
    setIsModalOpen(false);
  };
  
  // Add new event
  const handleAddEvent = (newEvent) => {
    setEvents(prevEvents => [...prevEvents, newEvent]);
    
    // Show toast notification
    toast.success(`${newEvent.title} added to your schedule!`, {
      duration: 3000,
      position: 'top-center',
    });
  };
  
  // Delete event
  const handleDeleteEvent = (eventId) => {
    const eventToDelete = events.find(event => event.id === eventId);
    
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    
    // Close modal if open
    setIsModalOpen(false);
    
    // Show toast notification
    toast.success(`${eventToDelete?.title || 'Item'} removed from schedule`, {
      duration: 3000,
      position: 'top-center',
      icon: '🗑️',
      style: {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
      },
    });
  };
  
  // Format the calendar day header
  const dayHeaderFormat = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' }); 
  };
  
  return (
    <Dashboard 
      currentPage="schedule"
      title="My Schedule"
      subtitle="Plan and track your workouts and meals"
    >
      {/* Toast Container */}
      <div className="p-4 md:p-9 bg-white min-h-screen">
      <Toaster />
      
      {/* Page Header - Modified layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-3">
          <h1 className="text-2xl font-bold">My Schedule</h1>
          <p className="text-gray-600">
            Plan your workouts, meals and activities
          </p>
        </div>
        
        <div className="lg:-ml-11 flex items-center justify-end mr-5">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition shadow-sm w-3/4 justify-center"
          >
            <Plus size={18} />
            <span>Add New</span>
          </button>
        </div>
      </div>
      
      {/* View Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView("calendar")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            view === "calendar" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          <CalendarIcon size={18} />
          <span>Calendar</span>
        </button>
        <button
          onClick={() => setView("daily")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            view === "daily" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
          <span>Daily View</span>
        </button>
      </div>
      
      {/* Calendar or Daily View */}
      {view === "calendar" ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={handleEventClick}
                onSelectSlot={({ start }) => handleSelectDate(start)}
                selectable
                popup
                components={{
                  toolbar: CustomToolbar,
                }}
                formats={{
                  dayHeaderFormat: dayHeaderFormat,
                }}
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <WeeklyProgress events={events} />
            <UpcomingReminders events={events} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <DailyScheduleView
              date={selectedDate}
              events={getEventsForSelectedDate()}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteEvent}
            />
          </div>
          
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Calendar</h3>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 300 }}
                views={['month']}
                toolbar={false}
                onSelectEvent={handleEventClick}
                onSelectSlot={({ start }) => handleSelectDate(start)}
                selectable
                eventPropGetter={eventStyleGetter}
                date={selectedDate}
                onNavigate={(date) => setSelectedDate(date)}
              />
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => {
                    const prevDate = new Date(selectedDate);
                    prevDate.setDate(prevDate.getDate() - 1);
                    setSelectedDate(prevDate);
                  }}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <ChevronLeft size={16} />
                </button>
                <p className="text-sm font-medium">
                  {selectedDate.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
                <button
                  onClick={() => {
                    const nextDate = new Date(selectedDate);
                    nextDate.setDate(nextDate.getDate() + 1);
                    setSelectedDate(nextDate);
                  }}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            
            <WeeklyProgress events={events} />
          </div>
        </div>
      )}
      
      {/* Event Details Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <ScheduleItemDetails
              event={selectedEvent}
              onClose={() => setIsModalOpen(false)}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteEvent}
            />
          </div>
        </div>
      )}
      
      {/* Add New Event Modal */}
      <AddScheduleItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddEvent}
      />
    </div>
    </Dashboard>
  );
};

export default MySchedule;