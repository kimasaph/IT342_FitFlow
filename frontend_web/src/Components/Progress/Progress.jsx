import { useState, useEffect } from "react"
import DashboardSimple from "/src/Components/DashboardSimple"
import axios from "axios"

function FitFlowProgress() {
  // Get user ID from localStorage
  const userID = localStorage.getItem("userID") || "guest"

  // Fetch user name and profile picture from localStorage
  const storedUser = localStorage.getItem("user");
  let userName = "Alex Johnson";
  let profilePicture = "/src/assets/images/default-profile.png";
  if (storedUser) {
    try {
      const userObj = JSON.parse(storedUser);
      userName = (userObj.firstName || "") + (userObj.lastName ? " " + userObj.lastName : "");
      if (userObj.profilePicture && userObj.profilePicture.trim() !== "") {
        profilePicture = userObj.profilePicture;
      }
    } catch {}
  }

  // State for user data
  const [userData, setUserData] = useState({
    name: localStorage.getItem("userName") || "Alex Johnson",
    joinDate: localStorage.getItem("joinDate") || "2023-09-15",
    currentStreak: 0,
    totalWorkouts: 0,
    weightProgress: [82, 81, 80, 79, 78.5, 78, 77.5, 77, 76.8, 76.5, 76, 75.8],
    workoutHistory: [],
    achievements: [],
    goals: [],
  })

  // State for streaks and milestones
  const [streaks, setStreaks] = useState([
    { name: "Workout Streak", icon: "🔥", current: 0, best: 0 },
    { name: "Daily Login", icon: "📅", current: 0, best: 0 },
    { name: "Weekly Goals", icon: "🎯", current: 0, best: 0 },
    { name: "Mindfulness", icon: "🧘", current: 0, best: 0 },
  ])

  // State for milestones
  const [milestones, setMilestones] = useState([
    { id: 1, description: "Complete 10 workouts", progress: 0, reward: "Achievement Badge" },
    { id: 2, description: "Try all workout types", progress: 0, reward: "New Profile Frame" },
    { id: 3, description: "Maintain 7-day streak", progress: 0, reward: "Premium Content" },
  ])

  // State for achievements
  const [achievements, setAchievements] = useState([
    { id: 1, name: "First Workout", description: "Complete your first workout", unlocked: false },
    { id: 2, name: "Consistency", description: "Complete 5 workouts", unlocked: false },
    { id: 3, name: "All-Rounder", description: "Try all workout types", unlocked: false },
    { id: 4, name: "Early Bird", description: "Complete 5 workouts before 8 AM", unlocked: false },
    { id: 5, name: "Strength Master", description: "Complete 10 strength workouts", unlocked: false },
  ])

  // Fetch data from localStorage and API on component mount
  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        // Get total workouts for each style
        const strengthTotal = Number.parseInt(localStorage.getItem(`strengthTotalWorkouts_${userID}`) || "0", 10)
        const cardioTotal = Number.parseInt(localStorage.getItem(`cardioTotalWorkouts_${userID}`) || "0", 10)
        const flexiYogaTotal = Number.parseInt(localStorage.getItem(`flexiYogaTotalWorkouts_${userID}`) || "0", 10)
        const totalWorkouts = strengthTotal + cardioTotal + flexiYogaTotal

        // Update streaks
        const updatedStreaks = [...streaks]
        updatedStreaks[0].current = totalWorkouts
        updatedStreaks[0].best = Math.max(totalWorkouts, updatedStreaks[0].best)
        // Optionally, update other streaks from localStorage or API here

        setStreaks(updatedStreaks)

        // Update milestones (ensure progress is a whole number)
        const updatedMilestones = [...milestones]
        updatedMilestones[0].progress = Math.round(Math.min((totalWorkouts / 10) * 100, 100))
        const allTypesProgress =
          ((strengthTotal > 0 ? 1 : 0) + (cardioTotal > 0 ? 1 : 0) + (flexiYogaTotal > 0 ? 1 : 0)) * 33.33
        updatedMilestones[1].progress = Math.round(Math.min(allTypesProgress, 100))
        updatedMilestones[2].progress = Math.round(Math.min((updatedStreaks[0].current / 7) * 100, 100))

        setMilestones(updatedMilestones)

        // Update achievements
        const updatedAchievements = [...achievements]
        if (totalWorkouts > 0) updatedAchievements[0].unlocked = true
        if (totalWorkouts >= 5) updatedAchievements[1].unlocked = true
        if (strengthTotal > 0 && cardioTotal > 0 && flexiYogaTotal > 0) updatedAchievements[2].unlocked = true
        if (strengthTotal >= 10) updatedAchievements[4].unlocked = true

        setAchievements(updatedAchievements)

        // Fetch workout history dynamically from localStorage or API
        let workoutHistory = []
        try {
          const storedHistory = localStorage.getItem(`workoutHistory_${userID}`)
          if (storedHistory) {
            workoutHistory = JSON.parse(storedHistory)
          }
        } catch {}
        // If no localStorage, fallback to empty array
        if (!Array.isArray(workoutHistory)) workoutHistory = []

        // Fetch weight progress dynamically from localStorage or API
        let weightProgress = []
        try {
          const storedWeights = localStorage.getItem(`weightProgress_${userID}`)
          if (storedWeights) {
            weightProgress = JSON.parse(storedWeights)
          }
        } catch {}
        // Fallback to previous default if not found
        if (!Array.isArray(weightProgress) || weightProgress.length === 0) {
          weightProgress = [82, 81, 80, 79, 78.5, 78, 77.5, 77, 76.8, 76.5, 76, 75.8]
        }

        // Fetch goals dynamically from localStorage or API
        let goals = []
        try {
          const storedGoals = localStorage.getItem(`goals_${userID}`)
          if (storedGoals) {
            goals = JSON.parse(storedGoals)
          }
        } catch {}
        // Fallback to static goals if not found
        if (!Array.isArray(goals) || goals.length === 0) {
          goals = [
            { label: "Weight", current: weightProgress[weightProgress.length - 1], target: 75, unit: "kg" },
            { label: "Weekly Workouts", current: Math.min(totalWorkouts, 4), target: 4, unit: "sessions" },
            { label: "Daily Steps", current: 8500, target: 10000, unit: "steps" },
            { label: "Monthly Distance", current: 68, target: 100, unit: "km" },
          ]
        }

        setUserData((prev) => ({
          ...prev,
          totalWorkouts,
          workoutHistory,
          weightProgress,
          goals,
        }))

        // Optionally fetch achievements from API if available
        const token = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        let apiUserId = userID
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          apiUserId = parsedUser.id || parsedUser.userId || userID
        }
        if (token && apiUserId && apiUserId !== "guest") {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/achievements/my-progress?userId=${apiUserId}`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          )
          if (response.data && response.data.progress) {
            // Example: update "Meal Master" achievement if present
            if ('meals_created_5' in response.data.progress) {
              setAchievements(prev => {
                const updated = [...prev]
                const mealMasterIndex = updated.findIndex(a => a.name === "Meal Master")
                if (mealMasterIndex >= 0) {
                  const mealCount = response.data.progress.meals_created_5
                  updated[mealMasterIndex] = {
                    ...updated[mealMasterIndex],
                    progress: mealCount || 0,
                    unlocked: mealCount >= (updated[mealMasterIndex].total || 5),
                    unlockedDate: mealCount >= (updated[mealMasterIndex].total || 5)
                      ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : undefined
                  }
                }
                return updated
              })
            }
          }
        }
      } catch (error) {
        console.error("Error fetching workout data:", error)
      }
    }

    fetchWorkoutData()
  }, [userID])

  // Calculate progress percentages for goals
  const calculateProgress = (current, target) => {
    return Math.min(Math.round((current / target) * 100), 100)
  }

  // Format date to readable string
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Get days since joining
  const daysSinceJoining = () => {
    const joinDate = new Date(userData.joinDate)
    const today = new Date()
    const diffTime = Math.abs(today - joinDate)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <DashboardSimple>
    <div style={styles.container}>
      {/* Header with profile picture and name */}
      <header style={styles.header}>
        <div style={styles.profileSection}>
          <img
            src={profilePicture}
            alt="Profile"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: "10px",
              border: "2px solid #38B2AC"
            }}
            onError={e => { e.target.src = "/src/assets/images/default-profile.png"; }}
          />
          <span style={styles.userName}>{userName.trim() || "User"}</span>
        </div>
      </header>

      {/* Page Title */}
      <div style={styles.pageTitle}>
        <h1>Your Progress</h1>
        <p>Track your fitness journey and achievements</p>
      </div>

      {/* Stats Summary Component */}
      <div style={styles.statsSummaryContainer}>
        <StatsSummary achievements={achievements} streaks={streaks} />
      </div>

      {/* Stats Summary */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🔥</div>
          <div style={styles.statInfo}>
            <h3>{userData.totalWorkouts}</h3>
            <p>Total Workouts</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📅</div>
          <div style={styles.statInfo}>
            <h3>{daysSinceJoining()}</h3>
            <p>Days Since Joining</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⚖️</div>
          <div style={styles.statInfo}>
            <h3>{userData.weightProgress[0] - userData.weightProgress[userData.weightProgress.length - 1]} kg</h3>
            <p>Weight Lost</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🏆</div>
          <div style={styles.statInfo}>
            <h3>{achievements.filter((a) => a.unlocked).length}</h3>
            <p>Achievements</p>
          </div>
        </div>
      </div>

      {/* Streaks Tab Component */}
      <div style={styles.streaksContainer}>
        <StreaksTab streaks={streaks} milestones={milestones} />
      </div>

      {/* Main Content Grid */}
      <div style={styles.mainGrid}>
        {/* Weight Progress Chart */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Weight Progress</h2>
          <div style={styles.chartContainer}>
            <div style={styles.weightChart}>
              {userData.weightProgress.map((weight, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.weightBar,
                    height: `${(weight - 70) * 10}px`,
                    backgroundColor: `rgba(56, 178, 172, ${0.5 + index * 0.05})`,
                  }}
                  title={`${weight} kg`}
                >
                  <span style={styles.weightLabel}>{weight}</span>
                </div>
              ))}
            </div>
            <div style={styles.chartXAxis}>
              <span>12 weeks ago</span>
              <span>Now</span>
            </div>
          </div>
        </div>

        {/* Goals Tracking */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Goals</h2>
          <div style={styles.goalsContainer}>
            {userData.goals.map((goal, idx) => (
              <div style={styles.goalItem} key={goal.label + idx}>
                <div style={styles.goalInfo}>
                  <h3>{goal.label}</h3>
                  <p>
                    {goal.current} / {goal.target} {goal.unit}
                  </p>
                </div>
                <div style={styles.progressBarContainer}>
                  <div
                    style={{
                      ...styles.progressBar,
                      width: `${calculateProgress(goal.current, goal.target)}%`,
                      backgroundColor: calculateProgress(goal.current, goal.target) >= 100 ? "#10B981" : "#38B2AC",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Recent Activity</h2>
          <div style={styles.activityList}>
            {userData.workoutHistory.length === 0 ? (
              <div style={{ color: "#888", fontStyle: "italic" }}>No recent activity found.</div>
            ) : (
              userData.workoutHistory.map((workout, index) => (
                <div key={index} style={styles.activityItem}>
                  <div
                    style={{
                      ...styles.activityTypeIcon,
                      backgroundColor:
                        workout.type === "Strength" ? "#F59E0B" : workout.type === "Cardio" ? "#3B82F6" : "#10B981",
                    }}
                  >
                    {workout.type?.charAt(0) || "?"}
                  </div>
                  <div style={styles.activityDetails}>
                    <h3>{workout.type} Workout</h3>
                    <p>
                      {formatDate(workout.date)} • {workout.duration} min • {workout.calories} cal
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Achievements */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Achievements</h2>
          <div style={styles.achievementsList}>
            {achievements.map((achievement, index) => (
              <div
                key={index}
                style={{
                  ...styles.achievementItem,
                  opacity: achievement.unlocked ? 1 : 0.5,
                }}
              >
                <div
                  style={{
                    ...styles.achievementBadge,
                    backgroundColor: achievement.unlocked ? "#10B981" : "#9CA3AF",
                  }}
                >
                  {achievement.unlocked ? "✓" : "○"}
                </div>
                <div style={styles.achievementDetails}>
                  <h3>{achievement.name}</h3>
                  <p>{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>Progress Tracker • Keep pushing forward!</p>
      </footer>
    </div>
    </DashboardSimple>
  )
}

// StatsSummary Component
const StatsSummary = ({ achievements, streaks }) => {
  // Fetch total workouts for each style
  const userID = localStorage.getItem("userID") || "guest"
  const strengthTotal = Number.parseInt(localStorage.getItem(`strengthTotalWorkouts_${userID}`) || "0", 10)
  const cardioTotal = Number.parseInt(localStorage.getItem(`cardioTotalWorkouts_${userID}`) || "0", 10)
  const flexiYogaTotal = Number.parseInt(localStorage.getItem(`flexiYogaTotalWorkouts_${userID}`) || "0", 10)

  // Calculate total workouts across all styles
  const totalWorkouts = strengthTotal + cardioTotal + flexiYogaTotal

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6" style={{ ...styles.statsSummaryGrid, background: "#fff", padding: "24px", borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "32px" }}>
      {/* Achievements Unlocked */}
      <div style={{ ...styles.statsSummaryCard, background: "linear-gradient(90deg, #a78bfa 0%, #6366f1 100%)", color: "#fff" }}>
        <div style={styles.statsSummaryIcon}>
          <TrophyIcon />
        </div>
        <div style={styles.statsSummaryContent}>
          <div style={styles.statsSummaryValue}>
            {achievements.filter((a) => a.unlocked).length}/{achievements.length}
          </div>
          <p style={styles.statsSummaryLabel}>Achievements Unlocked</p>
        </div>
      </div>

      {/* Total Workouts per Style */}
      <div style={{ ...styles.statsSummaryCard, background: "linear-gradient(90deg, #34d399 0%, #3b82f6 100%)", color: "#fff" }}>
        <div style={styles.statsSummaryIcon}>
          <FlameIcon />
        </div>
        <div style={styles.statsSummaryContent}>
          <div style={styles.statsSummaryValue}>{totalWorkouts}</div>
          <div style={styles.workoutBreakdown}>
            <span>Strength: {strengthTotal}</span> &nbsp;|&nbsp;
            <span>Cardio: {cardioTotal}</span> &nbsp;|&nbsp;
            <span>FlexiYoga: {flexiYogaTotal}</span>
          </div>
          <p style={styles.statsSummaryLabel}>Total Workouts per Style</p>
        </div>
      </div>

      {/* 30-Day Consistency Current Challenge */}
      <div style={{ ...styles.statsSummaryCard, background: "linear-gradient(90deg, #fbbf24 0%, #f59e42 100%)", color: "#fff" }}>
        <div style={styles.statsSummaryIcon}>
          <CalendarIcon />
        </div>
        <div style={styles.statsSummaryContent}>
          <div style={styles.statsSummaryValue}>30-Day Consistency</div>
          <div style={styles.challengeProgress}>
            <div style={styles.challengeProgressBar}>
              <div style={{ ...styles.challengeProgressFill, width: "60%", background: "#fff" }}></div>
            </div>
            <span style={styles.challengeProgressText}>18/30</span>
          </div>
          <p style={styles.statsSummaryLabel}>Current Challenge</p>
        </div>
      </div>
    </div>
  )
}

// StreaksTab Component
const StreaksTab = ({ streaks, milestones }) => {
  // Fetch total workouts for each style
  const userID = localStorage.getItem("userID") || "guest"
  const strengthTotal = Number.parseInt(localStorage.getItem(`strengthTotalWorkouts_${userID}`) || "0", 10)
  const cardioTotal = Number.parseInt(localStorage.getItem(`cardioTotalWorkouts_${userID}`) || "0", 10)
  const flexiYogaTotal = Number.parseInt(localStorage.getItem(`flexiYogaTotalWorkouts_${userID}`) || "0", 10)
  const totalWorkouts = strengthTotal + cardioTotal + flexiYogaTotal

  return (
    <div style={styles.streaksTabContainer}>
      <div style={styles.streaksCard}>
        <div style={styles.streaksHeader}>
          <h2 style={styles.streaksTitle}>Current Streaks</h2>
          <div style={styles.streaksDate}>
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </div>
        </div>
        <div style={styles.streaksGrid}>
          {streaks.map((streak, index) => (
            <div key={index} style={styles.streakItem}>
              <div style={styles.streakHeader}>
                <span style={styles.streakIcon}>{streak.icon}</span>
                <h3 style={styles.streakName}>{streak.name}</h3>
              </div>
              <div style={styles.streakStats}>
                <div style={styles.streakCurrent}>
                  <p style={styles.streakCurrentValue}>
                    {streak.name.toLowerCase().includes("workout") ? totalWorkouts : streak.current}
                  </p>
                  <p style={styles.streakCurrentLabel}>Current streak</p>
                </div>
                <div style={styles.streakBest}>
                  <p style={styles.streakBestValue}>{streak.best}</p>
                  <p style={styles.streakBestLabel}>Best</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div style={styles.milestonesCard}>
        <h2 style={styles.milestonesTitle}>
          <CalendarIcon style={styles.milestonesIcon} />
          Upcoming Milestones
        </h2>

        <div style={styles.milestonesList}>
          {milestones.map((milestone) => (
            <div key={milestone.id} style={styles.milestoneItem}>
              <div style={styles.milestoneHeader}>
                <h3 style={styles.milestoneDescription}>{milestone.description}</h3>
                <span style={styles.milestoneProgress}>{Math.round(milestone.progress)}%</span>
              </div>

              <div style={styles.milestoneProgressBar}>
                <div style={{ ...styles.milestoneProgressFill, width: `${milestone.progress}%` }}></div>
              </div>

              <div style={styles.milestoneReward}>
                <TrophyIcon style={styles.milestoneRewardIcon} />
                Reward: {milestone.reward}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Icon Components
const TrophyIcon = (props) => (
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
    {...props}
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
    <path d="M4 22h16"></path>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
  </svg>
)

const FlameIcon = (props) => (
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
    {...props}
  >
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
  </svg>
)

const CalendarIcon = (props) => (
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
    {...props}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
    <line x1="16" x2="16" y1="2" y2="6"></line>
    <line x1="8" x2="8" y1="2" y2="6"></line>
    <line x1="3" x2="21" y1="10" y2="10"></line>
  </svg>
)

// Styles
const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    maxWidth: "100%",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#F9FAFB",
    color: "#1F2937",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "flex-end", // Changed to align profile to right
    alignItems: "center",
    padding: "10px 0",
    marginBottom: "20px",
  },
  profileSection: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#38B2AC",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    marginRight: "10px",
  },
  userName: {
    fontWeight: "500",
  },
  pageTitle: {
    marginBottom: "30px",
    textAlign: "center",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    display: "flex",
    alignItems: "center",
  },
  statIcon: {
    fontSize: "24px",
    marginRight: "15px",
  },
  statInfo: {
    flex: 1,
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    minHeight: "300px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#38B2AC",
  },
  chartContainer: {
    height: "250px",
    display: "flex",
    flexDirection: "column",
  },
  weightChart: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: "220px",
    padding: "10px 0",
  },
  weightBar: {
    width: "30px",
    borderRadius: "4px 4px 0 0",
    position: "relative",
    transition: "height 0.3s ease",
  },
  weightLabel: {
    position: "absolute",
    top: "-25px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "12px",
    color: "#4B5563",
  },
  chartXAxis: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    color: "#6B7280",
    fontSize: "12px",
  },
  goalsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  goalItem: {
    marginBottom: "15px",
  },
  goalInfo: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "5px",
  },
  progressBarContainer: {
    height: "10px",
    backgroundColor: "#E5E7EB",
    borderRadius: "5px",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    transition: "width 0.3s ease",
  },
  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  activityItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#F3F4F6",
    borderRadius: "8px",
  },
  activityTypeIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    marginRight: "15px",
  },
  activityDetails: {
    flex: 1,
  },
  achievementsList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  achievementItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#F3F4F6",
    borderRadius: "8px",
    transition: "opacity 0.3s ease",
  },
  achievementBadge: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    marginRight: "15px",
  },
  achievementDetails: {
    flex: 1,
  },
  footer: {
    textAlign: "center",
    padding: "20px 0",
    color: "#6B7280",
    fontSize: "14px",
  },
  // Stats Summary Styles
  statsSummaryContainer: {
    marginBottom: "30px",
  },
  statsSummaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "16px",
  },
  statsSummaryCard: {
    borderRadius: "12px",
    padding: "20px",
    color: "white",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
  },
  statsSummaryIcon: {
    marginRight: "12px",
    fontSize: "24px",
    display: "flex",
    alignItems: "center",
  },
  statsSummaryContent: {
    flex: 1,
  },
  statsSummaryValue: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "4px",
  },
  statsSummaryLabel: {
    fontSize: "14px",
    opacity: 0.9,
  },
  workoutBreakdown: {
    fontSize: "14px",
    marginTop: "4px",
    marginBottom: "4px",
  },
  challengeProgress: {
    display: "flex",
    alignItems: "center",
    marginTop: "8px",
    marginBottom: "4px",
  },
  challengeProgressBar: {
    flex: 1,
    height: "8px",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: "4px",
    overflow: "hidden",
    marginRight: "8px",
  },
  challengeProgressFill: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: "4px",
  },
  challengeProgressText: {
    fontSize: "14px",
  },
  // Streaks Tab Styles
  streaksTabContainer: {
    marginBottom: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  streaksCard: {
    backgroundColor: "#3B82F6",
    backgroundImage: "linear-gradient(to right, #3B82F6, #2563EB)",
    borderRadius: "12px",
    padding: "24px",
    color: "white",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    position: "relative",
    overflow: "hidden",
  },
  streaksHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  streaksTitle: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  streaksDate: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: "4px 16px",
    borderRadius: "20px",
    fontSize: "14px",
  },
  streaksGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  streakItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    padding: "16px",
    backdropFilter: "blur(4px)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  streakHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
  },
  streakIcon: {
    fontSize: "24px",
    marginRight: "8px",
  },
  streakName: {
    fontWeight: "500",
  },
  streakStats: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  streakCurrent: {
    textAlign: "left",
  },
  streakCurrentValue: {
    fontSize: "28px",
    fontWeight: "bold",
    margin: 0,
  },
  streakCurrentLabel: {
    fontSize: "12px",
    opacity: 0.8,
    margin: 0,
  },
  streakBest: {
    textAlign: "right",
  },
  streakBestValue: {
    fontSize: "18px",
    fontWeight: "600",
    margin: 0,
  },
  streakBestLabel: {
    fontSize: "12px",
    opacity: 0.8,
    margin: 0,
  },
  // Milestones Styles
  milestonesCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    border: "1px solid #F3F4F6",
  },
  milestonesTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
  },
  milestonesIcon: {
    color: "#3B82F6",
    marginRight: "8px",
  },
  milestonesList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  milestoneItem: {
    position: "relative",
  },
  milestoneHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px",
  },
  milestoneDescription: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#1F2937",
    margin: 0,
  },
  milestoneProgress: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#3B82F6",
  },
  milestoneProgressBar: {
    height: "8px",
    backgroundColor: "#F3F4F6",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "8px",
  },
  milestoneProgressFill: {
    height: "100%",
    backgroundImage: "linear-gradient(to right, #3B82F6, #10B981)",
    borderRadius: "4px",
  },
  milestoneReward: {
    fontSize: "14px",
    color: "#6B7280",
    display: "flex",
    alignItems: "center",
  },
  milestoneRewardIcon: {
    color: "#F59E0B",
    marginRight: "4px",
  },
}

// Render the component
export default FitFlowProgress
