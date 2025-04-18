import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
} from "@mui/material";
import Dashboard from "/src/Components/DashboardTemplate";
import workoutbg from "/src/assets/videos/workout.mp4";

const Workout = () => {
  const [bodyType, setBodyType] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState("");
  const [workoutStyle, setWorkoutStyle] = useState("");
  const [healthConcerns, setHealthConcerns] = useState("");

  const navigate = useNavigate();

  const handleNext = async () => {
    if (!bodyType || !fitnessGoal || !fitnessLevel || !workoutStyle) {
        alert("Please fill out all required fields before submitting.");
        return;
    }

    const workoutDetails = {
        bodyType,
        fitnessGoal,
        fitnessLevel,
        workoutStyle,
        healthConcerns: healthConcerns || null, // Send null if healthConcerns is empty
        currentFitnessLevel: fitnessLevel, // Include currentFitnessLevel
    };

    console.log("Reconstructed POST payload:", JSON.stringify(workoutDetails, null, 2)); // Debugging log

    try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            alert("User not found. Please log in again.");
            return;
        }

        const userId = JSON.parse(storedUser).id || JSON.parse(storedUser).userId;
        const response = await axios.post(`http://localhost:8080/api/workouts/${userId}`, workoutDetails, {
            headers: {
                "Content-Type": "application/json", // Ensure proper content type
                "Authorization": `Bearer ${localStorage.getItem("token")}`, // Include token
            },
        });
        console.log("Response from backend:", response.data); // Debugging log

        const workout = response.data; // Directly access the workout object
        if (!workout.workoutStyle) {
            throw new Error("Missing workoutStyle in the response");
        }

        console.log("Workout saved:", workout);

        navigate(`/exercises?workoutStyle=${encodeURIComponent(workout.workoutStyle)}&workoutID=${workout.id}&userID=${userId}`);
    } catch (error) {
        console.error("Error saving workout details:", error.response?.data || error.message);
        alert("Failed to save workout details. Please try again.");
    }
  };

  const clearSelection = (setter) => {
    setter("");
  };

  return (
    <Dashboard>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 15,
          bgcolor: "#ffffff",
          borderRadius: "0 100px 100px 0",
          boxShadow: "0px 20px 20px rgba(0,0,0,0.1)",
          maxWidth: 650,
          height: 781,
          mx: "auto",
          position: "relative",
          zIndex: 1,
          left: -315,
          top: 0,
        }}
      >
        <Typography
          variant="h3"
          fontWeight="600"
          color="#12417f"
          sx={{ mb: 3, fontFamily: "'Outfit', sans-serif" }}
        >
          Describe Yourself
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            width: "100%",
          }}
        >
          <Box>
            <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
              Body Type
            </Typography>
            <RadioGroup
              value={bodyType}
              onChange={(e) => setBodyType(e.target.value)}
            >
              <FormControlLabel value="Slim" control={<Radio />} label="Slim" />
              <FormControlLabel
                value="Muscular"
                control={<Radio />}
                label="Muscular"
              />
              <FormControlLabel value="Large" control={<Radio />} label="Large" />
            </RadioGroup>
            {bodyType && (
              <Button
                variant="text"
                color="secondary"
                onClick={() => clearSelection(setBodyType)}
                sx={{ mt: 1 }}
              >
                Clear
              </Button>
            )}
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
              Fitness Goal
            </Typography>
            <RadioGroup
              value={fitnessGoal}
              onChange={(e) => setFitnessGoal(e.target.value)}
            >
              <FormControlLabel
                value="Build Muscle"
                control={<Radio />}
                label="Build Muscle"
              />
              <FormControlLabel
                value="Lose weight"
                control={<Radio />}
                label="Lose weight"
              />
              <FormControlLabel
                value="Maintain Fitness"
                control={<Radio />}
                label="Maintain Fitness"
              />
            </RadioGroup>
            {fitnessGoal && (
              <Button
                variant="text"
                color="secondary"
                onClick={() => clearSelection(setFitnessGoal)}
                sx={{ mt: 1 }}
              >
                Clear
              </Button>
            )}
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
              Fitness Level
            </Typography>
            <RadioGroup
              value={fitnessLevel}
              onChange={(e) => setFitnessLevel(e.target.value)}
            >
              <FormControlLabel
                value="Beginner"
                control={<Radio />}
                label="Beginner"
              />
              <FormControlLabel
                value="Intermediate"
                control={<Radio />}
                label="Intermediate"
              />
              <FormControlLabel
                value="Advance"
                control={<Radio />}
                label="Advance"
              />
            </RadioGroup>
            {fitnessLevel && (
              <Button
                variant="text"
                color="secondary"
                onClick={() => clearSelection(setFitnessLevel)}
                sx={{ mt: 1 }}
              >
                Clear
              </Button>
            )}
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
              Workout Style
            </Typography>
            <RadioGroup
              value={workoutStyle}
              onChange={(e) => setWorkoutStyle(e.target.value)}
            >
              <FormControlLabel
                value="Strength Training"
                control={<Radio />}
                label="Strength Training"
              />
              <FormControlLabel value="Cardio" control={<Radio />} label="Cardio" />
              <FormControlLabel
                value="Flexibility/Yoga"
                control={<Radio />}
                label="Flexibility/Yoga"
              />
            </RadioGroup>
            {workoutStyle && (
              <Button
                variant="text"
                color="secondary"
                onClick={() => clearSelection(setWorkoutStyle)}
                sx={{ mt: 1 }}
              >
                Clear
              </Button>
            )}
          </Box>

          <Box sx={{ gridColumn: "span 2" }}>
            <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
              Health Concerns
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter any health concerns"
              value={healthConcerns}
              onChange={(e) => setHealthConcerns(e.target.value)}
            />
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          sx={{
            bgcolor: "#1e5fb4",
            "&:hover": { bgcolor: "#12417f" },
            px: 4,
            py: 1,
            fontWeight: "600",
            mt: 3,
          }}
          onClick={handleNext}
        >
          Submit
        </Button>
      </Box>
      <video
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          top: 135,
          right: 0,
          width: "55%",
          height: "780px",
          objectFit: "cover",
          zIndex: 0,
        }}
      >
        <source src={workoutbg} type="video/mp4" />
      </video>

      <Box
        sx={{
          position: "absolute",
          bottom: -195,
          left: 0,
          width: "100%",
          bgcolor: "#12417f",
          color: "#ffffff",
          textAlign: "center",
          py: 2,
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        <Typography variant="body1" fontWeight="600" marginLeft={20}>
          "Every step counts. Start your fitness journey today!"
        </Typography>
      </Box>
    </Dashboard>
  );
};

export default Workout;