import { useState, useEffect, useRef, useContext } from "react"
import DashboardSimple from "/src/Components/DashboardSimple"
import { AuthContext } from "/src/Contexts/AuthContext" // Ensure this context exists or replace with your actual authentication context

// Ensure these imports exist or replace them with actual icon imports
import ArrowLeftIcon from "@mui/icons-material/ArrowBack"
import HistoryIcon from "@mui/icons-material/History"
import DumbbellIcon from "@mui/icons-material/FitnessCenter"
import PlusIcon from "@mui/icons-material/Add"
import ClockIcon from "@mui/icons-material/AccessTime"
import SearchIcon from "@mui/icons-material/Search"
import FilterIcon from "@mui/icons-material/FilterList"
import ChevronDownIcon from "@mui/icons-material/ExpandMore"
import FlameIcon from "@mui/icons-material/Whatshot"

export default function StrengthTraining() {
  const { user } = useContext(AuthContext) // Get the authenticated user from context
  const accountId = user?.id || "guest" // Use the authenticated user's ID or fallback to "guest"

  // Simulate account role (e.g., MEMBER)
  const accountRole = "MEMBER"

  // Basic state
  const [activeTab, setActiveTab] = useState("workout")
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all"); // Add state for difficulty filter
  const [hasActiveWorkout, setHasActiveWorkout] = useState(false)
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [currentWorkout, setCurrentWorkout] = useState(null) // Initialize current workout state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newExercise, setNewExercise] = useState({
    name: "",
    muscleGroup: "",
    difficulty: "",
  })
  const [restTime, setRestTime] = useState(60) // Rest timer in seconds
  const [remainingTime, setRemainingTime] = useState(restTime) // Remaining time for the countdown
  const [isResting, setIsResting] = useState(false)
  const timerRef = useRef(null) // Reference to the timer interval

  const [completedWorkouts, setCompletedWorkouts] = useState([])
  const [completedExercises, setCompletedExercises] = useState([])

  // Sample workout templates
  const initialWorkoutTemplates = [
    {
      id: "template1",
      name: "Full Body Strength",
    },
    {
      id: "template2",
      name: "Upper Body Focus",
    },
    {
      id: "template3",
      name: "Lower Body Power",
    },
  ]

  // State for workout templates
  const [workoutTemplates, setWorkoutTemplates] = useState(initialWorkoutTemplates)

  // Sample exercise data
  const exerciseData = [
    {
      id: "ex1",
      name: "Barbell Bench Press",
      muscleGroup: "chest",
      difficulty: "intermediate",
      imageUrl: "/src/assets/gif/Intermediate/Barbell Bench Press.gif?height=200&width=300",
    },
    {
      id: "ex2",
      name: "Barbell Squat",
      muscleGroup: "legs",
      difficulty: "intermediate",
      imageUrl: "/src/assets/gif/Intermediate/Barbell Squat.gif?height=200&width=300",
    },
    {
      id: "ex3",
      name: "Deadlift",
      muscleGroup: "back",
      difficulty: "advanced",
      imageUrl: "/src/assets/gif/Advanced/Deadlift.gif?height=200&width=300",
    },
    {
      id: "ex4",
      name: "Dumbbell Bicep Curl",
      muscleGroup: "arms",
      difficulty: "beginner",
      imageUrl: "/src/assets/gif/Beginner/Dumbbell Curl.gif?height=200&width=300",
    },
    {
      id: "ex5",
      name: "Pull-Up",
      muscleGroup: "back",
      difficulty: "beginner",
      imageUrl: "/src/assets/gif/Beginner/Pull-Up.gif?height=200&width=300",
    },
    {
      id: "ex6",
      name: "Push-Up",
      muscleGroup: "chest",
      difficulty: "beginner",
      imageUrl: "/src/assets/gif/Beginner/Push-Up.gif?height=200&width=300",
    },
    {
      id: "ex7",
      name: "Lunges",
      muscleGroup: "legs",
      difficulty: "beginner",
      imageUrl: "/src/assets/gif/Beginner/Lunges.gif?height=200&width=300",
    },
    {
      id: "ex8",
      name: "Plank",
      muscleGroup: "core",
      difficulty: "beginner",
      imageUrl: "/src/assets/gif/Beginner/Plank.gif?height=200&width=300",
    },
    {
      id: "ex9",
      name: "Overhead Press",
      muscleGroup: "shoulders",
      difficulty: "intermediate",
      imageUrl: "/src/assets/gif/Intermediate/Overhead Press.gif?height=200&width=300",
    },
    {
      id: "ex10",
      name: "Bent-Over Row",
      muscleGroup: "back",
      difficulty: "intermediate",
      imageUrl: "/src/assets/gif/Intermediate/Bent-Over Row.gif?height=200&width=300",
    },
    {
      id: "ex11",
      name: "Leg Press",
      muscleGroup: "legs",
      difficulty: "intermediate",
      imageUrl: "/src/assets/gif/Intermediate/Leg Press.gif?height=200&width=300",
    },
    {
      id: "ex12",
      name: "Incline Dumbbell Press",
      muscleGroup: "chest",
      difficulty: "advanced",
      imageUrl: "/src/assets/gif/Advanced/Incline Dumbbell Press.gif?height=200&width=300",
    },
    {
      id: "ex13",
      name: "Snatch",
      muscleGroup: "full body",
      difficulty: "advanced",
      imageUrl: "/src/assets/gif/Advanced/Snatch.gif?height=200&width=300",
    },
    {
      id: "ex14",
      name: "Clean and Jerk",
      muscleGroup: "full body",
      difficulty: "advanced",
      imageUrl: "/src/assets/gif/Advanced/Clean and Jerk.gif?height=200&width=300",
    },
    {
      id: "ex15",
      name: "Front Squat",
      muscleGroup: "legs",
      difficulty: "advanced",
      imageUrl: "/src/assets/gif/Advanced/Front Squat.gif?height=200&width=300",
    },
  ]

  // Update exercise counts in templates
  const updateTemplateExerciseCounts = (workouts, templates) => {
    const updatedTemplates = templates.map((template) => {
      const matchingWorkouts = workouts.filter((workout) => workout.name === template.name)
      const totalExercises = matchingWorkouts.reduce((count, workout) => count + workout.exercises.length, 0)
      return { ...template, exercises: totalExercises }
    })
    localStorage.setItem(`${user?.id || "guest"}-templates`, JSON.stringify(updatedTemplates)) // Updated key
    setWorkoutTemplates(updatedTemplates)
  }

  // FIXED: Save workouts and templates to local storage
  // This function now properly preserves existing workouts
  const saveWorkoutsToStorage = (workoutsToSave) => {
    // Get existing workouts first
    const existingWorkouts = JSON.parse(localStorage.getItem(`${user?.id || "guest"}-workouts`)) || [] // Updated key

    // If we're updating existing workouts, replace them; otherwise add new ones
    const updatedWorkouts = existingWorkouts.map((existingWorkout) => {
      const matchingWorkout = workoutsToSave.find((w) => w.id === existingWorkout.id)
      return matchingWorkout || existingWorkout
    })

    // Add any new workouts that don't exist yet
    workoutsToSave.forEach((workout) => {
      if (!updatedWorkouts.some((w) => w.id === workout.id)) {
        updatedWorkouts.push(workout)
      }
    })

    localStorage.setItem(`${user?.id || "guest"}-workouts`, JSON.stringify(updatedWorkouts)) // Updated key
    const templates = JSON.parse(localStorage.getItem(`${user?.id || "guest"}-templates`)) || [] // Updated key
    updateTemplateExerciseCounts(updatedWorkouts, templates)
    saveExercisesToStorage(updatedWorkouts, templates)

    // Update completed workouts state if we're saving completed workouts
    const completedWorkoutsInStorage = updatedWorkouts.filter((w) => !w.isActive)
    if (completedWorkoutsInStorage.length > 0) {
      // Sort by date (newest first)
      completedWorkoutsInStorage.sort((a, b) => {
        const dateA = new Date(a.id?.split("-")[1] * 1 || 0)
        const dateB = new Date(b.id?.split("-")[1] * 1 || 0)
        return dateB - dateA
      })
      setCompletedWorkouts(completedWorkoutsInStorage)
    }
  }

  const saveTemplatesToStorage = (templates) => {
    localStorage.setItem(`${user?.id || "guest"}-templates`, JSON.stringify(templates)) // Updated key
    const workouts = JSON.parse(localStorage.getItem(`${user?.id || "guest"}-workouts`)) || [] // Updated key
    updateTemplateExerciseCounts(workouts, templates)
    saveExercisesToStorage(workouts, templates)
  }

  // Continue a workout from a template
  const continueWorkout = (templateName) => {
    try {
      const storedTemplates = JSON.parse(localStorage.getItem(`${accountId}-templates`)) || []
      const templateToContinue = storedTemplates.find((t) => t.name === templateName)

      if (templateToContinue) {
        // Ensure exercises is an array
        const safeExercises = Array.isArray(templateToContinue.exercises) ? templateToContinue.exercises : []

        // Merge incomplete exercises from the current workout
        const incompleteExercises =
          currentWorkout?.exercises?.filter((exercise) => !exercise.sets?.every((set) => set.done)) || []

        const newWorkout = {
          id: `workout-${Date.now()}`,
          name: templateToContinue.name,
          exercises: [...incompleteExercises, ...safeExercises],
          isActive: true,
        }

        const storedWorkouts = JSON.parse(localStorage.getItem(`${accountId}-workouts`)) || []
        storedWorkouts.forEach((w) => (w.isActive = false)) // Deactivate other workouts
        storedWorkouts.push(newWorkout)

        saveWorkoutsToStorage(storedWorkouts)
        setCurrentWorkout(newWorkout)
        setHasActiveWorkout(true)
        setActiveTab("workout")
      } else {
        console.error("Template not found in localStorage.")
      }
    } catch (error) {
      console.error("Error continuing workout:", error)
    }
  }

  // Add a new exercise to a template
  const addExerciseToTemplate = (templateId, exercise) => {
    setWorkoutTemplates((prevTemplates) => {
      const updatedTemplates = prevTemplates.map((template) =>
        template.id === templateId
          ? {
              ...template,
              exercises: [...(template.exercises || []), { id: `exercise-${Date.now()}`, ...exercise, sets: [] }],
            }
          : template,
      )
      saveTemplatesToStorage(updatedTemplates)
      return updatedTemplates
    })
  }

  // Remove duplicate templates
  const removeDuplicateTemplates = () => {
    setWorkoutTemplates((prevTemplates) => {
      const uniqueTemplates = prevTemplates.filter(
        (template, index, self) => index === self.findIndex((t) => t.name === template.name),
      )
      localStorage.setItem(`${accountId}-templates`, JSON.stringify(uniqueTemplates))
      return uniqueTemplates
    })
  }

  // Load data from local storage
  useEffect(() => {
    try {
      const storedWorkouts = JSON.parse(localStorage.getItem(`${user?.id || "guest"}-workouts`)) || [] // Updated key
      const storedTemplates = JSON.parse(localStorage.getItem(`${user?.id || "guest"}-templates`)) || initialWorkoutTemplates // Updated key

      // Remove duplicates from templates
      const uniqueTemplates = storedTemplates.filter(
        (template, index, self) => index === self.findIndex((t) => t.name === template.name),
      )
      localStorage.setItem(`${user?.id || "guest"}-templates`, JSON.stringify(uniqueTemplates)) // Updated key

      // Update exercise counts in templates
      updateTemplateExerciseCounts(storedWorkouts, uniqueTemplates)

      setCurrentWorkout(storedWorkouts.find((w) => w.isActive) || null)
      setHasActiveWorkout(!!storedWorkouts.find((w) => w.isActive))
      setWorkoutTemplates(uniqueTemplates)
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
    }
  }, [user?.id]) // Added dependency

  // FIXED: Load completed workouts and exercises from local storage
  // This useEffect now properly loads and sorts completed workouts
  useEffect(() => {
    try {
      const storedWorkouts = JSON.parse(localStorage.getItem(`${accountId}-workouts`)) || []

      // Only include workouts that are not active (i.e., completed)
      const allCompletedWorkouts = storedWorkouts.filter((w) => !w.isActive)

      // Sort by date (newest first)
      allCompletedWorkouts.sort((a, b) => {
        const dateA = new Date(a.id?.split("-")[1] * 1 || 0)
        const dateB = new Date(b.id?.split("-")[1] * 1 || 0)
        return dateB - dateA // Sort in descending order (newest first)
      })

      // Flatten all completed exercises
      const flattenedExercises = allCompletedWorkouts.flatMap((workout) =>
        Array.isArray(workout.exercises)
          ? workout.exercises
              .filter(
                (exercise) => exercise.sets?.some((set) => set.done), // Include only exercises with completed sets
              )
              .map((exercise) => ({
                ...exercise,
                workoutName: workout.name,
                workoutDate: new Date(workout.id?.split("-")[1] * 1 || Date.now()).toLocaleDateString(),
              }))
          : [],
      )

      setCompletedWorkouts(allCompletedWorkouts)
      setCompletedExercises(flattenedExercises)
    } catch (error) {
      console.error("Error loading completed workouts:", error)
    }
  }, [accountId, activeTab]) // Added activeTab dependency to refresh when switching to history tab

  // Save all exercises from workouts and templates to local storage
  const saveExercisesToStorage = (workouts, templates) => {
    const allExercises = [
      ...workouts.reduce((acc, workout) => {
        if (Array.isArray(workout.exercises)) {
          return [...acc, ...workout.exercises]
        }
        return acc
      }, []),
      ...templates.flatMap((template) => template.exercises || []),
    ]
    localStorage.setItem(`${user?.id || "guest"}-exercises`, JSON.stringify(allExercises)) // Updated key
  }

  // Save current workout to local storage whenever it changes
  useEffect(() => {
    if (currentWorkout) {
      const storedWorkouts = JSON.parse(localStorage.getItem(`${accountId}-workouts`)) || []
      const updatedWorkouts = storedWorkouts.map((w) => (w.id === currentWorkout.id ? currentWorkout : w))

      // If the workout is incomplete, ensure all exercises are stored inside it
      if (currentWorkout.isActive) {
        updatedWorkouts.forEach((workout) => {
          if (workout.id === currentWorkout.id && !Array.isArray(workout.exercises)) {
            workout.exercises = []
          }
        })
      }

      // Use the fixed saveWorkoutsToStorage function
      saveWorkoutsToStorage(updatedWorkouts)
    }
  }, [currentWorkout])

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
        }

    const storedWorkouts = JSON.parse(localStorage.getItem(`${accountId}-workouts`)) || []
    storedWorkouts.forEach((w) => (w.isActive = false)) // Deactivate other workouts
    storedWorkouts.push(newWorkout)

    saveWorkoutsToStorage(storedWorkouts)
    setCurrentWorkout(newWorkout)
    setHasActiveWorkout(true)
  }

  // FIXED: Complete the current workout and save to local storage
  // This function now properly updates and sorts the stored workouts
  const completeWorkout = () => {
    if (!currentWorkout) return

    const updatedWorkout = { ...currentWorkout, isActive: false }
    const storedWorkouts = JSON.parse(localStorage.getItem(`${accountId}-workouts`)) || []

    // Update the workout in the stored workouts
    const updatedWorkouts = storedWorkouts.map((w) => (w.id === updatedWorkout.id ? updatedWorkout : w))

    // Save all workouts to storage
    saveWorkoutsToStorage(updatedWorkouts)

    // Update completed workouts in real-time
    const completed = updatedWorkouts.filter((w) => !w.isActive)

    // Sort by date (newest first)
    completed.sort((a, b) => {
      const dateA = new Date(a.id?.split("-")[1] * 1 || 0)
      const dateB = new Date(b.id?.split("-")[1] * 1 || 0)
      return dateB - dateA
    })

    setCompletedWorkouts(completed)

    // Update completed exercises
    const flattenedExercises = completed.flatMap((workout) =>
      Array.isArray(workout.exercises)
        ? workout.exercises
            .filter((exercise) => exercise.sets?.some((set) => set.done))
            .map((exercise) => ({
              ...exercise,
              workoutName: workout.name,
              workoutDate: new Date(workout.id.split("-")[1] * 1).toLocaleDateString(),
            }))
        : [],
    )
    setCompletedExercises(flattenedExercises)

    setCurrentWorkout(null)
    setHasActiveWorkout(false)
  }

  // Add a new template
  const addTemplate = (template) => {
    const newTemplates = [...workoutTemplates, template]
    setWorkoutTemplates(newTemplates)
    saveTemplatesToStorage(newTemplates)
  }

  // Add a new exercise to the current workout and save to local storage
  const addExerciseToWorkout = (exercise) => {
    if (!currentWorkout) return

    setCurrentWorkout((prevWorkout) => {
      const updatedWorkout = {
        ...prevWorkout,
        exercises: [
          ...(prevWorkout.exercises || []),
          {
            id: `exercise-${Date.now()}`,
            name: exercise.name,
            muscleGroup: exercise.muscleGroup,
            difficulty: exercise.difficulty,
            sets: [],
          },
        ],
      }

      // Use the fixed saveWorkoutsToStorage function with the full array
      const storedWorkouts = JSON.parse(localStorage.getItem(`${accountId}-workouts`)) || []
      const updatedWorkouts = storedWorkouts.map((w) => (w.id === updatedWorkout.id ? updatedWorkout : w))
      saveWorkoutsToStorage(updatedWorkouts)

      return updatedWorkout
    })
  }

  // Open the modal to add a new exercise
  const openAddExerciseModal = () => {
    setNewExercise({ name: "", muscleGroup: "", difficulty: "" })
    setIsModalOpen(true)
  }

  // Handle adding a new exercise and save to local storage
  const handleAddExercise = () => {
    if (!newExercise.name || !newExercise.muscleGroup || !newExercise.difficulty) {
      alert("Please fill out all fields.")
      return
    }

    setCurrentWorkout((prevWorkout) => {
      const updatedWorkout = {
        ...prevWorkout,
        exercises: [
          ...(prevWorkout.exercises || []),
          {
            id: `exercise-${Date.now()}`,
            ...newExercise,
            sets: [{ weight: "", reps: "", done: false }],
          },
        ],
      }

      // Use the fixed saveWorkoutsToStorage function with the full array
      const storedWorkouts = JSON.parse(localStorage.getItem(`${accountId}-workouts`)) || []
      const updatedWorkouts = storedWorkouts.map((w) => (w.id === updatedWorkout.id ? updatedWorkout : w))
      saveWorkoutsToStorage(updatedWorkouts)

      return updatedWorkout
    })
    setIsModalOpen(false)
  }

  // Update an existing exercise in the current workout and save to local storage
  const updateExerciseInWorkout = (exerciseId, updatedExercise) => {
    setCurrentWorkout((prevWorkout) => {
      const updatedWorkout = {
        ...prevWorkout,
        exercises: prevWorkout.exercises.map((exercise) =>
          exercise.id === exerciseId ? { ...exercise, ...updatedExercise } : exercise,
        ),
      }

      // Use the fixed saveWorkoutsToStorage function with the full array
      const storedWorkouts = JSON.parse(localStorage.getItem(`${accountId}-workouts`)) || []
      const updatedWorkouts = storedWorkouts.map((w) => (w.id === updatedWorkout.id ? updatedWorkout : w))
      saveWorkoutsToStorage(updatedWorkouts)

      return updatedWorkout
    })
  }

  // Delete an exercise from the current workout and save to local storage
  const deleteExerciseFromWorkout = (exerciseId) => {
    setCurrentWorkout((prevWorkout) => {
      const updatedWorkout = {
        ...prevWorkout,
        exercises: prevWorkout.exercises.filter((exercise) => exercise.id !== exerciseId),
      }

      // Use the fixed saveWorkoutsToStorage function with the full array
      const storedWorkouts = JSON.parse(localStorage.getItem(`${accountId}-workouts`)) || []
      const updatedWorkouts = storedWorkouts.map((w) => (w.id === updatedWorkout.id ? updatedWorkout : w))
      saveWorkoutsToStorage(updatedWorkouts)

      return updatedWorkout
    })
  }

  // Start or reset the rest timer
  const startRestTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current) // Clear any existing timer
    setRemainingTime(restTime)
    setIsResting(true)

    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          setIsResting(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Cleanup the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // Calculate workout progress
  const calculateProgress = () => {
    if (!currentWorkout || !Array.isArray(currentWorkout.exercises) || currentWorkout.exercises.length === 0) {
      return 0 // Return 0 if no exercises or invalid data
    }
    const totalSets = currentWorkout.exercises.reduce((sum, ex) => sum + (ex.sets?.length || 0), 0)
    const completedSets = currentWorkout.exercises.reduce(
      (sum, ex) => sum + (ex.sets?.filter((set) => set.done).length || 0),
      0,
    )
    return totalSets === 0 ? 0 : Math.round((completedSets / totalSets) * 100)
  }

  // Ensure exercises is always an array before rendering
  const safeWorkoutTemplates = workoutTemplates.map((template) => ({
    ...template,
    exercises: Array.isArray(template.exercises) ? template.exercises : [],
  }))

  // Ensure exercises is always an array before rendering
  const safeCurrentWorkout = currentWorkout
    ? {
        ...currentWorkout,
        exercises: Array.isArray(currentWorkout?.exercises) ? currentWorkout.exercises : [],
      }
    : null

  // Function to handle adding an exercise from the Exercises tab
  const handleAddExerciseFromTab = (exercise) => {
    if (!currentWorkout) {
      startNewWorkout() // Start a new workout if none exists
      // We need to wait for the state to update before adding the exercise
      setTimeout(() => {
        addExerciseToWorkout(exercise)
      }, 100)
    } else {
      addExerciseToWorkout(exercise)
    }
  }

  // Function to calculate workout calories
  const calculateWorkoutCalories = (workout) => {
    if (!workout || !Array.isArray(workout.exercises)) {
      return 0
    }
    return workout.exercises.reduce((total, exercise) => {
      if (exercise.sets && Array.isArray(exercise.sets)) {
        return (
          total +
          exercise.sets.reduce((exerciseTotal, set) => {
            if (set.done) {
              const weight = Number.parseFloat(set.weight) || 0
              const reps = Number.parseInt(set.reps) || 0
              return exerciseTotal + Math.round(0.5 * weight * reps)
            }
            return exerciseTotal
          }, 0)
        )
      }
      return total
    }, 0)
  }

  useEffect(() => {
    // Ensure user data is stored in localStorage
    const storedUserID = localStorage.getItem("userID") || user?.id || "guest";
    const storedMemberRole = localStorage.getItem("memberRole") || "MEMBER";
    const storedToken = localStorage.getItem("token") || "example-token";

    localStorage.setItem("userID", storedUserID);
    localStorage.setItem("memberRole", storedMemberRole);
    localStorage.setItem("token", storedToken);
  }, [user?.id]);

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
                    setActiveTab("workout")
                  } else if (activeTab === "history") {
                    setActiveTab("exercises")
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
                  activeTab === "workout" ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => {
                  setActiveTab("workout")
                  setHasActiveWorkout(!!currentWorkout) // Set based on current workout state
                }}
              >
                Current Workout
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                  activeTab === "exercises" ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("exercises")}
              >
                Exercises
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                  activeTab === "history" ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700"
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
              {hasActiveWorkout && safeCurrentWorkout ? (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold">{safeCurrentWorkout.name}</h2>
                      <p className="text-gray-500">
                        {new Date().toLocaleDateString()} • {safeCurrentWorkout.exercises.length} exercises
                      </p>
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

                  {/* Workout Progress and Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-1 md:col-span-2 space-y-2">
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
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col items-center justify-center">
                      <div className="flex items-center gap-2">
                        <FlameIcon className="h-5 w-5 text-orange-500" />
                        <span className="text-lg font-bold">
                          {calculateWorkoutCalories(safeCurrentWorkout)} calories
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Estimated burn</p>
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
                                setRestTime(time)
                                setRemainingTime(time)
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
                    {safeCurrentWorkout.exercises.map((exercise) => (
                      <div key={exercise.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3
                                className="font-medium"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => updateExerciseInWorkout(exercise.id, { name: e.target.textContent })}
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
                                {/* Show calories for this exercise */}
                                {exercise.sets?.some((set) => set.done) && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                    <FlameIcon className="h-3 w-3" />
                                    {exercise.sets?.reduce((total, set) => {
                                      if (set.done) {
                                        const weight = Number.parseFloat(set.weight) || 0
                                        const reps = Number.parseInt(set.reps) || 0
                                        return total + Math.round(0.5 * weight * reps)
                                      }
                                      return total
                                    }, 0) || 0}{" "}
                                    cal
                                  </span>
                                )}
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
                                          i === index ? { ...s, weight: e.target.value } : s,
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
                                          i === index ? { ...s, reps: e.target.value } : s,
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
                                          i === index ? { ...s, done: e.target.checked } : s,
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
                      {safeWorkoutTemplates.map((template) => (
                        <div
                          key={template.id}
                          className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">{template.name}</h3>
                          </div>
                          <div className="p-4 border-t border-gray-200">
                            <button
                              className={`w-full py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                                currentWorkout?.name === template.name
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : "bg-green-600 text-white hover:bg-green-700"
                              }`}
                              onClick={() =>
                                currentWorkout?.name === template.name
                                  ? continueWorkout(template.name)
                                  : startNewWorkout(template.id)
                              }
                            >
                              {currentWorkout?.name === template.name ? "Continue" : "Use Template"}
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
                      <span>{selectedDifficulty === "all" ? "All Difficulties" : selectedDifficulty}</span>
                      <ChevronDownIcon className="h-4 w-4" />
                    </button>
                    {isSelectOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                        <div className="py-1">
                          {["all", "Beginner", "Intermediate", "Advanced"].map((difficulty) => (
                            <button
                              key={difficulty}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                              onClick={() => {
                                setSelectedDifficulty(difficulty)
                                setIsSelectOpen(false)
                              }}
                            >
                              {difficulty === "all" ? "All Difficulties" : difficulty}
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
                {exerciseData
                  .filter((exercise) => selectedDifficulty === "all" || exercise.difficulty === selectedDifficulty.toLowerCase())
                  .map((exercise) => {
                    // Check if this exercise is in any completed workouts
                    const isCompleted = completedExercises.some(
                      (ex) => ex.name.toLowerCase() === exercise.name.toLowerCase() && ex.sets?.some((set) => set.done),
                    )

                    // Check if this exercise is in the current workout
                    const isInCurrentWorkout = currentWorkout?.exercises?.some(
                      (ex) => ex.name.toLowerCase() === exercise.name.toLowerCase(),
                    )

                    return (
                      <div key={exercise.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex justify-between items-start">
                            <div>
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
                            {isCompleted && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Completed
                              </span>
                            )}
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
                          <button className="text-sm px-3 py-1 hover:bg-gray-100 rounded-md">View Details</button>
                          <button
                            className={`flex items-center gap-2 px-3 py-1 ${
                              isInCurrentWorkout ? "bg-gray-500 hover:bg-gray-600" : "bg-green-600 hover:bg-green-700"
                            } text-white rounded-md`}
                            onClick={() => handleAddExerciseFromTab(exercise)}
                            disabled={isInCurrentWorkout}
                          >
                            <PlusIcon className="h-4 w-4" />
                            <span>{isInCurrentWorkout ? "Added" : "Add"}</span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Workout History</h2>
                {/* Removed "View Stats" button */}
              </div>

              {/* Summary Stats Section */}
              {completedWorkouts.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
                  <h3 className="font-medium text-lg mb-4">Summary Stats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <span className="block text-2xl font-bold text-gray-800">{completedWorkouts.length}</span>
                      <span className="text-sm text-gray-500">Total Workouts</span>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <span className="block text-2xl font-bold text-gray-800">
                        {completedExercises.reduce((total, ex) => {
                          return total + (ex.sets?.filter((set) => set.done).length || 0)
                        }, 0)}
                      </span>
                      <span className="text-sm text-gray-500">Total Sets</span>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <span className="block text-2xl font-bold text-orange-500">
                        {completedExercises.reduce((total, ex) => {
                          return (
                            total +
                            (ex.sets?.reduce((setTotal, set) => {
                              if (set.done) {
                                const weight = Number.parseFloat(set.weight) || 0
                                const reps = Number.parseInt(set.reps) || 0
                                return setTotal + Math.round(0.5 * weight * reps)
                              }
                              return setTotal
                            }, 0) || 0)
                          )
                        }, 0)}
                      </span>
                      <span className="text-sm text-gray-500">Calories Burned</span>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {Array.from(new Set(completedExercises.map((ex) => ex.muscleGroup))).map((group, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800"
                          >
                            {group}
                          </span>
                        ))}
                      </div>
                      <span className="block text-center text-sm text-gray-500 mt-1">Muscle Groups</span>
                    </div>
                  </div>
                </div>
              )}

              {completedWorkouts.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-medium text-lg">All Completed Workouts</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {/* Sort workouts by date (newest first) */}
                    {completedWorkouts
                      .sort((a, b) => {
                        const dateA = new Date(a.id?.split("-")[1] * 1 || 0)
                        const dateB = new Date(b.id?.split("-")[1] * 1 || 0)
                        return dateB - dateA // Sort in descending order (newest first)
                      })
                      .map((workout, index) => {
                        // Calculate total calories for this workout
                        const workoutCalories = Array.isArray(workout.exercises)
                          ? workout.exercises.reduce((total, ex) => {
                              if (ex.sets && Array.isArray(ex.sets)) {
                                return (
                                  total +
                                  ex.sets.reduce((exTotal, set) => {
                                    if (set.done) {
                                      const weight = Number.parseFloat(set.weight) || 0
                                      const reps = Number.parseInt(set.reps) || 0
                                      return exTotal + Math.round(0.5 * weight * reps)
                                    }
                                    return exTotal
                                  }, 0)
                                )
                              }
                              return total
                            }, 0)
                          : 0

                        return (
                          <div key={index} className="p-4">
                            <div className="flex flex-col">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-lg">{workout.name}</h4>
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                    <FlameIcon className="h-3 w-3 mr-1" />
                                    {workoutCalories} cal
                                  </span>
                                </div>
                                <span className="text-sm text-gray-500">
                                  {new Date(workout.id?.split("-")[1] * 1 || Date.now()).toLocaleDateString()}
                                </span>
                              </div>

                              {Array.isArray(workout.exercises) && workout.exercises.length > 0 ? (
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-600 font-medium">Exercises:</p>
                                    <span className="text-xs text-gray-500">
                                      {workout.exercises.filter((ex) => ex.sets?.some((set) => set.done)).length}{" "}
                                      completed exercises
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {workout.exercises
                                      .filter((exercise) => exercise.sets?.some((set) => set.done))
                                      .map((exercise, exIndex) => {
                                        // Calculate calories for this exercise
                                        const exerciseCalories =
                                          exercise.sets?.reduce((total, set) => {
                                            if (set.done) {
                                              const weight = Number.parseFloat(set.weight) || 0
                                              const reps = Number.parseInt(set.reps) || 0
                                              return total + Math.round(0.5 * weight * reps)
                                            }
                                            return total
                                          }, 0) || 0

                                        return (
                                          <div key={exIndex} className="flex flex-col bg-gray-50 p-3 rounded">
                                            <div className="flex items-center justify-between">
                                              <span className="font-medium">{exercise.name}</span>
                                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Completed
                                              </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {exercise.muscleGroup}
                                              </span>
                                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {exercise.sets?.filter((set) => set.done).length} sets
                                              </span>
                                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                <FlameIcon className="h-3 w-3 mr-1" />
                                                {exerciseCalories} cal
                                              </span>
                                            </div>

                                            {/* Show set details in a collapsible section */}
                                            {exercise.sets?.filter((set) => set.done).length > 0 && (
                                              <div className="mt-2 text-xs text-gray-600">
                                                <div className="grid grid-cols-3 gap-1 font-medium">
                                                  <div>Set</div>
                                                  <div>Weight</div>
                                                  <div>Reps</div>
                                                </div>
                                                {exercise.sets
                                                  .filter((set) => set.done)
                                                  .map((set, setIndex) => (
                                                    <div key={setIndex} className="grid grid-cols-3 gap-1">
                                                      <div>{setIndex + 1}</div>
                                                      <div>{set.weight} kg</div>
                                                      <div>{set.reps}</div>
                                                    </div>
                                                  ))}
                                              </div>
                                            )}
                                          </div>
                                        )
                                      })}
                                  </div>
                                </div>
                              ) : (
                                <p className="mt-2 text-sm text-gray-500">No exercises recorded</p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <DumbbellIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-xl font-medium">No Completed Workouts</h3>
                  <p className="mt-2 text-gray-500">Complete a workout to see it here.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </DashboardSimple>
  )
}