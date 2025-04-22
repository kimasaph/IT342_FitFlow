import React from "react"
import DashboardSimple from "/src/Components/DashboardSimple"

// Self-contained Flexibility/Yoga Workout page with no external dependencies
function FlexibilityYogaWorkout() {
  // Get userID from localStorage or fallback
  const userID = localStorage.getItem("userID") || "defaultUser"

  // Helper to get initial state from localStorage
  const getInitialStats = () => {
    try {
      const savedStats = localStorage.getItem(`flexiYogaStats_${userID}`)
      if (savedStats) {
        return JSON.parse(savedStats)
      }
    } catch {}
    return {}
  }
  const initialStats = getInitialStats()

  // State management using React hooks, initialized from localStorage if available
  const [currentPose, setCurrentPose] = React.useState(initialStats.currentPose || 0)
  const [poseTime, setPoseTime] = React.useState(initialStats.poseTime || 0)
  const [isActive, setIsActive] = React.useState(initialStats.isActive || false)
  const [difficulty, setDifficulty] = React.useState(initialStats.difficulty || "beginner")
  const [showDifficultyMenu, setShowDifficultyMenu] = React.useState(initialStats.showDifficultyMenu || false)
  const [completedPoses, setCompletedPoses] = React.useState(initialStats.completedPoses || [])
  const [activeTab, setActiveTab] = React.useState(initialStats.activeTab || "instructions")
  const [workoutComplete, setWorkoutComplete] = React.useState(initialStats.workoutComplete || false)
  const [breathCount, setBreathCount] = React.useState(initialStats.breathCount || 0)

  // Yoga/Flexibility poses data
  const poses = {
    beginner: [
      {
        name: "Mountain Pose (Tadasana)",
        duration: 30,
        description:
          "Stand tall with feet together, shoulders relaxed, weight evenly distributed through your feet, arms at sides.",
        benefits: "Improves posture, strengthens thighs, ankles, and core",
        instruction:
          "Stand with feet together, arms at sides, distribute weight evenly. Engage your thighs and lengthen your spine. Breathe deeply.",
      },
      {
        name: "Child's Pose (Balasana)",
        duration: 60,
        description:
          "Kneel on the floor, touch big toes together, sit on heels, then bend forward laying torso between thighs.",
        benefits: "Gently stretches hips, thighs, and ankles while calming the mind",
        instruction:
          "Kneel and sit on your heels, knees hip-width apart. Exhale and lay your torso between your thighs. Extend arms forward or alongside body.",
      },
      {
        name: "Downward-Facing Dog (Adho Mukha Svanasana)",
        duration: 45,
        description:
          "Form an inverted V-shape with your body. Hands shoulder-width apart, feet hip-width apart, pressing into the mat.",
        benefits: "Stretches hamstrings, calves, and shoulders while strengthening arms and legs",
        instruction:
          "Start on hands and knees. Tuck toes and lift hips high, forming an inverted V. Press hands firmly into mat and relax head between arms.",
      },
      {
        name: "Seated Forward Bend (Paschimottanasana)",
        duration: 45,
        description:
          "Sit on floor with legs extended forward, bend at hips to bring torso over legs, reaching for feet.",
        benefits: "Stretches spine, shoulders and hamstrings",
        instruction:
          "Sit with legs extended. Inhale, lengthen spine. Exhale, hinge at hips and fold forward. Hold feet if possible or rest hands on legs.",
      },
      {
        name: "Corpse Pose (Savasana)",
        duration: 90,
        description: "Lie on your back with arms at sides, palms up, and legs extended, focusing on deep relaxation.",
        benefits: "Relaxes the body, reduces stress, lowers blood pressure",
        instruction:
          "Lie on your back, arms at sides with palms up, legs extended and slightly apart. Close eyes and breathe naturally, releasing tension.",
      },
    ],
    intermediate: [
      {
        name: "Warrior I (Virabhadrasana I)",
        duration: 45,
        description: "Lunge with back foot at 45° angle, hips facing forward, arms extended overhead.",
        benefits: "Strengthens legs, opens hips and chest, improves balance and core strength",
        instruction:
          "Step one foot back, turn it 45°. Bend front knee over ankle. Square hips forward. Raise arms overhead, palms facing each other.",
      },
      {
        name: "Triangle Pose (Trikonasana)",
        duration: 30,
        description: "Stand with legs wide apart, reach down to shin or ankle while extending other arm upward.",
        benefits: "Stretches legs, hips, spine, and chest; improves balance",
        instruction:
          "Stand with legs wide. Turn one foot out 90°. Extend arms parallel to floor. Reach forward and down to shin with one hand, other arm reaching up.",
      },
      {
        name: "Bridge Pose (Setu Bandha Sarvangasana)",
        duration: 45,
        description: "Lie on back, bend knees with feet flat, lift hips creating a bridge with your body.",
        benefits: "Stretches chest, neck, and spine; strengthens back, glutes, and hamstrings",
        instruction:
          "Lie on back, knees bent, feet flat and hip-width apart. Press feet down, lift hips up. Clasp hands below pelvis and extend through arms.",
      },
      {
        name: "Seated Twist (Ardha Matsyendrasana)",
        duration: 30,
        description: "Sit with one leg extended, other knee bent. Twist torso toward bent knee.",
        benefits: "Improves spine mobility, aids digestion, opens shoulders",
        instruction:
          "Sit with legs extended. Bend one knee, place foot outside opposite thigh. Twist torso toward bent knee, using arm as leverage on outside of thigh.",
      },
      {
        name: "Pigeon Pose (Eka Pada Rajakapotasana)",
        duration: 60,
        description:
          "From all fours, bring one knee forward behind wrist, extend other leg back, fold forward over bent leg.",
        benefits: "Deep hip opener, stretches thighs and groin, releases tension",
        instruction:
          "From downward dog, bring knee to wrist, ankle near opposite hip. Extend other leg back. Square hips. Fold forward or stay upright.",
      },
    ],
    advanced: [
      {
        name: "Crow Pose (Bakasana)",
        duration: 30,
        description: "Balancing pose where knees rest on upper arms, feet lift off floor.",
        benefits: "Strengthens arms, wrists, and core; improves balance and focus",
        instruction:
          "Squat with feet together. Place hands shoulder-width apart. Bend elbows, place knees on upper arms. Lean forward, lift feet, balance on hands.",
      },
      {
        name: "Wheel Pose (Urdhva Dhanurasana)",
        duration: 30,
        description: "Backbend where you push up from lying position, arching back with hands and feet on floor.",
        benefits: "Strengthens arms, legs, abdomen, and spine; increases energy and counteracts depression",
        instruction:
          "Lie on back, bend knees, feet flat. Place hands beside head, fingers pointing toward shoulders. Press up, lifting shoulders and head off mat.",
      },
      {
        name: "Headstand (Sirsasana)",
        duration: 60,
        description: "Inverted pose where body is balanced on head and forearms, legs extended upward.",
        benefits: "Improves circulation, strengthens shoulders and core, calms the mind",
        instruction:
          "Create triangle with forearms. Interlace fingers, cradle back of head. Straighten legs, walk feet toward head. Lift legs up one at a time or together.",
      },
      {
        name: "Side Plank (Vasisthasana)",
        duration: 45,
        description:
          "Balance on one hand and edge of one foot, with body in straight line and other arm extended upward.",
        benefits: "Strengthens wrists, arms, and core; improves balance and focus",
        instruction:
          "Start in plank. Shift weight to one arm, roll onto edge of foot. Stack feet or place top foot in front. Extend top arm up or place on hip.",
      },
      {
        name: "King Dancer Pose (Natarajasana)",
        duration: 30,
        description: "Standing balance pose where you hold one foot behind you while extending forward.",
        benefits: "Improves balance, stretches shoulders and thighs, strengthens legs",
        instruction:
          "Stand on one leg. Bend other knee, grasp foot behind you. Extend free arm forward. Lift foot up and back while leaning forward.",
      },
    ],
  }

  // Get current poses based on difficulty level
  const currentPoses = poses[difficulty]

  // Save data to localStorage whenever relevant stats change
  React.useEffect(() => {
    try {
      const statsToSave = {
        currentPose,
        poseTime,
        isActive,
        difficulty,
        showDifficultyMenu,
        completedPoses,
        activeTab,
        workoutComplete,
        breathCount,
      }
      localStorage.setItem(`flexiYogaStats_${userID}`, JSON.stringify(statsToSave))
    } catch (error) {
      console.error("Error saving yoga workout data:", error)
    }
  }, [
    currentPose,
    poseTime,
    isActive,
    difficulty,
    showDifficultyMenu,
    completedPoses,
    activeTab,
    workoutComplete,
    breathCount,
    userID,
  ])

  // Save total completed FlexiYoga workouts
  const saveFlexiYogaTotalWorkouts = () => {
    const prev = parseInt(localStorage.getItem(`flexiYogaTotalWorkouts_${userID}`) || "0", 10);
    localStorage.setItem(`flexiYogaTotalWorkouts_${userID}`, prev + 1);
  };

  // Timer functionality
  React.useEffect(() => {
    let interval = null

    if (isActive && poseTime < currentPoses[currentPose].duration) {
      interval = setInterval(() => {
        setPoseTime((prevTime) => prevTime + 1)

        // Increment breath count every 5 seconds
        if ((poseTime + 1) % 5 === 0) {
          setBreathCount((prev) => prev + 1)
        }
      }, 1000)
    } else if (isActive && poseTime >= currentPoses[currentPose].duration) {
      // Move to next pose when time is up
      clearInterval(interval)
      handlePoseComplete()
    } else {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [isActive, poseTime, currentPose, difficulty, currentPoses])

  // Format time to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const secs = (seconds % 60).toString().padStart(2, "0")
    return `${mins}:${secs}`
  }

  // Handle pose completion
  const handlePoseComplete = () => {
    // Add current pose to completed poses if not already there
    if (!completedPoses.includes(currentPose)) {
      setCompletedPoses([...completedPoses, currentPose])
    }

    // Move to next pose or complete workout
    if (currentPose < currentPoses.length - 1) {
      setCurrentPose(currentPose + 1)
      setPoseTime(0)
    } else {
      setWorkoutComplete(true)
      setIsActive(false)
      // Save total completed workouts for goals page
      saveFlexiYogaTotalWorkouts();
    }
  }

  // Skip to next pose
  const nextPose = () => {
    if (currentPose < currentPoses.length - 1) {
      setCurrentPose(currentPose + 1)
      setPoseTime(0)
    } else {
      setWorkoutComplete(true)
      setIsActive(false)
    }
  }

  // Go to previous pose
  const prevPose = () => {
    if (currentPose > 0) {
      setCurrentPose(currentPose - 1)
      setPoseTime(0)
    }
  }

  // Reset workout
  const resetWorkout = () => {
    setCurrentPose(0)
    setPoseTime(0)
    setIsActive(false)
    setWorkoutComplete(false)
    setBreathCount(0)
  }

  // Calculate overall progress
  const overallProgress = (completedPoses.length / currentPoses.length) * 100

  // Calculate current pose progress
  const poseProgress = (poseTime / currentPoses[currentPose].duration) * 100

  // Icon components
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

  const ChevronLeftIcon = () => (
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
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  )

  const ChevronRightIcon = () => (
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
      <polyline points="9 18 15 12 9 6"></polyline>
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

  const LungsIcon = () => (
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
      <path d="M6.081 20c0-2.164.813-4.245 2.262-5.798A7.904 7.904 0 0 1 12 12.292c1.384 0 2.734.404 3.883 1.162"></path>
      <path d="M12 4v8"></path>
      <path d="M14.499 7.5c2.37 1.272 3.983 3.258 4.5 6.5 1 4-1 8.5-2.5 10 .5-2 .5-5.5-2.5-9.5-1.5-2-4-3.5-4-3.5"></path>
      <path d="M9.5 7.5C7.13 8.772 5.518 10.758 5 14c-1 4 1 8.5 2.5 10 -.5-2-.5-5.5 2.5-9.5 1.5-2 4-3.5 4-3.5"></path>
    </svg>
  )

  const YogaIcon = () => (
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
      <path d="M12 2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-1z"></path>
      <path d="M6 9h12l-3 4"></path>
      <path d="M9 13v7"></path>
      <path d="M15 13v7"></path>
      <path d="M12 17v3"></path>
      <path d="M6 17h12"></path>
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

  return (
    <DashboardSimple>
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f0f9ff, #e0f2fe)",
        padding: "1rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#334155",
      }}
    >
      <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
        <header style={{ marginBottom: "2rem", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
              color: "#0369a1",
            }}
          >
            Flexibility & Yoga Workout
          </h1>
          <p style={{ color: "#64748b" }}>Improve flexibility, balance, and mindfulness with these yoga poses</p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
          {/* Top Section - Current Pose */}
          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "0.5rem",
              overflow: "hidden",
              background: "white",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                padding: "1.5rem",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {workoutComplete ? (
                <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
                  <div style={{ color: "#10b981", margin: "0 auto 1rem auto", width: "4rem", height: "4rem" }}>
                    <CheckCircleIcon />
                  </div>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem", color: "#0369a1" }}>
                    Workout Complete!
                  </h2>
                  <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
                    Great job! You've completed all poses in the {difficulty} workout.
                  </p>
                  <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
                    You took {breathCount} mindful breaths during this session.
                  </p>
                  <button
                    onClick={resetWorkout}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "0.375rem",
                      padding: "0.5rem 1rem",
                      background: "#0ea5e9",
                      color: "white",
                      fontWeight: "500",
                      cursor: "pointer",
                      border: "none",
                    }}
                  >
                    Start New Workout
                  </button>
                </div>
              ) : (
                <>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem", color: "#0369a1" }}>
                    {currentPoses[currentPose].name}
                  </h2>
                  <div
                    style={{
                      width: "200px",
                      height: "200px",
                      background: "#f1f5f9",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "1rem auto",
                      color: "#0ea5e9",
                      fontSize: "3rem",
                    }}
                  >
                    <YogaIcon />
                  </div>
                  <div style={{ marginBottom: "1rem", maxWidth: "600px" }}>
                    <p style={{ marginBottom: "1rem" }}>{currentPoses[currentPose].description}</p>
                    <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
                      <strong>Benefits:</strong> {currentPoses[currentPose].benefits}
                    </p>
                  </div>

                  <div style={{ width: "100%", maxWidth: "400px", marginBottom: "1rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <span>
                        Time: {formatTime(poseTime)} / {formatTime(currentPoses[currentPose].duration)}
                      </span>
                      <span style={{ display: "flex", alignItems: "center" }}>
                        <LungsIcon style={{ marginRight: "0.25rem", color: "#0ea5e9" }} />
                        {breathCount} breaths
                      </span>
                    </div>
                    <div
                      style={{
                        height: "0.5rem",
                        background: "#e2e8f0",
                        borderRadius: "9999px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${poseProgress}%`,
                          background: "#0ea5e9",
                          borderRadius: "9999px",
                          transition: "width 0.3s ease",
                        }}
                      ></div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                    <button
                      onClick={prevPose}
                      disabled={currentPose === 0}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "0.375rem",
                        padding: "0.5rem",
                        border: "1px solid #e2e8f0",
                        background: "transparent",
                        cursor: currentPose === 0 ? "not-allowed" : "pointer",
                        opacity: currentPose === 0 ? 0.5 : 1,
                      }}
                    >
                      <ChevronLeftIcon />
                    </button>
                    <button
                      onClick={() => setIsActive(!isActive)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "0.375rem",
                        padding: "0.5rem 1.5rem",
                        background: isActive ? "#f1f5f9" : "#0ea5e9",
                        color: isActive ? "#0f172a" : "white",
                        border: isActive ? "1px solid #e2e8f0" : "none",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                    >
                      {isActive ? <PauseIcon /> : <PlayIcon />}
                      <span style={{ marginLeft: "0.5rem" }}>{isActive ? "Pause" : "Start"}</span>
                    </button>
                    <button
                      onClick={nextPose}
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
                      <ChevronRightIcon />
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
                </>
              )}
            </div>
          </div>

          {/* Middle Section - Difficulty and Progress */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {/* Difficulty Level Card */}
            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                overflow: "hidden",
                background: "white",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ padding: "1rem", borderBottom: "1px solid #f1f5f9" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#0369a1" }}>Difficulty Level</h2>
                <p style={{ fontSize: "0.875rem", color: "#64748b" }}>Select your experience level</p>
              </div>
              <div style={{ padding: "1rem" }}>
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setShowDifficultyMenu(!showDifficultyMenu)}
                    disabled={isActive}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "0.5rem 1rem",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.375rem",
                      background: "white",
                      cursor: isActive ? "not-allowed" : "pointer",
                      opacity: isActive ? 0.5 : 1,
                    }}
                  >
                    <span style={{ textTransform: "capitalize" }}>{difficulty}</span>
                    <ChevronDownIcon />
                  </button>

                  {showDifficultyMenu && !isActive && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "100%",
                        border: "1px solid #e2e8f0",
                        borderRadius: "0.375rem",
                        background: "white",
                        marginTop: "0.25rem",
                        zIndex: 10,
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <div
                        onClick={() => {
                          setDifficulty("beginner")
                          setShowDifficultyMenu(false)
                          resetWorkout()
                        }}
                        style={{
                          padding: "0.5rem 1rem",
                          cursor: "pointer",
                          backgroundColor: difficulty === "beginner" ? "#f0f9ff" : "transparent",
                        }}
                      >
                        Beginner
                      </div>
                      <div
                        onClick={() => {
                          setDifficulty("intermediate")
                          setShowDifficultyMenu(false)
                          resetWorkout()
                        }}
                        style={{
                          padding: "0.5rem 1rem",
                          cursor: "pointer",
                          backgroundColor: difficulty === "intermediate" ? "#f0f9ff" : "transparent",
                        }}
                      >
                        Intermediate
                      </div>
                      <div
                        onClick={() => {
                          setDifficulty("advanced")
                          setShowDifficultyMenu(false)
                          resetWorkout()
                        }}
                        style={{
                          padding: "0.5rem 1rem",
                          cursor: "pointer",
                          backgroundColor: difficulty === "advanced" ? "#f0f9ff" : "transparent",
                        }}
                      >
                        Advanced
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: "1rem" }}>
                  <p style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>Recommended for:</p>
                  <ul
                    style={{
                      fontSize: "0.875rem",
                      color: "#64748b",
                      paddingLeft: "1.25rem",
                      listStyleType: "disc",
                    }}
                  >
                    {difficulty === "beginner" && (
                      <>
                        <li>New to yoga or flexibility training</li>
                        <li>Looking for gentle stretches</li>
                        <li>Focus on basic poses and alignment</li>
                      </>
                    )}
                    {difficulty === "intermediate" && (
                      <>
                        <li>Some yoga experience (3+ months)</li>
                        <li>Comfortable with basic poses</li>
                        <li>Ready for deeper stretches</li>
                      </>
                    )}
                    {difficulty === "advanced" && (
                      <>
                        <li>Experienced yoga practitioners</li>
                        <li>Strong balance and core strength</li>
                        <li>Comfortable with inversions and arm balances</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                overflow: "hidden",
                background: "white",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ padding: "1rem", borderBottom: "1px solid #f1f5f9" }}>
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    color: "#0369a1",
                  }}
                >
                  <span style={{ marginRight: "0.5rem", color: "#0ea5e9" }}>
                    <FlameIcon />
                  </span>
                  Workout Progress
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
                    <span>Overall Progress</span>
                    <span style={{ fontWeight: "500" }}>{Math.round(overallProgress)}%</span>
                  </div>
                  <div style={{ height: "0.5rem", background: "#e2e8f0", borderRadius: "9999px", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${overallProgress}%`,
                        background: "#0ea5e9",
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
                    <span>Poses Completed</span>
                    <span style={{ fontWeight: "500" }}>
                      {completedPoses.length} of {currentPoses.length}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    marginTop: "0.5rem",
                  }}
                >
                  {currentPoses.map((pose, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "0.5rem",
                        borderRadius: "0.375rem",
                        background: completedPoses.includes(index)
                          ? "#f0fdfa"
                          : currentPose === index
                            ? "#f0f9ff"
                            : "transparent",
                        border: "1px solid",
                        borderColor: completedPoses.includes(index)
                          ? "#99f6e4"
                          : currentPose === index
                            ? "#bae6fd"
                            : "#e2e8f0",
                      }}
                    >
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          background: completedPoses.includes(index) ? "#10b981" : "#e2e8f0",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "0.75rem",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                        }}
                      >
                        {completedPoses.includes(index) ? <CheckCircleIcon /> : index + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.875rem", fontWeight: "500" }}>{pose.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{formatTime(pose.duration)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Instructions */}
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
                  background: activeTab === "instructions" ? "#0ea5e9" : "#f1f5f9",
                  color: activeTab === "instructions" ? "white" : "#0f172a",
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
                  background: activeTab === "tips" ? "#0ea5e9" : "#f1f5f9",
                  color: activeTab === "tips" ? "white" : "#0f172a",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                Yoga Tips
              </button>
              <button
                onClick={() => setActiveTab("benefits")}
                style={{
                  padding: "0.5rem",
                  textAlign: "center",
                  borderRadius: "0.375rem",
                  background: activeTab === "benefits" ? "#0ea5e9" : "#f1f5f9",
                  color: activeTab === "benefits" ? "white" : "#0f172a",
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
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3 style={{ fontWeight: "500", marginBottom: "0.5rem", color: "#0369a1" }}>How to use this workout</h3>
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
                <li>Select your difficulty level before starting</li>
                <li>Press the play button to start the pose timer</li>
                <li>Follow the instructions for each pose</li>
                <li>Focus on your breathing throughout each pose</li>
                <li>Hold each pose for the recommended duration</li>
                <li>Use the navigation buttons to move between poses if needed</li>
                <li>Complete all poses for a full workout</li>
              </ol>

              <div style={{ marginTop: "1rem", padding: "0.75rem", background: "#f0f9ff", borderRadius: "0.375rem" }}>
                <p style={{ fontSize: "0.875rem", fontStyle: "italic" }}>
                  <strong>Current Pose Instructions:</strong>{" "}
                  {!workoutComplete && currentPoses[currentPose].instruction}
                </p>
              </div>
            </div>

            <div
              style={{
                padding: "1rem",
                background: "white",
                borderRadius: "0.375rem",
                marginTop: "0.5rem",
                border: "1px solid #e2e8f0",
                display: activeTab === "tips" ? "block" : "none",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3 style={{ fontWeight: "500", marginBottom: "0.5rem", color: "#0369a1" }}>
                Tips for effective yoga practice
              </h3>
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
                <li>Practice on an empty stomach (2-3 hours after eating)</li>
                <li>Wear comfortable, stretchy clothing</li>
                <li>Use a yoga mat for better grip and cushioning</li>
                <li>Focus on your breath - inhale and exhale deeply through your nose</li>
                <li>Don't push beyond your limits - respect your body's boundaries</li>
                <li>Maintain proper alignment to prevent injury</li>
                <li>Stay present and mindful throughout your practice</li>
                <li>Practice regularly for best results (3-5 times per week)</li>
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
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3 style={{ fontWeight: "500", marginBottom: "0.5rem", color: "#0369a1" }}>
                Benefits of yoga and flexibility training
              </h3>
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
                <li>Increases flexibility and range of motion</li>
                <li>Improves posture and body alignment</li>
                <li>Builds strength and muscle tone</li>
                <li>Enhances balance and coordination</li>
                <li>Reduces stress and anxiety</li>
                <li>Improves breathing and energy levels</li>
                <li>Promotes better sleep quality</li>
                <li>Helps prevent injuries in daily activities</li>
                <li>Increases body awareness and mindfulness</li>
                <li>Supports joint health and reduces stiffness</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    </DashboardSimple>
  )
}

export default FlexibilityYogaWorkout
