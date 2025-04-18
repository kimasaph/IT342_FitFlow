"use client"

import { useState, useEffect, useRef, useContext } from "react"
import DashboardSimple from "/src/Components/DashboardSimple"
import { AuthContext } from "/src/Contexts/AuthContext" // Ensure this context exists or replace with your actual authentication context

// Ensure these imports exist or replace them with actual icon imports
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import HistoryIcon from "@mui/icons-material/History";
import DumbbellIcon from "@mui/icons-material/FitnessCenter";
import PlusIcon from "@mui/icons-material/Add";
import ClockIcon from "@mui/icons-material/AccessTime";
import SearchIcon from "@mui/icons-material/Search";
import FilterIcon from "@mui/icons-material/FilterList";
import ChevronDownIcon from "@mui/icons-material/ExpandMore";
import FlameIcon from "@mui/icons-material/Whatshot";

export default function StrengthTrainingTemplate() {
  const { user } = useContext(AuthContext); // Get the authenticated user from context
  const accountId = user?.id || "guest"; // Use the authenticated user's ID or fallback to "guest"

  // Simulate account role (e.g., MEMBER)
  const accountRole = "MEMBER";

  // Basic state
  const [activeTab, setActiveTab] = useState("workout");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("all");
  const [hasActiveWorkout, setHasActiveWorkout] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState(null); // Initialize current workout state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: "",
    muscleGroup: "",
    difficulty: "",
  });
  const [restTime, setRestTime] = useState(60); // Rest timer in seconds
  const [remainingTime, setRemainingTime] = useState(restTime); // Remaining time for the countdown
  const [isResting, setIsResting] = useState(false);
  const timerRef = useRef(null); // Reference to the timer interval

  // Sample workout templates
  const initialWorkoutTemplates = [
    {
      id: "template1",
      name: "Full Body Strength",
      exercises: 0, // Set to 0 as no exercises are created yet
    },
    {
      id: "template2",
      name: "Upper Body Focus",
      exercises: 0, // Set to 0 as no exercises are created yet
    },
    {
      id: "template3",
      name: "Lower Body Power",
      exercises: 0, // Set to 0 as no exercises are created yet
    },
  ];

  // State for workout templates
  const [workoutTemplates, setWorkoutTemplates] = useState(initialWorkoutTemplates);

  // Sample exercise data
  const exerciseData = [
    {
      id: "ex1",
      name: "Barbell Bench Press",
      muscleGroup: "chest",
      difficulty: "intermediate",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "ex2",
      name: "Barbell Squat",
      muscleGroup: "legs",
      difficulty: "intermediate",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "ex3",
      name: "Deadlift",
      muscleGroup: "back",
      difficulty: "advanced",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "ex4",
      name: "Dumbbell Bicep Curl",
      muscleGroup: "arms",
      difficulty: "beginner",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
  ];

  // Load data from local storage
  useEffect(() => {
    const storedWorkouts = JSON.parse(localStorage.getItem(`${accountId}-workouts`)) || [];
    const storedTemplates = JSON.parse(localStorage.getItem(`${accountId}-templates`)) || initialWorkoutTemplates;

    setCurrentWorkout(storedWorkouts.find((w) => w.isActive) || null);
    setHasActiveWorkout(!!storedWorkouts.find((w) => w.isActive));
    setWorkoutTemplates(storedTemplates);
  }, []);

  // Save workouts and templates to local storage
  const saveWorkoutsToStorage = (workouts) => {
    localStorage.setItem(`${accountId}-workouts`, JSON.stringify(workouts));
  };

  const saveTemplatesToStorage = (templates) => {
    localStorage.setItem(`${accountId}-templates`, JSON.stringify(templates));
  };

  // Start a new workout
  const startNewWorkout = (templateId) => {
    const newWorkout = templateId
      ? {
          id: `workout-${Date.now()}`,
          name: workoutTemplates.find((t) => t.id === templateId).name,
          exercises: [],
          isActive: true,
        }
      : {
          id: `workout-${Date.now()}`,
          name: "New Workout",
          exercises: [],
          isActive: true,
        };

    const storedWorkouts = JSON.parse(localStorage.getItem(`${accountId}-workouts`)) || [];
    storedWorkouts.forEach((w) => (w.isActive = false)); // Deactivate other workouts
    storedWorkouts.push(newWorkout);

    saveWorkoutsToStorage(storedWorkouts);
    setCurrentWorkout(newWorkout);
    setHasActiveWorkout(true);
  };

  // Complete the current workout
  const completeWorkout = () => {
    const storedWorkouts = JSON.parse(localStorage.getItem(`${accountId}-workouts`)) || [];
    const updatedWorkouts = storedWorkouts.map((w) =>
      w.id === currentWorkout.id ? { ...w, isActive: false } : w
    );

    saveWorkoutsToStorage(updatedWorkouts);
    setCurrentWorkout(null);
    setHasActiveWorkout(false);
  };

  // Add a new template
  const addTemplate = (template) => {
    const newTemplates = [...workoutTemplates, template];
    setWorkoutTemplates(newTemplates);
    saveTemplatesToStorage(newTemplates);
  };

  // Add a new exercise to the current workout
  const addExerciseToWorkout = (exercise) => {
    setCurrentWorkout((prevWorkout) => ({
      ...prevWorkout,
      exercises: [
        ...prevWorkout.exercises,
        { id: `exercise-${Date.now()}`, name: exercise.name, muscleGroup: exercise.muscleGroup, difficulty: exercise.difficulty, sets: [] },
      ],
    }));
  };

  // Open the modal to add a new exercise
  const openAddExerciseModal = () => {
    setNewExercise({ name: "", muscleGroup: "", difficulty: "" });
    setIsModalOpen(true);
  };

  // Handle adding a new exercise
  const handleAddExercise = () => {
    if (!newExercise.name || !newExercise.muscleGroup || !newExercise.difficulty) {
      alert("Please fill out all fields.");
      return;
    }

    setCurrentWorkout((prevWorkout) => ({
      ...prevWorkout,
      exercises: [
        ...prevWorkout.exercises,
        {
          id: `exercise-${Date.now()}`,
          ...newExercise,
          sets: [{ weight: "", reps: "", done: false }],
        },
      ],
    }));
    setIsModalOpen(false);
  };

  // Update an existing exercise in the current workout
  const updateExerciseInWorkout = (exerciseId, updatedExercise) => {
    setCurrentWorkout((prevWorkout) => ({
      ...prevWorkout,
      exercises: prevWorkout.exercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, ...updatedExercise } : exercise
      ),
    }));
  };

  // Delete an exercise from the current workout
  const deleteExerciseFromWorkout = (exerciseId) => {
    setCurrentWorkout((prevWorkout) => ({
      ...prevWorkout,
      exercises: prevWorkout.exercises.filter((exercise) => exercise.id !== exerciseId),
    }));
  };

  // Start or reset the rest timer
  const startRestTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current); // Clear any existing timer
    setRemainingTime(restTime);
    setIsResting(true);

    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsResting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Cleanup the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Calculate workout progress
  const calculateProgress = () => {
    if (!currentWorkout || currentWorkout.exercises.length === 0) return 0;
    const totalSets = currentWorkout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    const completedSets = currentWorkout.exercises.reduce(
      (sum, ex) => sum + ex.sets.filter((set) => set.done).length,
      0
    );
    return totalSets === 0 ? 0 : Math.round((completedSets / totalSets) * 100);
  };

  return (
    <DashboardSimple>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-md hover:bg-gray-100"
                onClick={() => {
                  if (activeTab === "exercises") {
                    setActiveTab("workout");
                  } else if (activeTab === "history") {
                    setActiveTab("exercises");
                  }
                }}
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold">Strength Training</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-md border border-gray-200 hover:bg-gray-100">
                <HistoryIcon className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <img src="/placeholder.svg?height=32&width=32" alt="User" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* Navigation Tabs */}
          <div className="mb-6">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                  activeTab === "workout"
                    ? "bg-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => {
                  setActiveTab("workout");
                  setHasActiveWorkout(false); // Reset to main home tab of current workouts
                }}
              >
                Current Workout
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                  activeTab === "exercises"
                    ? "bg-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("exercises")}
              >
                Exercises
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                  activeTab === "history"
                    ? "bg-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("history")}
              >
                History
              </button>
            </div>
          </div>

          {/* Add Exercise Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add New Exercise</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Exercise Name</label>
                    <input
                      type="text"
                      value={newExercise.name}
                      onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Muscle Group</label>
                    <input
                      type="text"
                      value={newExercise.muscleGroup}
                      onChange={(e) => setNewExercise({ ...newExercise, muscleGroup: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                    <input
                      type="text"
                      value={newExercise.difficulty}
                      onChange={(e) => setNewExercise({ ...newExercise, difficulty: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    onClick={handleAddExercise}
                  >
                    Add Exercise
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Current Workout Tab */}
          {activeTab === "workout" && (
            <div className="space-y-6">
              {hasActiveWorkout && currentWorkout ? (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold">{currentWorkout.name}</h2>
                      <p className="text-gray-500">{new Date().toLocaleDateString()} • {currentWorkout.exercises.length} exercises</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-100"
                        onClick={openAddExerciseModal}
                      >
                        <PlusIcon className="h-4 w-4" />
                        <span>Add Exercise</span>
                      </button>
                    </div>
                  </div>

                  {/* Workout Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Workout Progress</span>
                      <span className="text-sm font-medium">{calculateProgress()}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${calculateProgress()}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Rest Timer */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium">Rest Timer</h3>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-col items-center gap-4">
                        <div className="text-4xl font-bold">
                          {`${Math.floor(remainingTime / 60)
                            .toString()
                            .padStart(2, "0")}:${(remainingTime % 60).toString().padStart(2, "0")}`}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 border border-gray-200 rounded-md hover:bg-gray-100"
                            onClick={startRestTimer}
                            disabled={isResting}
                          >
                            <ClockIcon className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          {[30, 60, 90, 120].map((time) => (
                            <button
                              key={time}
                              className="px-3 py-1 text-sm rounded-md hover:bg-gray-100"
                              onClick={() => {
                                setRestTime(time);
                                setRemainingTime(time);
                              }}
                            >
                              {time / 60}m
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Exercise List */}
                  <div className="space-y-4">
                    {currentWorkout.exercises.map((exercise) => (
                      <div key={exercise.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3
                                className="font-medium"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  updateExerciseInWorkout(exercise.id, { name: e.target.textContent })
                                }
                              >
                                {exercise.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                  contentEditable
                                  suppressContentEditableWarning
                                  onBlur={(e) =>
                                    updateExerciseInWorkout(exercise.id, { muscleGroup: e.target.textContent })
                                  }
                                >
                                  {exercise.muscleGroup}
                                </span>
                                <span
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                  contentEditable
                                  suppressContentEditableWarning
                                  onBlur={(e) =>
                                    updateExerciseInWorkout(exercise.id, { difficulty: e.target.textContent })
                                  }
                                >
                                  {exercise.difficulty}
                                </span>
                              </div>
                            </div>
                            <button
                              className="text-sm px-3 py-1 hover:bg-gray-100 rounded-md"
                              onClick={() => deleteExerciseFromWorkout(exercise.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="space-y-4">
                            {/* Set Headers */}
                            <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-500">
                              <div className="col-span-1">#</div>
                              <div className="col-span-4">Weight (kg)</div>
                              <div className="col-span-4">Reps</div>
                              <div className="col-span-3">Done</div>
                            </div>

                            {/* Sets */}
                            {exercise.sets.map((set, index) => (
                              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-1 text-sm font-medium">{index + 1}</div>
                                <div className="col-span-4">
                                  <input
                                    type="number"
                                    value={set.weight}
                                    onChange={(e) =>
                                      updateExerciseInWorkout(exercise.id, {
                                        sets: exercise.sets.map((s, i) =>
                                          i === index ? { ...s, weight: e.target.value } : s
                                        ),
                                      })
                                    }
                                    className="w-full h-9 px-3 py-2 bg-white border border-gray-300 rounded-md"
                                  />
                                </div>
                                <div className="col-span-4">
                                  <input
                                    type="number"
                                    value={set.reps}
                                    onChange={(e) =>
                                      updateExerciseInWorkout(exercise.id, {
                                        sets: exercise.sets.map((s, i) =>
                                          i === index ? { ...s, reps: e.target.value } : s
                                        ),
                                      })
                                    }
                                    className="w-full h-9 px-3 py-2 bg-white border border-gray-300 rounded-md"
                                  />
                                </div>
                                <div className="col-span-3 flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={set.done}
                                    onChange={(e) =>
                                      updateExerciseInWorkout(exercise.id, {
                                        sets: exercise.sets.map((s, i) =>
                                          i === index ? { ...s, done: e.target.checked } : s
                                        ),
                                      })
                                    }
                                    className="h-4 w-4 rounded-sm"
                                  />
                                </div>
                              </div>
                            ))}

                            {/* Add Set Button */}
                            <button
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-100"
                              onClick={() =>
                                updateExerciseInWorkout(exercise.id, {
                                  sets: [...exercise.sets, { weight: "", reps: "", done: false }],
                                })
                              }
                            >
                              <PlusIcon className="h-4 w-4" />
                              <span>Add Set</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Complete Workout Button */}
                    <button
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium"
                      onClick={completeWorkout}
                    >
                      Complete Workout
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <DumbbellIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-xl font-medium">No Active Workout</h3>
                  <p className="mt-2 text-gray-500">Start a new workout or choose from a template</p>
                  <div className="mt-6 flex flex-col gap-4">
                    <button
                      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
                      onClick={() => startNewWorkout()}
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span>Start Empty Workout</span>
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {workoutTemplates.map((template) => (
                        <div
                          key={template.id}
                          className="bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium">{template.name}</h3>
                            <p className="text-sm text-gray-500">{template.exercises} exercises</p>
                          </div>
                          <div className="p-4">
                            <div className="flex flex-wrap gap-1">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Bench Press
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Squat
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                +3 more
                              </span>
                            </div>
                          </div>
                          <div className="p-4 border-t border-gray-200">
                            <button
                              className="w-full text-center py-2 px-4 text-sm hover:bg-gray-100 rounded-md"
                              onClick={() => startNewWorkout(template.id)}
                            >
                              Use Template
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Exercises Tab */}
          {activeTab === "exercises" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="search"
                      placeholder="Search exercises..."
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <button
                      className="flex items-center justify-between w-[160px] px-3 py-2 bg-white border border-gray-300 rounded-md"
                      onClick={() => setIsSelectOpen(!isSelectOpen)}
                    >
                      <span>{selectedMuscleGroup === "all" ? "All Muscle Groups" : selectedMuscleGroup}</span>
                      <ChevronDownIcon className="h-4 w-4" />
                    </button>
                    {isSelectOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                        <div className="py-1">
                          {["all", "chest", "back", "legs", "arms"].map((group) => (
                            <button
                              key={group}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                              onClick={() => {
                                setSelectedMuscleGroup(group);
                                setIsSelectOpen(false);
                              }}
                            >
                              {group === "all" ? "All Muscle Groups" : group}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-100">
                    <FilterIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exerciseData.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm"
                  >
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-medium">{exercise.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {exercise.muscleGroup}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {exercise.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="aspect-video bg-gray-200 rounded-md overflow-hidden">
                        <img
                          src={exercise.imageUrl || "/placeholder.svg"}
                          alt={exercise.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-200 flex justify-between">
                      <button className="text-sm px-3 py-1 hover:bg-gray-100 rounded-md">
                        View Details
                      </button>
                      <button
                        className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md"
                        onClick={() => addExerciseToWorkout(exercise)}
                      >
                        <PlusIcon className="h-4 w-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Workout History</h2>
                <button className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-100">
                  <FlameIcon className="h-4 w-4" />
                  <span>View Stats</span>
                </button>
              </div>

              <div className="space-y-4">
                {/* Sample History Card */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Full Body Workout</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">April 15, 2025 • 5 exercises</p>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2">
                      {/* Sample Exercise Entry */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-200 h-8 w-8 rounded-md flex items-center justify-center">
                            <DumbbellIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Barbell Bench Press</p>
                            <p className="text-xs text-gray-500">3 / 3 sets completed</p>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          chest
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-200 h-8 w-8 rounded-md flex items-center justify-center">
                            <DumbbellIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Barbell Squat</p>
                            <p className="text-xs text-gray-500">3 / 3 sets completed</p>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          legs
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <button className="w-full text-center py-2 px-4 text-sm hover:bg-gray-100 rounded-md">
                      View Details
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Upper Body Focus</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">April 13, 2025 • 4 exercises</p>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2">
                      {/* Sample Exercise Entries */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-200 h-8 w-8 rounded-md flex items-center justify-center">
                            <DumbbellIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Dumbbell Bicep Curl</p>
                            <p className="text-xs text-gray-500">3 / 3 sets completed</p>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          arms
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <button className="w-full text-center py-2 px-4 text-sm hover:bg-gray-100 rounded-md">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </DashboardSimple>
  );
}
