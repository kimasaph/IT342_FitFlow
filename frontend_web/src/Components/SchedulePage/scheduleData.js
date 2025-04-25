// Sample workout types with their colors
export const workoutTypes = {
  strength: { color: "#8b5cf6", label: "Strength" },
  cardio: { color: "#ef4444", label: "Cardio" },
  flexibility: { color: "#3b82f6", label: "Flexibility" },
  recovery: { color: "#10b981", label: "Recovery" },
};

// Sample workout data
const sampleWorkouts = [
  {
    id: 1,
    title: "Upper Body Strength",
    start: new Date(2025, 3, 22, 8, 0),
    end: new Date(2025, 3, 22, 9, 30),
    type: "strength",
    details: {
      exercises: [
        { name: "Bench Press", sets: 4, reps: "8-10", weight: "135 lbs" },
        { name: "Pull-ups", sets: 3, reps: "8-12", weight: "Body weight" },
        { name: "Shoulder Press", sets: 3, reps: "10-12", weight: "45 lbs" },
        { name: "Lat Pulldown", sets: 3, reps: "10-12", weight: "120 lbs" },
      ],
      notes: "Focus on proper form and slow negatives",
    },
    completed: false,
  },
  {
    id: 2,
    title: "HIIT Cardio",
    start: new Date(2025, 3, 23, 18, 0),
    end: new Date(2025, 3, 23, 19, 0),
    type: "cardio",
    details: {
      exercises: [
        { name: "Jump Squats", duration: "30 sec" },
        { name: "Rest", duration: "15 sec" },
        { name: "Mountain Climbers", duration: "30 sec" },
        { name: "Rest", duration: "15 sec" },
        { name: "Burpees", duration: "30 sec" },
        { name: "Rest", duration: "15 sec" },
        { name: "High Knees", duration: "30 sec" },
      ],
      rounds: 4,
      notes: "Complete all rounds with 1 minute rest between rounds",
    },
    completed: false,
  },
  {
    id: 3,
    title: "Leg Day",
    start: new Date(2025, 3, 24, 7, 30),
    end: new Date(2025, 3, 24, 9, 0),
    type: "strength",
    details: {
      exercises: [
        { name: "Squats", sets: 4, reps: "8-10", weight: "185 lbs" },
        { name: "Romanian Deadlifts", sets: 3, reps: "10-12", weight: "135 lbs" },
        { name: "Leg Press", sets: 3, reps: "12-15", weight: "250 lbs" },
        { name: "Calf Raises", sets: 4, reps: "15-20", weight: "120 lbs" },
      ],
      notes: "Stay hydrated throughout the workout",
    },
    completed: false,
  },
  {
    id: 4,
    title: "Yoga Flow",
    start: new Date(2025, 3, 25, 18, 30),
    end: new Date(2025, 3, 25, 19, 30),
    type: "flexibility",
    details: {
      exercises: [
        { name: "Sun Salutations", duration: "10 min" },
        { name: "Warrior Sequence", duration: "15 min" },
        { name: "Balance Poses", duration: "10 min" },
        { name: "Deep Stretching", duration: "15 min" },
        { name: "Meditation", duration: "10 min" },
      ],
      notes: "Focus on breath and mind-body connection",
    },
    completed: true,
  },
  {
    id: 5,
    title: "Active Recovery",
    start: new Date(2025, 3, 26, 9, 0),
    end: new Date(2025, 3, 26, 10, 0),
    type: "recovery",
    details: {
      exercises: [
        { name: "Light Walking", duration: "20 min" },
        { name: "Foam Rolling", duration: "15 min" },
        { name: "Stretching", duration: "15 min" },
        { name: "Mobility Work", duration: "10 min" },
      ],
      notes: "Keep intensity low, focus on recovery",
    },
    completed: false,
  },
];

// Sample meal schedule data
const sampleMealSchedule = [
  {
    id: 101,
    title: "Breakfast",
    start: new Date(2025, 3, 22, 7, 0),
    end: new Date(2025, 3, 22, 7, 30),
    type: "meal",
    mealType: "breakfast",
    details: {
      name: "Protein Oatmeal",
      calories: 450,
      protein: 30,
      carbs: 55,
      fats: 12,
    },
    completed: true,
  },
  {
    id: 102,
    title: "Lunch",
    start: new Date(2025, 3, 22, 12, 0),
    end: new Date(2025, 3, 22, 12, 30),
    type: "meal",
    mealType: "lunch",
    details: {
      name: "Chicken & Rice Bowl",
      calories: 650,
      protein: 45,
      carbs: 70,
      fats: 20,
    },
    completed: true,
  },
  {
    id: 103,
    title: "Dinner",
    start: new Date(2025, 3, 22, 19, 0),
    end: new Date(2025, 3, 22, 19, 30),
    type: "meal",
    mealType: "dinner",
    details: {
      name: "Salmon with Quinoa & Vegetables",
      calories: 550,
      protein: 40,
      carbs: 45,
      fats: 25,
    },
    completed: false,
  }
];

// Combined schedule data
export const initialScheduleData = [...sampleWorkouts, ...sampleMealSchedule];