import { useState, useEffect, useRef } from "react"
import DashboardSimple from "/src/Components/DashboardSimple"
// Self-contained Cardio Workout page with no external dependencies
function CardioWorkout() {
  // Updated cardio exercises data with intensity-specific workouts
  const exercises = [
    // Low Intensity Workouts
    {
      name: "Walking in Place",
      duration: 60,
      description: "Walk in place at a comfortable pace.",
      caloriesPerMinute: { low: 5, medium: 0, high: 0 },
      intensity: "low",
      id: "low-1",
    },
    {
      name: "Side Steps",
      duration: 60,
      description: "Step side-to-side while swinging your arms.",
      caloriesPerMinute: { low: 6, medium: 0, high: 0 },
      intensity: "low",
      id: "low-2",
    },
    {
      name: "Arm Circles",
      duration: 45,
      description: "Extend your arms and make small circles.",
      caloriesPerMinute: { low: 4, medium: 0, high: 0 },
      intensity: "low",
      id: "low-3",
    },
    {
      name: "Seated March",
      duration: 60,
      description: "Sit on a chair and march your legs up and down.",
      caloriesPerMinute: { low: 3, medium: 0, high: 0 },
      intensity: "low",
      id: "low-4",
    },
    {
      name: "Toe Taps",
      duration: 45,
      description: "Tap your toes on the ground alternately.",
      caloriesPerMinute: { low: 5, medium: 0, high: 0 },
      intensity: "low",
      id: "low-5",
    },

    // Medium Intensity Workouts
    {
      name: "Jumping Jacks",
      duration: 60,
      description:
        "Stand with your feet together and arms at your sides, then jump to a position with legs spread and arms overhead.",
      caloriesPerMinute: { low: 0, medium: 10, high: 0 },
      intensity: "medium",
      id: "medium-1",
    },
    {
      name: "High Knees",
      duration: 45,
      description: "Run in place, lifting your knees as high as possible with each step.",
      caloriesPerMinute: { low: 0, medium: 13, high: 0 },
      intensity: "medium",
      id: "medium-2",
    },
    {
      name: "Mountain Climbers",
      duration: 45,
      description: "Start in a plank position and alternate driving your knees toward your chest.",
      caloriesPerMinute: { low: 0, medium: 12, high: 0 },
      intensity: "medium",
      id: "medium-3",
    },
    {
      name: "Step-Ups",
      duration: 60,
      description: "Step up and down on a sturdy platform or step.",
      caloriesPerMinute: { low: 0, medium: 11, high: 0 },
      intensity: "medium",
      id: "medium-4",
    },
    {
      name: "Butt Kicks",
      duration: 45,
      description: "Run in place, kicking your heels toward your glutes.",
      caloriesPerMinute: { low: 0, medium: 12, high: 0 },
      intensity: "medium",
      id: "medium-5",
    },

    // High Intensity Workouts
    {
      name: "Burpees",
      duration: 30,
      description:
        "Begin in a standing position, move into a squat position, kick feet back, return to squat, and jump up.",
      caloriesPerMinute: { low: 0, medium: 0, high: 18 },
      intensity: "high",
      id: "high-1",
    },
    {
      name: "Jump Rope",
      duration: 60,
      description: "Jump over an imaginary or real rope swinging beneath your feet and over your head.",
      caloriesPerMinute: { low: 0, medium: 0, high: 17 },
      intensity: "high",
      id: "high-2",
    },
    {
      name: "Squat Jumps",
      duration: 45,
      description: "Perform a squat and jump explosively upward.",
      caloriesPerMinute: { low: 0, medium: 0, high: 16 },
      intensity: "high",
      id: "high-3",
    },
    {
      name: "Lunge Jumps",
      duration: 45,
      description: "Perform alternating lunges with a jump in between.",
      caloriesPerMinute: { low: 0, medium: 0, high: 15 },
      intensity: "high",
      id: "high-4",
    },
    {
      name: "Sprint in Place",
      duration: 30,
      description: "Run in place as fast as you can.",
      caloriesPerMinute: { low: 0, medium: 0, high: 20 },
      intensity: "high",
      id: "high-5",
    },
  ]

  // Replace this with your actual user ID logic
  const userID = localStorage.getItem("userID") || "defaultUser";

  // Helper to get initial state from localStorage
  const getInitialStats = () => {
    try {
      const savedStats = localStorage.getItem(`cardioWorkoutStats_${userID}`)
      if (savedStats) {
        return JSON.parse(savedStats)
      }
    } catch {}
    return {}
  }
  const initialStats = getInitialStats()

  // State management using React hooks, initialized from localStorage if available
  const [isActive, setIsActive] = useState(initialStats.isActive || false)
  const [time, setTime] = useState(initialStats.time || 0)
  const [intensity, setIntensity] = useState(initialStats.intensity || "low")
  const [currentExercise, setCurrentExercise] = useState(initialStats.currentExercise || 0)
  const [caloriesBurned, setCaloriesBurned] = useState(initialStats.caloriesBurned || 0)
  const [workoutComplete, setWorkoutComplete] = useState(initialStats.workoutComplete || false)
  const [heartRate, setHeartRate] = useState(initialStats.heartRate || 75)
  const [activeTab, setActiveTab] = useState(initialStats.activeTab || "instructions")
  const [showSelectContent, setShowSelectContent] = useState(initialStats.showSelectContent || false)
  const [exerciseCountdown, setExerciseCountdown] = useState(initialStats.exerciseCountdown || 0)
  const [completedExercises, setCompletedExercises] = useState(initialStats.completedExercises || [])
  const [totalWorkouts, setTotalWorkouts] = useState(initialStats.totalWorkouts || 0)
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(initialStats.totalCaloriesBurned || 0)
  const [totalTime, setTotalTime] = useState(initialStats.totalTime || 0)

  // Filter exercises based on the selected intensity
  const filteredExercises = exercises.filter((exercise) => exercise.intensity === intensity)

  // Refs for interval and latest state
  const intervalRef = useRef(null)
  const currentExerciseRef = useRef(currentExercise)
  const intensityRef = useRef(intensity)
  const filteredExercisesRef = useRef(filteredExercises)
  const workoutCompleteRef = useRef(workoutComplete)
  const completedExercisesRef = useRef(completedExercises) // add this ref

  // Keep refs up to date
  useEffect(() => {
    currentExerciseRef.current = currentExercise
  }, [currentExercise])
  useEffect(() => {
    intensityRef.current = intensity
  }, [intensity])
  useEffect(() => {
    filteredExercisesRef.current = filteredExercises
  }, [filteredExercises])
  useEffect(() => {
    workoutCompleteRef.current = workoutComplete
  }, [workoutComplete])
  useEffect(() => {
    completedExercisesRef.current = completedExercises
  }, [completedExercises]) // keep ref up to date

  // Save total completed Cardio workouts
  const saveCardioTotalWorkouts = () => {
    localStorage.setItem(`cardioTotalWorkouts_${userID}`, totalWorkouts + 1);
  };

  // Handle exercise completion
  const completeExercise = () => {
    // Add current exercise to completed exercises if not already there
    const currentExerciseId = filteredExercises[currentExercise].id
    if (!completedExercises.includes(currentExerciseId)) {
      setCompletedExercises([...completedExercises, currentExerciseId])
    }

    if (currentExercise < filteredExercises.length - 1) {
      // Move to next exercise
      setCurrentExercise(currentExercise + 1)
      setExerciseCountdown(filteredExercises[currentExercise + 1].duration)
    } else {
      // Complete workout
      setWorkoutComplete(true)
      setIsActive(false)
      setTotalWorkouts((prev) => {
        const newTotal = prev + 1;
        localStorage.setItem(`cardioTotalWorkouts_${userID}`, newTotal);
        return newTotal;
      });
    }
  }

  // Save data to localStorage whenever relevant stats change
  useEffect(() => {
    try {
      const statsToSave = {
        caloriesBurned,
        heartRate,
        intensity,
        currentExercise,
        completedExercises,
        totalWorkouts,
        totalCaloriesBurned,
        totalTime,
        isActive,
        showSelectContent,
        activeTab,
        exerciseCountdown,
      }
      localStorage.setItem(`cardioWorkoutStats_${userID}`, JSON.stringify(statsToSave))
    } catch (error) {
      console.error("Error saving workout data:", error)
    }
  }, [
    caloriesBurned,
    heartRate,
    intensity,
    currentExercise,
    completedExercises,
    totalWorkouts,
    totalCaloriesBurned,
    totalTime,
    isActive,
    showSelectContent,
    activeTab,
    exerciseCountdown,
    userID,
  ])

  // Initialize countdown on first load
  useEffect(() => {
    if (filteredExercises.length > 0 && exerciseCountdown === 0) {
      setExerciseCountdown(filteredExercises[0].duration)
    }
  }, [])

  // Timer functionality (fixed)
  useEffect(() => {
    if (isActive && !workoutComplete) {
      // Clear any existing interval first
      if (intervalRef.current) clearInterval(intervalRef.current)

      // Set up a new interval
      intervalRef.current = setInterval(() => {
        // Update exercise countdown
        setExerciseCountdown((prevTime) => {
          if (prevTime <= 1) {
            // Exercise is complete
            const exercisesArr = filteredExercisesRef.current
            const idx = currentExerciseRef.current

            // Use ref for completedExercises to avoid stale closure
            const currentExerciseId = exercisesArr[idx].id
            if (!completedExercisesRef.current.includes(currentExerciseId)) {
              setCompletedExercises((prev) => [...prev, currentExerciseId])
            }

            // Move to next exercise or complete workout
            if (idx < exercisesArr.length - 1) {
              setCurrentExercise(idx + 1)
              return exercisesArr[idx + 1].duration // Return the duration of the next exercise
            } else {
              // Workout complete
              setWorkoutComplete(true)
              setIsActive(false)
              setTotalWorkouts((prev) => prev + 1)
              clearInterval(intervalRef.current)
              return 0
            }
          }
          return prevTime - 1
        })

        // Update total workout time
        setTime((prevTime) => prevTime + 1)
        setTotalTime((prevTime) => prevTime + 1)

        // Update calories burned based on current exercise and intensity
        const idx = currentExerciseRef.current
        const exercisesArr = filteredExercisesRef.current
        const intensityVal = intensityRef.current
        if (idx < exercisesArr.length) {
          const exercise = exercisesArr[idx]
          const caloriesPerSecond = exercise.caloriesPerMinute[intensityVal] / 60
          setCaloriesBurned((prev) => Math.round((prev + caloriesPerSecond) * 10) / 10)
          setTotalCaloriesBurned((prev) => Math.round((prev + caloriesPerSecond) * 10) / 10)
        }

        // Simulate heart rate changes
        setHeartRate((prev) => {
          const intensityVal = intensityRef.current
          const intensityFactor = intensityVal === "low" ? 1 : intensityVal === "medium" ? 1.5 : 2
          const randomChange = Math.random() * 3 - 1
          const newRate = prev + randomChange * intensityFactor
          return Math.min(Math.max(Math.round(newRate), 70), 180)
        })
      }, 1000)
    } else {
      // Clear interval when not active
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  // Add filteredExercises to dependencies
  }, [isActive, workoutComplete, filteredExercises])

  // Format time to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const secs = (seconds % 60).toString().padStart(2, "0")
    return `${mins}:${secs}`
  }

  // Format time for display in hours:minutes format
  const formatTotalTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  // Reset workout without resetting overall stats
  const resetWorkout = () => {
    setIsActive(false)
    setCurrentExercise(0)
    if (filteredExercises.length > 0) {
      setExerciseCountdown(filteredExercises[0].duration)
    }
    setWorkoutComplete(false)
  }

  // Change intensity level without resetting overall stats
  const handleIntensityChange = (newIntensity) => {
    setIntensity(newIntensity)
    setCurrentExercise(0)
    setShowSelectContent(false)

    // Reset exercise countdown for the first exercise of the new intensity
    const newExercises = exercises.filter((exercise) => exercise.intensity === newIntensity)
    if (newExercises.length > 0) {
      setExerciseCountdown(newExercises[0].duration)
    }
  }

  // Calculate overall progress
  const getOverallProgress = () => {
    const totalExercises = exercises.filter((ex) => ex.intensity === intensity).length
    const completedCount = completedExercises.filter((id) => id.startsWith(intensity)).length
    return (completedCount / totalExercises) * 100
  }

  // Icon components
  const ClockIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  )

  const PlayIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  )

  const PauseIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="6" y="4" width="4" height="16"></rect>
      <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
  )

  const ResetIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path>
    </svg>
  )

  const CheckCircleIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  )

  const HeartIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
    </svg>
  )

  const FlameIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
    </svg>
  )

  const ChevronDownIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  )

  const TrophyIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
      <path d="M4 22h16"></path>
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
    </svg>
  )

  return (
    <DashboardSimple>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #f8fafc, #f1f5f9)",
          padding: "1rem",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
          <header style={{ marginBottom: "2rem", textAlign: "center" }}>
            <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Cardio Workout</h1>
            <p style={{ color: "#64748b" }}>
              Boost your heart rate and burn calories with this effective cardio routine
            </p>
          </header>

          {/* Stats Summary */}
          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "0.5rem",
              overflow: "hidden",
              background: "white",
              padding: "1rem",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ textAlign: "center", padding: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.5rem", color: "#ef4444" }}>
                <FlameIcon />
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{totalCaloriesBurned.toFixed(1)}</div>
              <div style={{ fontSize: "0.875rem", color: "#64748b" }}>Total Calories Burned</div>
            </div>

            <div style={{ textAlign: "center", padding: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.5rem", color: "#3b82f6" }}>
                <ClockIcon />
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{formatTotalTime(totalTime)}</div>
              <div style={{ fontSize: "0.875rem", color: "#64748b" }}>Total Workout Time</div>
            </div>

            <div style={{ textAlign: "center", padding: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.5rem", color: "#10b981" }}>
                <TrophyIcon />
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{totalWorkouts}</div>
              <div style={{ fontSize: "0.875rem", color: "#64748b" }}>Completed Workouts</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
            {/* Left Column - Timer and Controls */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: "1.5rem",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Timer Card */}
                <div
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    background: "white",
                  }}
                >
                  <div style={{ padding: "1rem", borderBottom: "1px solid #f1f5f9" }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", display: "flex", alignItems: "center" }}>
                      <span style={{ marginRight: "0.5rem" }}>
                        <ClockIcon />
                      </span>
                      Workout Timer
                    </h2>
                  </div>
                  <div style={{ padding: "1.5rem", textAlign: "center" }}>
                    <div style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
                      {formatTime(exerciseCountdown)}
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                      <button
                        onClick={() => setIsActive(!isActive)}
                        disabled={workoutComplete}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "0.375rem",
                          padding: "0.5rem",
                          border: isActive ? "1px solid #e2e8f0" : "none",
                          background: isActive ? "transparent" : "#2563eb",
                          color: isActive ? "inherit" : "white",
                          cursor: workoutComplete ? "not-allowed" : "pointer",
                          opacity: workoutComplete ? 0.5 : 1,
                        }}
                      >
                        {isActive ? <PauseIcon /> : <PlayIcon />}
                      </button>
                      <button
                        onClick={resetWorkout}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "0.375rem",
                          padding: "0.5rem",
                          border: "1px solid #e2e8f0",
                          background: "transparent",
                          cursor: "pointer",
                        }}
                      >
                        <ResetIcon />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Intensity Level Card */}
                <div
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    background: "white",
                    transition: "all 0.3s ease", // Smooth transition for height changes
                    ...(showSelectContent && { height: "auto", paddingBottom: "8rem" }), // Expand card when dropdown is open
                  }}
                >
                  <div style={{ padding: "1rem", borderBottom: "1px solid #f1f5f9" }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Intensity Level</h2>
                    <p style={{ fontSize: "0.875rem", color: "#64748b" }}>Adjust based on your fitness level</p>
                  </div>
                  <div style={{ padding: "1rem" }}>
                    <div style={{ position: "relative" }}>
                      <button
                        onClick={() => setShowSelectContent(!showSelectContent)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          padding: "0.5rem 1rem",
                          border: "1px solid #e2e8f0",
                          borderRadius: "0.375rem",
                          background: "white",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          color: "#374151",
                          fontWeight: "500",
                          ...(showSelectContent && { borderBottomLeftRadius: "0", borderBottomRightRadius: "0" }),
                        }}
                      >
                        <span style={{ textTransform: "capitalize" }}>
                          {intensity === "low"
                            ? "Low Intensity"
                            : intensity === "medium"
                              ? "Medium Intensity"
                              : "High Intensity"}
                        </span>
                        <ChevronDownIcon />
                      </button>

                      {showSelectContent && (
                        <div
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            minWidth: "100%",
                            border: "1px solid #e2e8f0",
                            borderRadius: "0 0 0.375rem 0.375rem",
                            background: "white",
                            marginTop: "0.25rem",
                            zIndex: 10,
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            onClick={() => handleIntensityChange("low")}
                            style={{
                              padding: "0.5rem 1rem",
                              cursor: "pointer",
                              backgroundColor: intensity === "low" ? "#f8fafc" : "transparent",
                            }}
                          >
                            Low Intensity
                          </div>
                          <div
                            onClick={() => handleIntensityChange("medium")}
                            style={{
                              padding: "0.5rem 1rem",
                              cursor: "pointer",
                              backgroundColor: intensity === "medium" ? "#f8fafc" : "transparent",
                            }}
                          >
                            Medium Intensity
                          </div>
                          <div
                            onClick={() => handleIntensityChange("high")}
                            style={{
                              padding: "0.5rem 1rem",
                              cursor: "pointer",
                              backgroundColor: intensity === "high" ? "#f8fafc" : "transparent",
                            }}
                          >
                            High Intensity
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Workout Stats Card */}
                <div
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    background: "white",
                  }}
                >
                  <div style={{ padding: "1rem", borderBottom: "1px solid #f1f5f9" }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", display: "flex", alignItems: "center" }}>
                      <span style={{ marginRight: "0.5rem", color: "#ef4444" }}>
                        <FlameIcon />
                      </span>
                      Workout Stats
                    </h2>
                  </div>
                  <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.875rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        <span>Calories Burned</span>
                        <span style={{ fontWeight: "500" }}>{caloriesBurned.toFixed(1)} kcal</span>
                      </div>
                      <div
                        style={{ height: "0.5rem", background: "#e2e8f0", borderRadius: "9999px", overflow: "hidden" }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${Math.min(caloriesBurned / 2, 100)}%`,
                            background: "#2563eb",
                            borderRadius: "9999px",
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.875rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center" }}>
                          <span style={{ marginRight: "0.25rem", color: "#ef4444" }}>
                            <HeartIcon />
                          </span>
                          Heart Rate
                        </span>
                        <span style={{ fontWeight: "500" }}>{heartRate} BPM</span>
                      </div>
                      <div
                        style={{ height: "0.5rem", background: "#e2e8f0", borderRadius: "9999px", overflow: "hidden" }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${(heartRate - 60) / 1.2}%`,
                            background: "#2563eb",
                            borderRadius: "9999px",
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.875rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        <span>Overall Progress</span>
                        <span style={{ fontWeight: "500" }}>{Math.round(getOverallProgress())}%</span>
                      </div>
                      <div
                        style={{ height: "0.5rem", background: "#e2e8f0", borderRadius: "9999px", overflow: "hidden" }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${getOverallProgress()}%`,
                            background: "#2563eb",
                            borderRadius: "9999px",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Exercises */}
              <div
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                  background: "white",
                  height: "fit-content",
                }}
              >
                <div style={{ padding: "1rem", borderBottom: "1px solid #f1f5f9" }}>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Cardio Exercises</h2>
                  <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
                    Complete each exercise and click "Next" to continue
                  </p>
                </div>
                <div style={{ padding: "1rem" }}>
                  {workoutComplete ? (
                    <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                      <div style={{ color: "#22c55e", margin: "0 auto 1rem auto", width: "4rem", height: "4rem" }}>
                        <CheckCircleIcon />
                      </div>
                      <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                        Workout Complete!
                      </h3>
                      <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
                        Great job! You've completed all {intensity} intensity exercises and burned approximately{" "}
                        {caloriesBurned.toFixed(1)} calories.
                      </p>
                      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                        <button
                          onClick={() => {
                            setWorkoutComplete(false)
                            setCurrentExercise(0)
                            if (filteredExercises.length > 0) {
                              setExerciseCountdown(filteredExercises[0].duration)
                            }
                          }}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "0.375rem",
                            padding: "0.5rem 1rem",
                            background: "#2563eb",
                            color: "white",
                            fontWeight: "500",
                            cursor: "pointer",
                            border: "none",
                          }}
                        >
                          Start New Workout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ maxHeight: "400px", overflowY: "auto", paddingRight: "1rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        {filteredExercises.map((exercise, index) => {
                          const isCompleted = completedExercises.includes(exercise.id)

                          return (
                            <div
                              key={exercise.id}
                              style={{
                                padding: "1rem",
                                borderRadius: "0.5rem",
                                border: "1px solid",
                                borderColor:
                                  index === currentExercise ? "#2563eb" : isCompleted ? "#86efac" : "#e2e8f0",
                                background:
                                  index === currentExercise ? "#eff6ff" : isCompleted ? "#f0fdf4" : "transparent",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                  marginBottom: "0.5rem",
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center" }}>
                                  <h3 style={{ fontWeight: "500", fontSize: "1.125rem" }}>{exercise.name}</h3>
                                  {isCompleted && (
                                    <span style={{ marginLeft: "0.5rem", color: "#22c55e" }}>
                                      <CheckCircleIcon />
                                    </span>
                                  )}
                                </div>
                                <span
                                  style={{
                                    display: "inline-block",
                                    padding: "0.25rem 0.5rem",
                                    borderRadius: "9999px",
                                    fontSize: "0.75rem",
                                    fontWeight: "500",
                                    background: index === currentExercise ? "#2563eb" : "transparent",
                                    color: index === currentExercise ? "white" : "inherit",
                                    border: index === currentExercise ? "none" : "1px solid #e2e8f0",
                                  }}
                                >
                                  {exercise.duration} sec
                                </span>
                              </div>
                              <p style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
                                {exercise.description}
                              </p>

                              {index === currentExercise && (
                                <div style={{ marginTop: "1rem" }}>
                                  {/* Removed per-exercise time remaining and progress bar */}
                                  <button
                                    onClick={completeExercise}
                                    style={{
                                      width: "100%",
                                      marginTop: "0.75rem",
                                      padding: "0.5rem 1rem",
                                      borderRadius: "0.375rem",
                                      background: "#2563eb",
                                      color: "white",
                                      fontWeight: "500",
                                      cursor: "pointer",
                                      border: "none",
                                    }}
                                  >
                                    {index === filteredExercises.length - 1 ? "Complete Workout" : "Next Exercise"}
                                  </button>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
                <div
                  style={{
                    padding: "1rem",
                    borderTop: "1px solid #f1f5f9",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ fontSize: "0.875rem", color: "#64748b" }}>
                    {currentExercise + 1} of {filteredExercises.length} exercises
                  </div>
                  <button
                    onClick={resetWorkout}
                    style={{
                      padding: "0.25rem 0.5rem",
                      fontSize: "0.875rem",
                      borderRadius: "0.375rem",
                      border: "1px solid #e2e8f0",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                  >
                    Reset Workout
                  </button>
                </div>
              </div>
            </div>

            {/* Information Tabs */}
            <div style={{ marginTop: "1rem" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <button
                  onClick={() => setActiveTab("instructions")}
                  style={{
                    padding: "0.5rem",
                    textAlign: "center",
                    borderRadius: "0.375rem",
                    background: activeTab === "instructions" ? "#2563eb" : "#f1f5f9",
                    color: activeTab === "instructions" ? "white" : "inherit",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  Instructions
                </button>
                <button
                  onClick={() => setActiveTab("tips")}
                  style={{
                    padding: "0.5rem",
                    textAlign: "center",
                    borderRadius: "0.375rem",
                    background: activeTab === "tips" ? "#2563eb" : "#f1f5f9",
                    color: activeTab === "tips" ? "white" : "inherit",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  Workout Tips
                </button>
                <button
                  onClick={() => setActiveTab("benefits")}
                  style={{
                    padding: "0.5rem",
                    textAlign: "center",
                    borderRadius: "0.375rem",
                    background: activeTab === "benefits" ? "#2563eb" : "#f1f5f9",
                    color: activeTab === "benefits" ? "white" : "inherit",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  Benefits
                </button>
              </div>

              <div
                style={{
                  padding: "1rem",
                  background: "white",
                  borderRadius: "0.375rem",
                  marginTop: "0.5rem",
                  border: "1px solid #e2e8f0",
                  display: activeTab === "instructions" ? "block" : "none",
                }}
              >
                <h3 style={{ fontWeight: "500", marginBottom: "0.5rem" }}>How to use this workout</h3>
                <ol
                  style={{
                    paddingLeft: "1.25rem",
                    listStyleType: "decimal",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                >
                  <li>Select your desired intensity level before starting</li>
                  <li>Press the play button to start the workout timer</li>
                  <li>Complete each exercise for the specified duration</li>
                  <li>Click "Next Exercise" to move to the next activity</li>
                  <li>Try to complete the entire workout without long breaks</li>
                  <li>Your progress and stats are automatically saved</li>
                  <li>You can switch intensity levels without losing your overall progress</li>
                </ol>
              </div>

              <div
                style={{
                  padding: "1rem",
                  background: "white",
                  borderRadius: "0.375rem",
                  marginTop: "0.5rem",
                  border: "1px solid #e2e8f0",
                  display: activeTab === "tips" ? "block" : "none",
                }}
              >
                <h3 style={{ fontWeight: "500", marginBottom: "0.5rem" }}>Tips for an effective cardio session</h3>
                <ul
                  style={{
                    paddingLeft: "1.25rem",
                    listStyleType: "disc",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                >
                  <li>Stay hydrated throughout your workout</li>
                  <li>Focus on proper form rather than speed</li>
                  <li>Breathe rhythmically and don't hold your breath</li>
                  <li>If you need to rest, take short breaks rather than stopping completely</li>
                  <li>Gradually increase intensity over time as your fitness improves</li>
                  <li>Try to work out at least 3-4 times per week for best results</li>
                  <li>Mix different intensity levels to challenge your body</li>
                </ul>
              </div>

              <div
                style={{
                  padding: "1rem",
                  background: "white",
                  borderRadius: "0.375rem",
                  marginTop: "0.5rem",
                  border: "1px solid #e2e8f0",
                  display: activeTab === "benefits" ? "block" : "none",
                }}
              >
                <h3 style={{ fontWeight: "500", marginBottom: "0.5rem" }}>Benefits of regular cardio exercise</h3>
                <ul
                  style={{
                    paddingLeft: "1.25rem",
                    listStyleType: "disc",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                >
                  <li>Improves heart health and cardiovascular endurance</li>
                  <li>Burns calories and helps with weight management</li>
                  <li>Reduces stress and improves mood</li>
                  <li>Increases energy levels and improves sleep quality</li>
                  <li>Strengthens immune system and overall health</li>
                  <li>Lowers blood pressure and improves cholesterol levels</li>
                  <li>Enhances cognitive function and brain health</li>
                  <li>Increases longevity and quality of life</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardSimple>
  )
}

export default CardioWorkout
